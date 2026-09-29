// Lógica compartida por Login.jsx y Registro.jsx: reglas de validación
// (react-hook-form), destino tras iniciar sesión y armado del mensaje de error.
import { esAdmin } from "./sesion.js";

export const reglasEmail = {
  required: "El correo electrónico es un dato obligatorio",
  minLength: {
    value: 3,
    message: "El correo electrónico debe tener al menos 3 caracteres",
  },
  maxLength: {
    value: 320,
    message: "El correo electrónico no debe tener más de 320 caracteres",
  },
  pattern: {
    value:
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    message: "Ingresá un formato válido de email. Ej: juanperez@email.com",
  },
};

export const reglasPassword = {
  required: "La contraseña es un campo obligatorio",
  minLength: {
    value: 8,
    message: "La contraseña debe contener al menos 8 caracteres",
  },
  maxLength: {
    value: 100,
    message: "La contraseña no debe contener más de 100 caracteres",
  },
  pattern: {
    value: /^(?=.*\d)(?=.*[!-+<-@])(?=.*[A-Z])(?=.*[a-z])\S{8,100}$/,
    message:
      "La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial",
  },
};

// A dónde va el usuario recién logueado.
export const rutaTrasLogin = (sesion) => (esAdmin(sesion) ? "/administrador" : "/catalogo");

// Texto de error: lista `errores` del back (400 de validación) o su `mensaje`.
const textoError = (datos, porDefecto) => {
  if (Array.isArray(datos?.errores) && datos.errores.length > 0) {
    return datos.errores
      .map((e) => (typeof e === "string" ? e : e?.msg || e?.mensaje || e?.message))
      .filter(Boolean)
      .join("\n");
  }
  return datos?.mensaje || porDefecto;
};

/**
 * Config de Swal.fire para una respuesta fallida de login/registro.
 * @param {number} status  status de peticion() (0 = red/timeout)
 * @param {any} datos
 * @param {string} porDefecto  texto si el back no manda mensaje
 */
export const configErrorAuth = (status, datos, porDefecto) => {
  if (status === 429) {
    return {
      title: "Demasiados intentos",
      text:
        datos?.mensaje ||
        "Superaste el límite de intentos. Esperá unos minutos e intentá de nuevo.",
      icon: "warning",
    };
  }
  if (status === 401) {
    return {
      title: "Credenciales incorrectas",
      text: datos?.mensaje || "Email o contraseña incorrectos",
      icon: "error",
    };
  }
  if (status === 400) {
    return { title: "Revisá los datos", text: textoError(datos, porDefecto), icon: "error" };
  }
  if (status === 0) {
    return {
      title: "Sin respuesta del servidor",
      text: datos?.mensaje || "No se pudo conectar con el servidor",
      icon: "error",
    };
  }
  return { title: "Error", text: textoError(datos, porDefecto), icon: "error" };
};
