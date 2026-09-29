// Capa HTTP única del frontend. Ningún componente hace fetch directo:
// todos los módulos queries*.js usan `peticion`.
import { borrarSesion, obtenerToken } from "./sesion.js";

export const URL_API = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");

// Evento global que se dispara cuando el back responde 401 en una
// petición autenticada (sesión vencida o token inválido). App.jsx lo escucha.
export const EVENTO_SESION_VENCIDA = "sesion-vencida";

/**
 * Hace una petición al backend. NUNCA lanza.
 * @param {string} ruta  ruta relativa a VITE_API_URL (ej. "/habitacion/3")
 * @param {{method?: string, body?: any, auth?: boolean, timeout?: number}} opciones
 *   timeout = ms máximos de espera (default 90 s: el back en Render free puede
 *   tardar hasta un minuto en "despertar").
 * @returns {Promise<{ok: boolean, status: number, datos: any}>}
 *   datos = JSON parseado de la respuesta (o null si no hay cuerpo).
 *   En error de red o timeout: { ok:false, status:0, datos:{ mensaje } }.
 */
export const TIMEOUT_POR_DEFECTO = 90000;

export const peticion = async (
  ruta,
  { method = "GET", body, auth = false, timeout = TIMEOUT_POR_DEFECTO } = {}
) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = obtenerToken();
    if (token) headers["x-token"] = token;
  }

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), timeout);

  let respuesta;
  try {
    respuesta = await fetch(`${URL_API}${ruta}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controlador.signal,
    });
  } catch (error) {
    clearTimeout(temporizador);
    if (error?.name === "AbortError") {
      return {
        ok: false,
        status: 0,
        datos: {
          mensaje:
            "El servidor tardó demasiado en responder. Intentá de nuevo en unos segundos.",
        },
      };
    }
    console.error("Error de red:", error);
    return {
      ok: false,
      status: 0,
      datos: { mensaje: "No se pudo conectar con el servidor" },
    };
  }
  clearTimeout(temporizador);

  let datos = null;
  try {
    const texto = await respuesta.text();
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!respuesta.ok && !datos?.mensaje) {
    datos = { ...(datos || {}), mensaje: `Error ${respuesta.status} en la solicitud` };
  }

  if (respuesta.status === 401 && auth) {
    borrarSesion();
    window.dispatchEvent(new Event(EVENTO_SESION_VENCIDA));
  }

  return { ok: respuesta.ok, status: respuesta.status, datos };
};
