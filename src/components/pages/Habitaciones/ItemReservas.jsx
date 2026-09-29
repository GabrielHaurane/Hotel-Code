import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { borrarReserva } from "../../../helpers/queries.reserva.js";
import { formatearFecha } from "../../../helpers/fechas.js";

const ItemReservas = ({ reserva, fila, setListaReservas }) => {
  const { habitacion, fechaEntrada, fechaSalida } = reserva;

  const eliminarReserva = () => {
    Swal.fire({
      title: "¿Estás seguro de borrar la reserva?",
      text: "No puedes revertir esta operación.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { ok, status, datos } = await borrarReserva(reserva.id);
        if (ok) {
          Swal.fire({
            title: "Eliminada",
            text: datos?.mensaje || "La reserva fue eliminada correctamente.",
            icon: "success",
          });
          setListaReservas((reservasPrevias) =>
            reservasPrevias.filter((item) => item.id !== reserva.id)
          );
        } else if (status !== 401) {
          Swal.fire({
            title: "Ocurrió un error",
            text:
              datos?.mensaje ||
              "La reserva no pudo ser eliminada, intenta de nuevo en unos minutos.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <tr>
      <td data-label="Fila" className="text-center celda-fila celda-fila--badge">
        {fila}
      </td>
      <td data-label="Tipo Habitación" className="text-center celda-titulo">
        {habitacion?.tipoHabitacion || "-"}
      </td>
      <td data-label="Imagen" className="text-center celda-imagen">
        {habitacion?.imagen ? (
          <img
            src={habitacion.imagen}
            alt={habitacion.tipoHabitacion}
            className="img-admin"
          />
        ) : (
          "-"
        )}
      </td>
      <td data-label="Entrada" className="text-center celda-fecha">
        {formatearFecha(fechaEntrada)}
      </td>
      <td data-label="Salida" className="text-center celda-fecha">
        {formatearFecha(fechaSalida)}
      </td>
      <td data-label="Opciones" className="text-center celda-acciones">
        <Button
          variant="danger"
          onClick={eliminarReserva}
          aria-label="Cancelar reserva"
        >
          <i className="bi bi-trash"></i>
          <span className="texto-accion">Cancelar reserva</span>
        </Button>
      </td>
    </tr>
  );
};

export default ItemReservas;
