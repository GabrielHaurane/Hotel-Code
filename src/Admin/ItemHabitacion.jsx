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
      <td data-label="Fila" className="celda-fila celda-fila--badge">
        {fila}
      </td>
      <td data-label="Tipo de Habitación" className="celda-titulo">
        {habitacion.tipoHabitacion}
      </td>
      <td data-label="Imagen" className="celda-imagen">
        <img
          src={habitacion.imagen}
          alt="imagen de una habitacion de hotel"
          className="img-admin object-fit-cover"
        />
      </td>
      <td data-label="Precio" className="celda-precio">
        {habitacion.precio} usd
      </td>
      <td data-label="Disponibilidad">
        <span
          className={`badge ${
            habitacion.disponibilidad ? "text-bg-success" : "text-bg-secondary"
          }`}
        >
          {habitacion.disponibilidad ? "Disponible" : "No disponible"}
        </span>
      </td>
      <td data-label="Opciones" className="celda-acciones">
        <Link
          className="btn btn-warning  me-lg-2"
          to={`/administrador/editar/${habitacion.id}`}
          aria-label="Editar habitación"
        >
          <i className="bi bi-pencil-square"></i>
          <span className="texto-accion">Editar</span>
        </Link>
        <Button
          variant="danger"
          onClick={eliminarHabitacion}
          className="my-3"
          aria-label="Borrar habitación"
        >
          <i className="bi bi-trash"></i>
          <span className="texto-accion">Borrar</span>
        </Button>
      </td>
    </tr>
  );
};

export default ItemHabitacion;
