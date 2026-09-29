// Habitaciones. Todas las funciones devuelven { ok, status, datos } (ver api.js).
import { peticion } from "./api.js";

// PÚBLICA: habitaciones disponibles → datos: [Habitacion]
export const listarHabitacionesDisponibles = () => peticion("/disponibles");

// PÚBLICA: habitaciones libres en un rango (fechas YYYY-MM-DD) → datos: [Habitacion]
export const buscarCatalogoPorFechas = (fechaEntrada, fechaSalida) => {
  const parametros = new URLSearchParams({ fechaEntrada, fechaSalida });
  return peticion(`/catalogo?${parametros.toString()}`);
};

// PÚBLICA: detalle de una habitación → datos: Habitacion (404 si no existe)
export const obtenerHabitacion = (id) => peticion(`/habitacion/${id}`);

// ADMIN: listado completo → datos: [Habitacion]
export const listarHabitacionesAdmin = () =>
  peticion("/habitacion", { auth: true });

// ADMIN: alta → 201 datos: { mensaje, habitacion }
export const crearHabitacionAdmin = (habitacion) =>
  peticion("/habitacion", { method: "POST", body: habitacion, auth: true });

// ADMIN: edición → 200 datos: { mensaje, habitacion }
export const editarHabitacionAdmin = (id, habitacion) =>
  peticion(`/habitacion/${id}`, { method: "PUT", body: habitacion, auth: true });

// ADMIN: baja → 200 datos: { mensaje }
export const eliminarHabitacionAdmin = (id) =>
  peticion(`/habitacion/${id}`, { method: "DELETE", auth: true });
