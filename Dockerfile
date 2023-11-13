# Usa una imagen base con Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json a la imagen
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto 3000 (o el puerto que use tu aplicación)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
