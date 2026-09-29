# CONSTITUTION — Hotel Code (Frontend)

Principios **no negociables** de este repositorio. Si se rompen, generan bugs reales o deuda seria.
Cada máxima cita el archivo/patrón que la sostiene. No agregar reglas sin evidencia en el código.

## Identidad del producto
- SPA de gestión hotelera "Hotel Code": catálogo de habitaciones, reservas de clientes y panel de administración (habitaciones, usuarios, reservas). — `README.md`, `src/App.jsx`
- Todo el producto está en **español** (UI, mensajes, nombres de variables, commits). Mantenerlo. — todo el `src/`

## Stack fijo (no sustituir sin decisión explícita del equipo)
- **React 18 + Vite 5**, JavaScript con JSX. **No hay TypeScript** (no hay `tsconfig`, no hay `.ts/.tsx`; `@types/react` está instalado pero sin usar). — `package.json`, `vite.config.js`
- **react-router-dom v6** para ruteo, **react-hook-form** para formularios, **react-bootstrap + bootstrap 5 + bootstrap-icons** para UI, **sweetalert2** para alertas, **@emailjs/browser** para el form de contacto. — `package.json`, `src/App.jsx`

## Máximas

1. **El backend se consume solo a través de `peticion()` de `src/helpers/api.js`**, envuelta por funciones de dominio en `src/helpers/queries*.js`. El único `fetch` del proyecto está en `api.js`; ningún componente hace `fetch`/`axios` propio. `peticion` nunca lanza y devuelve siempre `{ ok, status, datos }`; el componente chequea `ok` antes de usar `datos` y muestra `datos.mensaje` del back en los errores. — `api.js`, `queries.js`, `queries.reserva.js`, `queries.usuarios.js`

2. **La URL del backend sale siempre de `import.meta.env.VITE_API_URL`** (única variable de API; fallback `http://localhost:4000/api` solo para desarrollo). Nunca hardcodear una URL de backend en otro lado. Toda variable de entorno leída en el cliente **debe** empezar con `VITE_` (ej. `VITE_EMAILJS_*` en `Contacto.jsx`). — `api.js`, `netlify.toml`, `.env.example`

3. **La sesión vive en `sessionStorage` bajo UNA sola clave `userKey`** (objeto JSON `{ uid, email, rol, token }`) y solo se lee/escribe mediante `src/helpers/sesion.js` (`guardarSesion`, `obtenerSesion`, `borrarSesion`, `tokenExpirado`, `esAdmin`). No hay claves auxiliares: el vencimiento se toma del `exp` real del JWT. — `sesion.js`, `Login.jsx`, `Menu.jsx`, `TiempoToken.jsx`

4. **Nadie fuera de `sesion.js` toca `sessionStorage`.** Los componentes leen la sesión de la prop `usuarioLogueado` (estado de `App.jsx`, objeto o `null`); `obtenerSesion()` ya devuelve `null` si no hay sesión o está corrupta. Un 401 en una petición autenticada cierra la sesión y manda a `/login` (`api.js` → evento `sesion-vencida` → `TiempoToken`). — `sesion.js`, `api.js`, `TiempoToken.jsx`

5. **El token se manda como header `x-token`** (no `Authorization: Bearer`). Lo agrega `peticion` cuando se llama con `auth: true`. — `api.js`

6. **Las rutas de `/administrador` van envueltas en `<RutasProtegidas soloAdmin>` y viven en `RutasAdmin`**: sin sesión redirige a `/login`, sin rol admin a `/`. `/reservas` va en `<RutasProtegidas>` (requiere sesión). Ninguna vista privada se expone sin esa guarda. — `App.jsx`, `routes/RutasProtegidas.jsx`, `routes/RutasAdmin.jsx`

7. **Toda confirmación destructiva (borrar) pasa por un `Swal.fire` con `showCancelButton`.** No hay borrado sin confirmación previa. — `ItemHabitacion.jsx:12-21`, `ItemUsuarios.jsx:14-23`, `ItemReservasAdmin.jsx:21-30`, `ItemReservas.jsx:19-28`

8. **Los colores de marca salen de las variables CSS de `:root` en `App.css`** (`--dorado-metalico`, `--azul-marino`, etc.). No inventar paletas nuevas por componente. — `App.css:12-20`
   - Deuda conocida: hoy se repite `#D4AF37`/`#001f3f` hardcodeado (`App.css:61-205`). Código nuevo usa la variable, no el hex.

9. **Estilo visual = utilidades de Bootstrap en el JSX + clases de `App.css`.** No se usan CSS Modules, styled-components ni `style={{}}` inline. — todos los componentes

10. **No hay tests ni CI.** El único control automático es `npm run lint` (ESLint 9 flat config). Antes de dar por cerrado un cambio, corre `npm run lint` y `npm run build`. — `package.json:6-11`, `eslint.config.js`
