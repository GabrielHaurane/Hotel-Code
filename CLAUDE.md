# CLAUDE.md — Hotel Code (Frontend)

Guía operativa para trabajar en este repo desde el primer mensaje. Leer también `CONSTITUTION.md` (lo no negociable) y `.claude/rules/` (el detalle por convención).

## Contexto del producto
SPA de hotelería en español: sitio público (inicio, catálogo, detalle de habitación, reservas, contacto, galería, ubicación) + login/registro + panel `/administrador` (CRUD de habitaciones, gestión de usuarios y reservas). Backend externo consumido por HTTP; este repo es **solo frontend**. — `README.md`, `src/App.jsx`

## Stack
- React 18.3 + Vite 5.4, JavaScript/JSX (sin TypeScript). — `package.json`
- Ruteo: react-router-dom 6.27 (`BrowserRouter` en `App.jsx`).
- Formularios: react-hook-form 7.53.
- UI: react-bootstrap 2.10 + bootstrap 5.3 + bootstrap-icons 1.11.
- Alertas: sweetalert2 (`Swal.fire`).
- Email: @emailjs/browser (solo `Contacto.jsx`).
- Lint: ESLint 9 flat config (`eslint.config.js`). Sin tests, sin CI, sin Prettier.

## Comandos
```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # build de producción
npm run lint     # ESLint sobre todo el repo
npm run preview  # previsualizar el build
```
No hay `npm test` ni typecheck (no hay TS). "Verificar" = `npm run lint` + `npm run build`.

## Paths / imports
- **No hay alias configurado** (`vite.config.js` está vacío salvo el plugin React). Los imports son **relativos** (`../`, `../../`, `../../../`). — `vite.config.js`, `ItemReservas.jsx:4`
- Assets de imagen se importan como módulo (`import logo from "../assets/logo-hotelcode.jpg"`) y las URLs remotas salen de `src/components/assets/imagenes.js`. — `Menu.jsx:3`, `imagenes.js`

## Estructura de carpetas (real)
```
src/
├── App.jsx              # router + estado de sesión (usuarioLogueado)
├── App.css             # ÚNICO archivo de estilos globales + variables :root
├── main.jsx
├── Admin/              # componentes SOLO del panel admin (formulario + filas de tabla)
│   ├── FormularioHabitacion.jsx
│   ├── ItemHabitacion.jsx
│   ├── ItemReservasAdmin.jsx
│   └── ItemUsuarios.jsx
├── helpers/            # capa de datos (API + sesión + utilidades compartidas)
│   ├── api.js              # capa HTTP única: peticion() → { ok, status, datos }
│   ├── sesion.js           # sesión en sessionStorage ("userKey") + vencimiento del JWT
│   ├── fechas.js           # hoy local, ISO ↔ datetime-local, formato de fechas
│   ├── queries.js          # habitaciones
│   ├── queries.reserva.js  # reservas
│   └── queries.usuarios.js # usuarios
└── components/
    ├── assets/        # imágenes + imagenes.js (URLs remotas exportadas)
    ├── common/        # Menu, Footer (layout compartido)
    ├── pages/         # una vista por ruta
    │   └── Habitaciones/   # CardHabitacion, ItemReservas (componentes de página, no rutas)
    ├── routes/        # RutasAdmin (subrouter), RutasProtegidas (guarda)
    └── TiempoToken/   # TiempoToken (control de expiración de sesión)
```

### Regla de ubicación (aplicar en cada archivo nuevo)
- **Lo que usa una sola página** vive junto a esa página (patrón `pages/Habitaciones/`).
- **Lo que usan 2+ vistas** sube a `components/common/` (layout) o `helpers/` (lógica de datos).
- **Lo exclusivo de admin** va en `src/Admin/`.

> ⚠️ Inconsistencia heredada a **no** ampliar: hoy el admin está partido en dos lugares — la página `Administrador.jsx` está en `components/pages/` pero sus filas (`ItemHabitacion`, `ItemUsuarios`, `ItemReservasAdmin`) y el formulario están en `src/Admin/`. Además `TiempoToken/` es una carpeta con un solo archivo. Al agregar código nuevo, seguir la regla de ubicación de arriba; no repliques el split solo porque ya existe.

