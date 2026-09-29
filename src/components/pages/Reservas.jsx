import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ItemReservas from "./Habitaciones/ItemReservas";
import Swal from "sweetalert2";
import { listarReservas } from "../../helpers/queries.reserva.js";

// Ruta protegida: el back identifica al usuario por el token (x-token).
// Cada reserva ya trae su `habitacion`, no hace falta pedirla aparte.
const Reservas = () => {
  const [listaReservas, setListaReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      setCargando(true);
      const { ok, status, datos } = await listarReservas();
      if (ok && Array.isArray(datos)) {
        setListaReservas(datos);
      } else {
        setListaReservas([]);
        if (status !== 401) {
          Swal.fire({
            title: "Error",
            text: datos?.mensaje || "No se pudieron cargar tus reservas",
            icon: "error",
          });
        }
      }
      setCargando(false);
    };
    cargarReservas();
  }, []);
  return (
    <div className="backQS flex-grow-1">
      <div className=" container">
        <h1 className="text-center my-3">Mis Reservas</h1>
        <div className="tabla-scroll tabla-cards-contenedor">
          {cargando ? (
            <div className="text-center my-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <Table responsive striped className="tabla-cards">
              <thead>
                <tr>
                  <th className="text-center">Fila</th>
                  <th className="text-center">Tipo Habitacion</th>
                  <th className="text-center">Imagen</th>
                  <th className="text-center">Fecha Entrada</th>
                  <th className="text-center">Fecha Salida</th>
                  <th className="text-center">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(listaReservas) && listaReservas.length > 0 ? (
                  listaReservas.map((reserva, index) => (
                    <ItemReservas
                      key={reserva.id}
                      reserva={reserva}
                      fila={index + 1}
                      setListaReservas={setListaReservas}
                    ></ItemReservas>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aún no hay reservas
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservas;
