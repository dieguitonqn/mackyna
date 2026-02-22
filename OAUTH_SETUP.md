# Configuración de Google OAuth para NextAuth

## Pasos para configurar Google OAuth

### 1. Crear proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ en la biblioteca de APIs

### 2. Configurar OAuth 2.0
1. Ve a **Credenciales** en el menú lateral
2. Haz clic en **Crear credenciales** → **ID de cliente OAuth 2.0**
3. Selecciona **Aplicación web**
4. Configura las URLs autorizadas:

#### URIs de redirección autorizadas:
- Para desarrollo: `http://localhost:3000/api/auth/callback/google`
- Para producción: `https://tudominio.com/api/auth/callback/google`

#### Orígenes de JavaScript autorizados:
- Para desarrollo: `http://localhost:3000`
- Para producción: `https://tudominio.com`

### 3. Variables de entorno
Copia las credenciales y agrégalas a tu archivo `.env`:

```bash
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
NEXTAUTH_URL=http://localhost:3000  # Cambiar en producción
NEXTAUTH_SECRET=un-secreto-muy-seguro-aqui
```

### 4. URLs importantes para el webhook

El endpoint de callback de Google OAuth es:
- **Desarrollo**: `http://localhost:3000/api/auth/callback/google`
- **Producción**: `https://tudominio.com/api/auth/callback/google`

### 5. Ejecutar con Docker

```bash
# Construir la imagen
docker build -t mackyna:latest .

# Ejecutar con docker-compose (recomendado)
docker-compose up -d

# O ejecutar directamente con docker run
docker run -d \
  --name mackyna-app \
  -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=tu-secreto-aqui \
  -e GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com \
  -e GOOGLE_CLIENT_SECRET=tu-client-secret \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/mackyna \
  -e TURNSTILE_SECRET_KEY=tu-turnstile-secret \
  mackyna:latest
```

### Notas importantes:
- El `NEXTAUTH_SECRET` debe ser una cadena aleatoria y segura
- En producción, asegúrate de cambiar `NEXTAUTH_URL` por tu dominio real
- Las URLs de callback deben coincidir exactamente con las configuradas en Google Cloud Console