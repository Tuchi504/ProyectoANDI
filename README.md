# Sistema de Gestión de Laboratorio - Frontend

Este proyecto es el frontend para el Sistema de Gestión de Laboratorio de la UNAH, desarrollado con React, Vite y Tailwind CSS.

## Requisitos Previos

- Node.js (v16 o superior)
- Backend FastAPI corriendo en `http://localhost:8000`

## Instalación

1.  Clonar el repositorio o descargar el código.
2.  Instalar las dependencias:

```bash
npm install
```

Si tienes problemas con las versiones, usa:

```bash
npm install -D tailwindcss@3.4.17 postcss autoprefixer && npm install axios react-router-dom formik yup react-toastify daypilot-lite-react @headlessui/react @heroicons/react clsx tailwind-merge
```

## Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Estructura del Proyecto

- `src/api`: Configuración de Axios e interceptores.
- `src/components`: Componentes reutilizables (UI) y de layout.
- `src/context`: Contexto de autenticación.
- `src/pages`: Vistas de la aplicación (Auth, Dashboard, Inventarios).
- `src/router`: Configuración de rutas.

## Funcionalidades

- **Autenticación**: Login y Registro con validación de token.
- **Reservas**: Calendario interactivo para gestionar prácticas de laboratorio.
- **Inventario Reactivos**: Gestión completa (CRUD) de reactivos químicos.
- **Inventario Cristalería**: Gestión completa (CRUD) de cristalería con cálculo de totales.
