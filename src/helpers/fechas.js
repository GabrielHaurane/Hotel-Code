// Utilidades de fechas compartidas (catálogo, detalle y formulario admin).

const dosDigitos = (n) => String(n).padStart(2, "0");

// Fecha local de hoy en formato YYYY-MM-DD (para inputs type="date").
// No usa toISOString() porque ese método pasa a UTC y puede dar "mañana".
export const hoyLocal = () => {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}`;
};

// ISO (del back) → "YYYY-MM-DDTHH:mm" en hora local, para input datetime-local.
// Devuelve "" si el valor está vacío o no es una fecha válida.
export const isoADatetimeLocal = (valorISO) => {
  if (!valorISO) return "";
  const fecha = new Date(valorISO);
  if (Number.isNaN(fecha.getTime())) return "";
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(
    fecha.getDate()
  )}T${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}`;
};

// Valor de input datetime-local → ISO. Devuelve null si está vacío o es inválido.
export const datetimeLocalAISO = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
};

// Formato legible para tablas de reservas ("12 de octubre de 2026").
// Las fechas de reserva son "solo día" (YYYY-MM-DD guardado a medianoche UTC),
// por eso se formatea en UTC: si no, en Argentina (UTC-3) se mostraría el día anterior.
export const formatearFecha = (valorISO) => {
  const fecha = new Date(valorISO);
  if (Number.isNaN(fecha.getTime())) return "-";
  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};
