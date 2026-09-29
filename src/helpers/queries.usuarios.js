// Usuarios. Todas las funciones devuelven { ok, status, datos } (ver api.js).
import { peticion } from "./api.js";

// → 200 datos: { mensaje, uid, email, rol, token } | 401 | 429
export const login = ({ email, password }) =>
  peticion("/usuarios/login", { method: "POST", body: { email, password } });

// → 201 datos: { mensaje }
export const registro = ({ email, password, confirmarPassword }) =>
  peticion("/usuarios/registro", {
    method: "POST",
    body: { email, password, confirmarPassword },
  });

// ADMIN → datos: [{ id, email, rol }]
export const listarUsuarios = () => peticion("/usuarios", { auth: true });

// ADMIN: cambia el rol { rol: "usuario" | "admin" } → 200 datos: { mensaje }
export const editarUsuario = (id, { rol }) =>
  peticion(`/usuarios/${id}`, { method: "PUT", body: { rol }, auth: true });

// ADMIN → 200 datos: { mensaje }
export const borrarUsuario = (id) =>
  peticion(`/usuarios/${id}`, { method: "DELETE", auth: true });
