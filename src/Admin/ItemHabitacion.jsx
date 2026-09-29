import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { eliminarHabitacionAdmin } from "../helpers/queries.js";
import { Link } from "react-router-dom";


const ItemHabitacion = ({ fila, setListaHabitaciones, habitacion }) => {
  const eliminarHabitacion = () => {
    Swal.fire({
      title: "¿Estás seguro de borrar la habitación?",
      text: "No puedes revertir esta operacion",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { ok, status, datos } = await eliminarHabitacionAdmin(habitacion.id);
        if (ok) {
          Swal.fire({
            title: "Eliminado",
            text: datos?.mensaje || "La habitacion fue eliminada correctamente",
            icon: "success",
          });
          setListaHabitaciones((habitacionesPrevias) =>
            habitacionesPrevias.filter((item) => item.id !== habitacion.id)
          );
        } else if (status !== 401) {
          Swal.fire({
            title: "Ocurrio un error",
            text:
              datos?.mensaje ||
              "La habitación no pudo ser eliminada, intenta de nuevo en unos minutos",
            icon: "error",
          });
        }
      }
    });
  };


  return (
    <tr className="text-center">
      <td>{fila}</td>
      <td>{habitacion.tipoHabitacion}</td>
      <td>
        <img
          src={habitacion.imagen}
          alt="imagen de una habitacion de hotel"
          className="img-admin object-fit-cover"
        />
      </td>
      <td>{habitacion.precio} usd</td>
      <td>{habitacion.disponibilidad ? "Disponible" : "No disponible"}</td>
      <td>
        <Link
          className="btn btn-warning  me-lg-2"
          to={`/administrador/editar/${habitacion.id}`}
        >
          <i className="bi bi-pencil-square"></i>
        </Link>
        <Button variant="danger" onClick={eliminarHabitacion} className="my-3">
          <i className="bi bi-trash"></i>
        </Button>
      </td>
    </tr>
  );
};

export default ItemHabitacion;
