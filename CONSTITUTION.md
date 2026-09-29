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

1. **El backend se consume solo desde `src/helpers/queries*.js` con `fetch` nativo.** Ningún componente hace `fetch`/`axios` propio. — `src/helpers/queries.js`, `queries.reserva.js`, `queries.usuarios.js`
   - Excepción viva que **no** hay que imitar: `DetalleHabitacion.jsx:75` hace `fetch` inline. Es deuda; endpoints nuevos van en `helpers/`.

2. **Las URLs de API salen siempre de `import.meta.env.VITE_API_*`.** Nunca hardcodear una URL de backend. Toda variable de entorno leída en el cliente **debe** empezar con `VITE_`. — `src/helpers/queries.js:1-2`
   - Bug activo que lo demuestra: `Contacto.jsx:8-10` lee `import.meta.env.SERVICE/TEMPLATE/PUBLIC_KEY` sin prefijo `VITE_` → siempre `undefined`. No repetir.

3. **El token JWT vive en `sessionStorage` bajo la clave `userKey`** (objeto JSON `{ email, token, rol }`), más las claves auxiliares `token` y `expiracionToken`. Login escribe las tres; logout y expiración borran las tres. Cambiar el nombre de una clave sin cambiarlas todas rompe la sesión. — `Login.jsx:53-69`, `Menu.jsx:6-12`, `TiempoToken.jsx:18-21`

4. **Nunca acceder a `sessionStorage.getItem("userKey")` sin guarda de null.** El patrón `JSON.parse(sessionStorage.getItem("userKey")).token` tira excepción si no hay sesión. Usar `JSON.parse(...) || null` y cortar antes. — patrón correcto en `RutasProtegidas.jsx:4`, `Menu.jsx:13`; frágil en `queries.js:40,59,84,107,150` y `queries.reserva.js:9`

5. **El token se manda como header `x-token`** (no `Authorization: Bearer`). Todo endpoint autenticado usa `"x-token": <token>`. — `queries.js:40,59,84`, `queries.reserva.js:9,53,67`, `queries.usuarios.js:52,67,81`

6. **Las rutas de `/administrador` van envueltas en `<RutasProtegidas>` y viven en `RutasAdmin`.** Ninguna vista de admin se expone sin esa guarda. — `App.jsx:54-62`, `routes/RutasAdmin.jsx`

7. **Toda confirmación destructiva (borrar) pasa por un `Swal.fire` con `showCancelButton`.** No hay borrado sin confirmación previa. — `ItemHabitacion.jsx:12-21`, `ItemUsuarios.jsx:14-23`, `ItemReservasAdmin.jsx:21-30`, `ItemReservas.jsx:19-28`

8. **Los colores de marca salen de las variables CSS de `:root` en `App.css`** (`--dorado-metalico`, `--azul-marino`, etc.). No inventar paletas nuevas por componente. — `App.css:12-20`
   - Deuda conocida: hoy se repite `#D4AF37`/`#001f3f` hardcodeado (`App.css:61-205`). Código nuevo usa la variable, no el hex.

9. **Estilo visual = utilidades de Bootstrap en el JSX + clases de `App.css`.** No se usan CSS Modules, styled-components ni `style={{}}` inline. — todos los componentes

10. **No hay tests ni CI.** El único control automático es `npm run lint` (ESLint 9 flat config). Antes de dar por cerrado un cambio, corre `npm run lint` y `npm run build`. — `package.json:6-11`, `eslint.config.js`
