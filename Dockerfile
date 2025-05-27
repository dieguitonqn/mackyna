# Usar una imagen base oficial de Node.js
FROM node:23-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Establecer las variables de entorno necesarias para la conexión con MongoDB y APIs externas
# Estas variables pueden ser sobrescritas al ejecutar el contenedor
#ENV MONGO_URI="mongodb://localhost:27017" 
#ENV API_KEY=""

# Construir la aplicación si es necesario (por ejemplo, para Next.js)
RUN npm run build

# Exponer el puerto en el que la aplicación escucha
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]