## Nomenclatura
- Componentes: `PascalCase.jsx`, en español (`FormularioHabitacion`, `DetalleHabitacion`). Un componente por archivo, `export default`.
- Módulos de API: `queries.<dominio>.js` (o `queries.js` para habitaciones). Funciones en `camelCase` con verbo en español: `crearHabitacionAdmin`, `listarReservas`, `borrarUsuario`.
- Filas de tabla admin: prefijo `Item` (`ItemUsuarios`, `ItemReservasAdmin`).
- Handlers en el componente: `camelCase` en español (`cargarReservas`, `eliminarHabitacion`, `cambiarRol`).

## Capa de API (`src/helpers/api.js` + `src/helpers/queries*.js`)
Todo pasa por **`peticion(ruta, { method, body, auth })`** de `api.js`:
- Arma la URL con `VITE_API_URL` (fallback `http://localhost:4000/api`). Nunca hardcodear URLs.
- Agrega `Content-Type: application/json` si hay `body` y `x-token` (token de `sesion.js`) si `auth: true`.
- **Nunca lanza.** Devuelve siempre `{ ok, status, datos }`: `datos` es el JSON parseado (o `null`); si la respuesta es de error, `datos.mensaje` siempre existe. Error de red → `{ ok:false, status:0, datos:{ mensaje:"No se pudo conectar con el servidor" } }`.
- Un **401 en una petición con `auth`** borra la sesión y dispara el evento `sesion-vencida`; `TiempoToken` lo escucha, cierra sesión y manda a `/login`. Por eso los componentes no muestran Swal de error cuando `status === 401`.

Contrato de una función nueva:
1. Va en el módulo del dominio: habitaciones→`queries.js`, reservas→`queries.reserva.js`, usuarios→`queries.usuarios.js`. Es una línea sobre `peticion` y se documenta qué trae `datos`.
2. En el componente: `const { ok, status, datos } = await funcion(...)`; si `ok`, usar `datos`; si no, mostrar `datos?.mensaje` (mensaje del back) con `Swal.fire`.
3. Los ids son `id` (Int). No existe `_id`.
4. Cada reserva ya trae `habitacion: { id, tipoHabitacion, imagen, precio }`: **no** pedir la habitación por separado (nada de N+1).

Variables de entorno (definir en `.env`, ver `.env.example`; todas con prefijo `VITE_`):

| Variable | Uso | Fuente |
|---|---|---|
| `VITE_API_URL` | URL base del backend (ej. `https://hotel-code-backend.onrender.com/api`) | `api.js` |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service | `Contacto.jsx` |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template | `Contacto.jsx` |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key | `Contacto.jsx` |

En producción `VITE_API_URL` está en `netlify.toml`; las de EmailJS se cargan en el panel de Netlify. Ver `.claude/rules/api-services.md`.

## Estado
No hay Redux/Context/Zustand. Tabla de cuándo usar qué:

| Necesidad | Herramienta | Evidencia |
|---|---|---|
| Estado local de UI (loading, listas, toggles) | `useState` | `Administrador.jsx:16-24` |
| Datos al montar (fetch inicial) | `useEffect` con la función `async` definida adentro (o `useCallback`) y dependencias completas | `Catalogo.jsx`, `Reservas.jsx` |
| Scroll a un bloque | `useRef` + `scrollIntoView` | `Administrador.jsx` |
| Sesión del usuario (global) | `usuarioLogueado` en `App.jsx` (objeto o `null`), bajado por props | `App.jsx` |
| Persistencia de sesión entre recargas | `sessionStorage`, **una sola clave** `userKey` = `{ uid, email, rol, token }`, vía `helpers/sesion.js` | `sesion.js`, `Login.jsx` |
| Expiración de sesión | `<TiempoToken>` programa el cierre con el `exp` real del JWT y escucha el 401 de `api.js` | `TiempoToken.jsx` |

