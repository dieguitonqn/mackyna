# Dockerfile optimizado para Next.js con multi-stage build
FROM node:22-alpine AS base

WORKDIR /app

# Instalar dependencias basado en el gestor de paquetes
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .

# Variables de entorno de construcción
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicación para producción
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Variables de entorno para NextAuth - estas deben ser configuradas al ejecutar el contenedor
# En desarrollo local usar: http://localhost:3000
# En producción usar tu dominio: https://tudominio.com
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Variables para Google OAuth
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# Variables adicionales que usa tu app
ENV MONGODB_URI=${MONGODB_URI}
ENV TURNSTILE_SECRET_KEY=${TURNSTILE_SECRET_KEY}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Crear directorio logs con permisos correctos
RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

# Copiar archivos necesarios
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev && npm cache clean --force

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]