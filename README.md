# Flapp E-Commerce

Aplicación frontend-backend para simular una plataforma de comercio electrónico llamada "Flapp", que permite generar un carrito de compras aleatorio, visualizarlo y cotizar envíos.

## Tecnologías utilizadas

### Backend

- Node.js
- Express.js
- TypeScript
- Jest (para pruebas)
- Axios (para comunicación HTTP)

### Frontend

- React.js
- TypeScript
- React Router
- Tailwind CSS
- Axios

### Infraestructura

- Docker y Docker Compose

## Requisitos previos

Para ejecutar la aplicación, necesitas tener instalado:

- Node.js v16 o superior
- npm v8 o superior
- Docker y Docker Compose (para la opción con contenedores)

## Instrucciones de ejecución

Hay dos formas de ejecutar la aplicación:

### 1. Ejecución con Docker (recomendado)

Esta es la forma más sencilla y garantiza que todo funcione correctamente en cualquier entorno:

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/flapp-ecommerce.git
cd flapp-ecommerce
```

2. Ejecuta con Docker Compose:

```bash
docker-compose up --build
```

3. Accede a la aplicación:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000/api

### 2. Ejecución manual (desarrollo)

Si prefieres ejecutar la aplicación sin Docker, sigue estos pasos:

#### Backend

1. Navega a la carpeta del backend:

```bash
cd backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en: http://localhost:3000

#### Frontend

1. En otra terminal, navega a la carpeta del frontend:

```bash
cd frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia la aplicación React en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## Modo de uso

1. En la página principal, haz clic en el botón "Generar carrito" para obtener un carrito aleatorio de productos.

2. Una vez generado el carrito, haz clic en "Finalizar compra" para continuar al proceso de checkout.

3. En la página de checkout:

   - Verás un resumen detallado de los productos en tu carrito.
   - Ingresa tus datos de envío en el formulario.
   - Haz clic en "Cotizar despacho" para obtener la mejor tarifa de envío.
   - Si deseas comenzar de nuevo, usa "Limpiar carrito".
   - Para volver a la página principal sin limpiar el carrito, usa "Volver".

4. Cuando solicites la cotización, verás:
   - En caso de éxito: El courier seleccionado y el precio del envío.
   - En caso de fallo: Un mensaje indicando que no hay envíos disponibles.

## Pruebas

Para ejecutar las pruebas del backend:

```bash
cd backend
npm test
```

## Supuestos considerados

1. **Datos de productos**: La API de DummyJSON no proporciona todos los datos que necesitamos, por lo que:

   - Las dimensiones de los productos se asumen con valores genéricos para calcular el volumen.
   - Los descuentos se calculan como un 10% del precio \* cantidad.

2. **Stock real**: La fórmula `Sr = ⌊St/r⌋` puede dar como resultado 0 si el rating es muy alto y el stock es bajo, lo que impediría la compra incluso si hay stock físico disponible.

3. **Comunicación API**: Se asume que el backend y frontend estarán en el mismo dominio o que el backend tiene CORS configurado correctamente.

4. **Datos del carrito aleatorio**: Se utiliza la API de DummyJSON para generar un carrito aleatorio, pero adaptamos su formato al requerido por nuestra aplicación.

5. **Servicios de envío**: Se asume que las credenciales proporcionadas para los servicios de envío son válidas y que los servicios están disponibles.

## Estructura del proyecto

```
flapp-ecommerce/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── __tests__/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Bonus completados

1. ✅ **Dockerización**: La aplicación está completamente dockerizada y se puede ejecutar con un simple comando.

2. ✅ **Pruebas**: Se han implementado pruebas para el endpoint de tarificación (/api/cart).

3. ✅ **Despliegue**: Instrucciones para desplegar la aplicación en servicios como Heroku o cualquier proveedor que soporte Docker.

## Posibles mejoras

- Implementar autenticación de usuarios.
- Añadir persistencia de datos con una base de datos.
- Mejorar la experiencia de usuario con animaciones y transiciones.
- Implementar funcionalidad de búsqueda y filtrado de productos.
- Añadir más pruebas, incluyendo pruebas end-to-end.
- Implementar CI/CD para automatizar el despliegue.
