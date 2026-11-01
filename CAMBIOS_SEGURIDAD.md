# Cambios de seguridad y limpieza funcional

Este documento resume los cambios realizados en esta rama durante la revisión y remediación de seguridad.

## Autenticación y sesiones

- Se centralizó la configuración de NextAuth y la validación de sesión activa.
- Se comprueba que la cuenta exista, esté habilitada y no esté bloqueada antes de aceptar una sesión en las rutas protegidas.
- El acceso del portal de profesores se limita a `admin`, `teacher` y el rol heredado `teach`.
- El acceso por Google también requiere una cuenta habilitada y no bloqueada.
- Se quitó el log que imprimía las credenciales del formulario de inicio de sesión.

## Perfil y contraseñas

- Se agregó `/api/me` para que cada persona consulte y actualice únicamente los campos permitidos de su perfil.
- El cambio de contraseña propia requiere la contraseña actual.
- Los endpoints administrativos de contraseña restringen a teachers a cuentas de alumnos; solo admin puede operar sobre cuentas del personal.
- Se implementó el cambio de email en dos pasos, sin envío de correo: el teacher deja una solicitud pendiente y el alumno la confirma desde su sesión con su contraseña actual y volviendo a escribir el email solicitado. El alumno también puede rechazarla; las solicitudes vencen a los siete días.
- La solicitud pendiente no cambia el email de acceso hasta que el alumno confirma.

## Autorización de APIs y validación de datos

- Se restringieron las operaciones de usuarios, ejercicios, métricas, planillas y logs a los roles permitidos.
- Los alumnos solo pueden consultar sus propias planillas y modificar las notas permitidas en ellas.
- Se aplicaron listas de campos editables, validación de IDs, límites de tamaño y validación de valores en las APIs modificadas.
- Las respuestas de gestión de usuarios excluyen el hash de contraseña.
- Las rutas de plantillas ahora exigen sesión de personal para leer, crear o actualizar. La acción de borrado también valida sesión, rol e ID.
- Se limitó el tamaño y los campos aceptados por la API de plantillas.
- El portal de profesores valida la sesión y el rol en el servidor antes de renderizar sus páginas, incluida la página que muestra cumpleaños.

## Registro de alumnos

- El alta asigna en el servidor el rol `user` y los estados iniciales de habilitación y bloqueo; no acepta esos permisos desde el cuerpo recibido.
- Se normaliza el email y se eliminó el log del cuerpo completo de registro.
- Turnstile permanece como requisito para el alta.

## Retiro de funciones que el cliente no usará

- Se retiraron los módulos de tienda, ventas y pagos, junto con las integraciones y dependencias de Mercado Pago asociadas.
- Se retiraron turnos y reservas, sus rutas, modelos, pantallas y controles relacionados.
- Se quitaron enlaces de navegación y recursos públicos asociados a esas funciones.
- La configuración de Strapi se separó de la tienda y el enlace de administración aparece solo cuando existe `STRAPI_HOST`.
- Los comprobantes dejaron de estar en `public/`. Las copias locales de `private/` no se incluyen en Git para evitar subir documentos potencialmente sensibles.

## Deuda técnica pendiente

- El endpoint de inicio de sesión con credenciales todavía no tiene limitación de intentos implementada en la aplicación. Se acordó dejarla para más adelante y revisar también el límite en Cloudflare o el proxy de entrada.
- El flujo de cambio de email confirma la intención del alumno mediante su contraseña y la coincidencia del email ingresado; sin un relay de correo no verifica de forma independiente que tenga acceso al buzón nuevo.

## Verificación realizada

- `git diff --check` no reportó errores de formato.
- `npx tsc --noEmit` continúa reportando errores de tipos en `src/app/portalAlumnos/Metricas/page.tsx` (propiedades del usuario inferidas sobre un tipo unión de documento/arreglo). No se ejecutaron tests.
