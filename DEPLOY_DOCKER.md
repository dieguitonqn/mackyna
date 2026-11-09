# Despliegue Docker en VPS

Esta guía conserva MongoDB instalado en Ubuntu, conecta Next con el Strapi existente y permite probar Next en `127.0.0.1:5001` antes de cambiar Nginx desde PM2.

## 1. Crear y publicar la imagen

El VPS debe ser `linux/amd64` para usar los comandos de abajo (`dpkg --print-architecture` permite comprobarlo). Hacer el build en una máquina de desarrollo o CI, no en el VPS de 2 GB.

El `package-lock.json` fija las dependencias y el Dockerfile instala con `npm ci` para que cada build use esas versiones.

Construir una etiqueta inmutable para pruebas:

```bash
docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY='CLAVE_PUBLICA_TURNSTILE' \
  --tag ghcr.io/OWNER/mackyna:docker-test-2026-11-02 \
  --load .
```

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` es pública y queda incluida en el JavaScript del navegador durante el build. El mapa usa OpenStreetMap y no requiere una clave. No pasar secretos de servidor como argumentos de build.

Publicar en GHCR:

```bash
docker login ghcr.io -u OWNER
docker push ghcr.io/OWNER/mackyna:docker-test-2026-11-02
```

Usar un token de GHCR con `write:packages` al publicar y `read:packages` al hacer pull. No guardar el token en este repositorio.

## 2. Revisar la VPS antes de tocar servicios

Conservar PM2 funcionando mientras se prueba Docker. Primero revisar arquitectura, memoria, puertos y redes actuales:

```bash
dpkg --print-architecture
free -h
docker ps --format 'table {{.Names}}\t{{.Ports}}'
docker network ls
sudo ss -lntp | grep -E ':(27017|1337|3000|5001)\b'
```

Identificar el nombre del contenedor de Strapi y las redes a las que ya pertenece:

```bash
docker inspect NOMBRE_CONTENEDOR_STRAPI --format '{{json .NetworkSettings.Networks}}'
```

## 3. Red interna para Next y Strapi

Tu contenedor `mackyna-store` ya está conectado a `mackynaback_strapi-network` y tiene el alias `strapi`. Reutilizá esa red; no hace falta crear otra ni volver a conectar Strapi. En `compose.env`, usar:

```bash
STRAPI_DOCKER_NETWORK=mackynaback_strapi-network
```

Tu contenedor publica Strapi por `1337` en todas las interfaces. Se puede conservar así durante la prueba: Next usará el alias Docker `strapi` por la red interna, y el navegador seguirá usando la dirección pública configurada en `STRAPI_HOST`.

La aplicación usa dos direcciones distintas:

- `STRAPI_API_URL=http://strapi:1337/api` para llamadas desde el servidor Next por la red Docker.
- `STRAPI_HOST=http://IP_PUBLICA:1337` para las URLs de imágenes y el enlace de administración que usa el navegador.

Si luego se cambia Strapi a un dominio, actualizar también `images.remotePatterns` en `next.config.js` antes de reconstruir la imagen.

## 4. Conectar con MongoDB instalado en Ubuntu

Mongo actualmente escucha solo en `127.0.0.1`, así que Next todavía no puede alcanzarlo. La red Docker existente tiene gateway `172.18.0.1`. Compose configura `host.docker.internal` con esa IP mediante `MONGO_HOST_GATEWAY`; así se conserva un hostname estable para `MONGODB_URI`. No es `network_mode: host` ni publica el puerto de Mongo.

Antes de cambiar la configuración, confirmar el gateway actual con `docker network inspect mackynaback_strapi-network --format '{{(index .IPAM.Config 0).Gateway}}'`. En `/etc/mongod.conf`, mantener `127.0.0.1` y agregar ese gateway a `net.bindIp`, por ejemplo `127.0.0.1,172.18.0.1`. MongoDB permite una lista de direcciones de escucha; no usar `0.0.0.0` ni `net.bindIpAll`. Mantener autenticación habilitada y no publicar el puerto `27017` en Internet. [Opciones oficiales de `net.bindIp`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.bindIp).

