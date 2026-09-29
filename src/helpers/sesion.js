// Manejo centralizado de la sesión del usuario.
// Toda la sesión vive en sessionStorage bajo UNA sola clave: "userKey"
// con la forma { uid, email, rol, token }.

const CLAVE_SESION = "userKey";

export const guardarSesion = ({ uid, email, rol, token }) => {
  const sesion = { uid, email, rol, token };
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
};

// Devuelve el objeto de sesión o null si no hay (o si está corrupto).
export const obtenerSesion = () => {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(CLAVE_SESION));
    return sesion && sesion.token ? sesion : null;
  } catch {
    return null;
  }
};

export const borrarSesion = () => {
  sessionStorage.removeItem(CLAVE_SESION);
};

export const obtenerToken = () => obtenerSesion()?.token || null;

// Decodifica el payload (base64url) del JWT. Devuelve null si no se puede.
const decodificarPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const relleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(relleno));
  } catch {
    return null;
  }
};

// Milisegundos epoch en que vence el token, o null si no se puede leer.
export const vencimientoToken = (token = obtenerToken()) => {
  if (!token) return null;
  const payload = decodificarPayload(token);
  return payload?.exp ? payload.exp * 1000 : null;
};

// true si no hay token, si no se puede leer su exp o si ya venció.
export const tokenExpirado = (token = obtenerToken()) => {
  const exp = vencimientoToken(token);
  if (!exp) return true;
  return Date.now() >= exp;
};

export const esAdmin = (sesion = obtenerSesion()) => sesion?.rol === "admin";