`sesion.js` expone `guardarSesion`, `obtenerSesion`, `borrarSesion`, `obtenerToken`, `tokenExpirado`, `vencimientoToken` y `esAdmin`. **Nadie más toca `sessionStorage`.** Los componentes leen la sesión de la prop `usuarioLogueado`, no de `sessionStorage`.

La sesión se comparte por **prop drilling** (`usuarioLogueado`/`setUsuarioLogueado` bajan a `Menu`, `Inicio`, `Login`, `DetalleHabitacion`, `RutasProtegidas`, `TiempoToken`). No introducir un store global sin decisión de equipo; si un dato nuevo lo necesitan 2+ vistas, subilo a `App.jsx` como estas props.

Rutas: `/reservas` va en `<RutasProtegidas usuarioLogueado>` (requiere sesión); `/administrador/*` en `<RutasProtegidas usuarioLogueado soloAdmin>` (sin sesión → `/login`, sin rol admin → `/`). `/catalogo` y `/detallehabitacion/:id` son públicas (reservar pide login).

## Temas / estilos
- **Un solo archivo global: `src/App.css`.** Ahí viven `:root` (variables de marca) y todas las clases custom. No crear archivos `.css` por componente.
- Paleta en `App.css:12-20`: `--dorado-metalico #d4af37`, `--azul-marino #1c3d5a`, `--gris-plomo #2f2f2f`, `--blanco-marfil #f8f4e3`, `--beige-champagne`, `--verde-esmeralda`, `--morado`.
- Fuente: Poppins (importada por `@import` en `App.css:1`).
- Layout: Bootstrap utilities en el `className`. El shell usa flexbox column con `#root { min-height:100vh }` + `.flex-grow-1`/`.mainSection` para empujar el footer abajo.
- Clases custom con nombres crípticos ya existentes (`backC`, `backS`, `backQ`, `backQS`, `tama1`) — reutilizalas si aplican, pero para clases **nuevas** usá nombres semánticos y variables CSS, no hex nuevos. Ver `.claude/rules/estilos-theming.md`.

## Formularios
- react-hook-form: `useForm()` → `register` con reglas inline (`required`, `minLength`, `maxLength`, `pattern`, `validate`), `handleSubmit(onSubmit)`, y el error se muestra en `<Form.Text className="text-danger">{errors.campo?.message}</Form.Text>`. — `Login.jsx`, `FormularioHabitacion.jsx`, `Contacto.jsx`
- Feedback de submit: `Swal.fire` de éxito/error. Ver `.claude/rules/formularios.md` y `.claude/rules/sweetalert.md`.

## Testing
No hay framework de test instalado. No inventes `vitest`/`jest` sin pedirlo. La verificación de un cambio es: `npm run lint` sin errores nuevos + `npm run build` OK + prueba manual en `npm run dev`.

## Reglas operativas (verificables en cada PR)

| # | Regla | Cómo se chequea |
|---|---|---|
| 1 | `npm run lint` y `npm run build` pasan | correr ambos |
| 2 | El único `fetch` está en `helpers/api.js` | grep `fetch(` en `src` (solo debe aparecer en `api.js`) |
| 3 | Toda env var nueva empieza con `VITE_` | grep `import.meta.env.` |
| 4 | `sessionStorage` solo se usa dentro de `helpers/sesion.js` | grep `sessionStorage` |
| 5 | Header de auth = `x-token` (no `Authorization`), lo pone `peticion` con `auth: true` | revisar la función de API tocada |
| 6 | Borrados con `Swal.fire` + `showCancelButton` | revisar el handler de borrado |
| 7 | Colores nuevos = variable de `:root`, no hex nuevo | grep `#` en el diff de estilos |
| 8 | Rutas admin bajo `<RutasProtegidas soloAdmin>` | revisar `App.jsx`/`RutasAdmin.jsx` |
| 9 | Commits en español, claros (sin `exact` prop de router v5 en rutas nuevas) | revisar diff/mensaje |
| 10 | Nada de `_id`: los ids son `id` | grep `_id` en `src` |