Al reiniciar MongoDB para aplicar el cambio, revisar `sudo ss -lntp | grep 27017`: debe mostrar `127.0.0.1:27017` y el gateway Docker, no `0.0.0.0:27017`. En Compose, fijar `MONGO_HOST_GATEWAY=172.18.0.1` dentro de `compose.env`.

El valor de `MONGODB_URI` en `~/mackyna/app.env` tendrá una forma como:

```text
mongodb://USUARIO:PASSWORD_URL_ENCODED@host.docker.internal:27017/Mackyna?authSource=admin
```

Usar la base de autenticación correcta para el usuario Mongo existente. Codificar en URL los caracteres especiales de la contraseña. Antes de arrancar Next, validar desde un contenedor de la misma red que `host.docker.internal:27017` conecta y que una conexión desde fuera del VPS no lo hace.

## 5. Configurar entorno y Compose

Crear un directorio privado en tu home del VPS, fuera del repo:

```bash
mkdir -p ~/mackyna
chmod 700 ~/mackyna
touch ~/mackyna/app.env ~/mackyna/compose.env
chmod 600 ~/mackyna/app.env ~/mackyna/compose.env
nano ~/mackyna/app.env
nano ~/mackyna/compose.env
```

`app.env` debe contener, con los valores reales del entorno de prueba:

```text
NEXTAUTH_URL=https://docker-test.TU_DOMINIO
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MONGODB_URI=mongodb://...
STRAPI_API_URL=http://strapi:1337/api
STRAPI_API_TOKEN=...
STRAPI_HOST=http://IP_PUBLICA:1337
TURNSTILE_SECRET_KEY=...
```

`compose.env` contiene solo valores de Compose, no secretos de aplicación:

```text
GHCR_IMAGE=ghcr.io/OWNER/mackyna:docker-test-2026-11-02
STRAPI_DOCKER_NETWORK=mackynaback_strapi-network
MONGO_HOST_GATEWAY=172.18.0.1
APP_HOST_PORT=5001
```

`NEXTAUTH_URL` debe coincidir con el hostname público de prueba. Autorizar ese hostname en Google OAuth y Cloudflare Turnstile mientras dure la prueba.

Copiar `compose.yaml` a `~/mackyna/compose.yaml`, iniciar sesión en GHCR con permiso `read:packages` y arrancar:

```bash
cd ~/mackyna
docker compose --env-file compose.env pull
docker compose --env-file compose.env up -d
docker compose ps
docker compose logs --tail=100 web
curl -I http://127.0.0.1:5001
```

El puerto 5001 queda publicado solo en loopback: Nginx puede acceder, Internet no. El límite de memoria se definirá después de observar `free -h` y `docker stats` con Next, MongoDB y Strapi activos; no compilar en la VPS.

## 6. Probar detrás de Nginx y migrar con rollback

Crear primero un registro DNS `A` para un subdominio de prueba apuntando a la IP de la VPS. Crear temporalmente un `server` de Nginx para ese hostname con HTTPS y `proxy_pass http://127.0.0.1:5001`. Mantener intacto el `server` actual que apunta a PM2. Si el certificado no cubre el subdominio, emitir uno antes de probar. Probar login, Google OAuth, Turnstile, carga de imágenes de Strapi, consultas a Mongo y las rutas principales.

Al migrar, cambiar el `proxy_pass` del hostname de producción de PM2 a `http://127.0.0.1:5001`, validar y recargar:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Rollback: restaurar el `proxy_pass` anterior hacia PM2 y recargar Nginx. No detener PM2 hasta validar la aplicación Docker en producción.

## 7. Actualizaciones y operación

Para cada build, usar una etiqueta nueva; evitar reemplazar una etiqueta que ya esté en uso. El rollback consiste en volver el `GHCR_IMAGE` a la etiqueta anterior y ejecutar `docker compose pull && docker compose up -d`.

El Dockerfile usa Node 24 LTS, build multi-stage, salida standalone y usuario sin privilegios. `.dockerignore` evita copiar `.env*`, `.git`, `private/`, `node_modules`, logs y archivos de prueba al contexto de build.
