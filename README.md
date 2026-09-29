# Hotel Code - Frontend

Bienvenido al repositorio del frontend de **Hotel Code**, un sistema de gestión para hoteles que permite a los usuarios buscar habitaciones disponibles, realizar reservas, y gestionar su estadía de manera cómoda y eficiente.

## 🌐 Demo en Producción

Puedes acceder a la versión en producción en [https://hotel-code.netlify.app](https://hotel-code.netlify.app).

## 👥 Integrantes

- [**Haurane Gabriel Alejandro**](https://github.com/GabrielHaurane)
- [**Brito Augusto Patricio**](https://github.com/BritoAugusto)

## 🚀 Características

- **Búsqueda de habitaciones**: Filtra habitaciones según disponibilidad y otros criterios.
- **Reservas**: Completa reservas especificando fechas de entrada y salida.
- **Gestión de Usuarios**: Registro e inicio de sesión para clientes.
- **Interfaz Amigable**: Diseño atractivo y responsivo para una excelente experiencia de usuario.
- **Notificaciones de éxito y error**: Feedback visual con SweetAlert2.

## 🛠️ Tecnologías Utilizadas

- **React + Vite**: Desarrollo de la interfaz del usuario.
- **JavaScript (JS)**: Lógica del frontend.
- **HTML5 y CSS3**: Estructura y estilos básicos.
- **Bootstrap**: Diseño responsivo y componentes predefinidos.
- **SweetAlert2**: Notificaciones interactivas y personalizadas para mejorar la experiencia del usuario.

## 📸 Captura de Pantalla

![Hotel code](https://github.com/user-attachments/assets/b8c864d8-0418-418d-bf0e-b83448574eff)

## 📂 Instalación y Ejecución Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Pasos de Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/GabrielHaurane/Frontend-Proyecto-Final.git
2. Accede al directorio del proyecto:
   cd Frontend-Proyecto-Final
3. Instala las dependencias:
   npm install
4. Configura las variables de entorno: copia `.env.example` a `.env` en la raíz del proyecto y completa los valores (URL de la API del backend y claves de EmailJS).
5. Inicia el proyecto en modo desarrollo:
   npm run dev
El proyecto debería estar corriendo en http://localhost:5173.

## 📖 Uso del Proyecto
1. Inicio de Sesión/Registro: Los usuarios pueden crear una cuenta y autenticarse en el sistema.
2. Búsqueda de Habitaciones: En el catálogo (público, no requiere sesión) se ven las habitaciones disponibles y se puede filtrar por fecha de entrada y salida.
3. Reserva de Habitaciones: Selecciona una habitación y especifica las fechas para realizar una reserva (requiere iniciar sesión).
4. Notificaciones: Al completar acciones como reserva o inicio de sesión, el sistema muestra notificaciones visuales para confirmar la operación.
## 📄 Variables de Entorno
Asegúrate de configurar las siguientes variables en el archivo .env (ver `.env.example`):

| Variable | Uso |
|---|---|
| `VITE_API_URL` | URL base del backend (sin barra final). Si falta, se usa `http://localhost:4000/api`. |
| `VITE_EMAILJS_SERVICE_ID` | Service ID de EmailJS (formulario de Contacto). |
| `VITE_EMAILJS_TEMPLATE_ID` | Template ID de EmailJS. |
| `VITE_EMAILJS_PUBLIC_KEY` | Public key de EmailJS. |

Ejemplo:
```
VITE_API_URL=http://localhost:4000/api
```

En Netlify, `VITE_API_URL` ya está definida en `netlify.toml`; las `VITE_EMAILJS_*` se cargan en *Site settings → Environment variables*.

## 🧱 Arquitectura del cliente
- `src/helpers/api.js`: capa HTTP única (`peticion`), arma la URL con `VITE_API_URL`, agrega el header `x-token` y devuelve siempre `{ ok, status, datos }`.
- `src/helpers/queries*.js`: funciones por dominio (habitaciones, reservas, usuarios) sobre `peticion`.
- `src/helpers/sesion.js`: sesión en `sessionStorage` bajo la clave `userKey` (`{ uid, email, rol, token }`) y control de vencimiento del JWT.
