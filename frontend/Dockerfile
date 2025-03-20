FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci
# Instalar el nuevo paquete
RUN npm install @tailwindcss/postcss

COPY . .

# Actualizar la configuración de PostCSS
RUN echo 'export default { plugins: { "@tailwindcss/postcss": {}, autoprefixer: {} } }' > postcss.config.js

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]