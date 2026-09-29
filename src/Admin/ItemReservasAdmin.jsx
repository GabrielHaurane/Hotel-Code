import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { borrarReserva } from '../helpers/queries.reserva.js';
import { formatearFecha } from '../helpers/fechas.js';


const ItemReservasAdmin = ({reserva, fila, setListaReservas}) => {

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
    <td className='text-center'>{fila}</td>
    <td className='text-center'>{reserva.usuarioEmail}</td>
    <td className='text-center'>{habitacion?.tipoHabitacion || "-"}</td>
    <td className='text-center'>
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
    <td className='text-center'>{formatearFecha(fechaEntrada)}</td>
    <td className='text-center'>{formatearFecha(fechaSalida)}</td>
    <td className='text-center'>
      <Button variant="danger" onClick={eliminarReserva} className='ms-lg-3 mt-4'>
      <i className="bi bi-trash"></i>
      </Button>
    </td>
  </tr>
);
};

export default ItemReservasAdmin;
