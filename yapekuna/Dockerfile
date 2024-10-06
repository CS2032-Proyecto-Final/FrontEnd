# Usa la imagen oficial de Node.js v22 como base
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Exponer el puerto en el que la aplicación Next.js correrá (habitualmente 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
