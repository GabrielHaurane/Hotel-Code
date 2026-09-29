// Reservas. Todas las funciones devuelven { ok, status, datos } (ver api.js).
// Cada Reserva ya incluye `habitacion: { id, tipoHabitacion, imagen, precio }`.
import { peticion } from "./api.js";

// JWT: reservas del usuario del token → datos: [Reserva]
export const listarReservas = () => peticion("/reserva", { auth: true });

// JWT: nueva reserva { habitacionID, fechaEntrada, fechaSalida } (YYYY-MM-DD)
// → 201 datos: Reserva | 400/404/409 datos: { mensaje }
export const crearReserva = (nuevaReserva) =>
  peticion("/reserva", { method: "POST", body: nuevaReserva, auth: true });

// JWT (dueño o admin) → 200 datos: { mensaje }
export const borrarReserva = (id) =>
  peticion(`/reserva/${id}`, { method: "DELETE", auth: true });

// ADMIN: todas las reservas → datos: [Reserva]
export const listarReservasAdmin = () =>
  peticion("/reservasAdmin", { auth: true });
