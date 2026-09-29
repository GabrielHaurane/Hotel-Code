import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useCallback, useState, useRef } from "react";
import { listarUsuarios } from "../../helpers/queries.usuarios.js";
import { listarHabitacionesAdmin } from "../../helpers/queries.js";
import { listarReservasAdmin } from "../../helpers/queries.reserva.js";
import ItemUsuarios from "../../Admin/ItemUsuarios.jsx";
import ItemHabitacion from "../../Admin/ItemHabitacion.jsx";
import ItemReservasAdmin from "../../Admin/ItemReservasAdmin.jsx";

// Cantidad real de columnas de cada tabla (para el colSpan de spinner/vacío).
const COLUMNAS_HABITACIONES = 6;
const COLUMNAS_USUARIOS = 4;
const COLUMNAS_RESERVAS = 7;

// Fila única de "cargando" o "sin datos" que ocupa todo el ancho de la tabla.
const filaEstado = (columnas, cargando, textoVacio) => (
  <tr>
    <td colSpan={columnas} className="text-center">
      {cargando ? (
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      ) : (
        textoVacio
      )}
    </td>
  </tr>
);

// Carga una lista con un helper de API y muestra el error del back si falla.
// Un 401 no muestra error: lo maneja TiempoToken (cierra sesión y va a /login).
const cargarLista = async (consulta, setLista, setCargando, textoError) => {
  setCargando(true);
  const { ok, status, datos } = await consulta();
  setCargando(false);
  if (ok && Array.isArray(datos)) {
    setLista(datos);
  } else {
    setLista([]);
    if (status !== 401) {
      Swal.fire({
        title: "Error",
        text: datos?.mensaje || textoError,
        icon: "error",
      });
    }
  }
};

const Administrador = () => {
  const [listaHabitaciones, setListaHabitaciones] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaReservas, setListaReservas] = useState([]);
  const [mostrarHabitaciones, setMostrarHabitaciones] = useState(false);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
  const [mostrarReservas, setMostrarReservas] = useState(false);
  const [cargandoHabitaciones, setCargandoHabitaciones] = useState(false);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [cargandoReservas, setCargandoReservas] = useState(false);

  const habitacionesRef = useRef(null);
  const usuariosRef = useRef(null);
  const reservasRef = useRef(null);

  // Cada panel se carga solo al abrirse (no recarga los otros).
  const cargarHabitaciones = useCallback(
    () =>
      cargarLista(
        listarHabitacionesAdmin,
        setListaHabitaciones,
        setCargandoHabitaciones,
        "No se pueden mostrar las habitaciones, intentá más tarde"
      ),
    []
  );

  const cargarUsuarios = useCallback(
    () =>
      cargarLista(
        listarUsuarios,
        setListaUsuarios,
        setCargandoUsuarios,
        "No se pueden mostrar los usuarios, intentá más tarde"
      ),
    []
  );

  // Cada reserva ya incluye `habitacion`: sin pedidos extra por fila.
  const cargarReservas = useCallback(
    () =>
      cargarLista(
        listarReservasAdmin,
        setListaReservas,
        setCargandoReservas,
        "No se pueden mostrar las reservas, intentá más tarde"
      ),
    []
  );

  const desplegarUsuarios = () => {
    const abrir = !mostrarUsuarios;
    setMostrarUsuarios(abrir);
    if (abrir) {
      cargarUsuarios();
      usuariosRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const desplegarHabitaciones = () => {
    const abrir = !mostrarHabitaciones;
    setMostrarHabitaciones(abrir);
    if (abrir) {
      cargarHabitaciones();
      habitacionesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const desplegarReservas = () => {
    const abrir = !mostrarReservas;
    setMostrarReservas(abrir);
    if (abrir) {
      cargarReservas();
      reservasRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="flex-grow-1 container-fluid bg-registro bg-admin">
      <div className="text-center my-5">
        <h1 className="titulo-admin">Administración Hotel Code</h1>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-5">
        <Button
          className="m-auto mt-5 mb-5 btn-admin"
          onClick={desplegarHabitaciones}
        >
          {mostrarHabitaciones ? "Ocultar Lista" : "Gestionar Habitaciones"}
        </Button>
      </div>
      {mostrarHabitaciones && (
        <>
          <hr />
          <div
            className="d-flex justify-content-between align-items-center mt-5"
            ref={habitacionesRef}
          >
            <h2 className="display-4 ">Habitaciones</h2>
            <Link className="btn btn-primary" to="/administrador/crear">
              <i className="bi bi-file-earmark-plus"></i>
            </Link>
          </div>
          <div className="tabla-scroll">
            <Table responsive striped bordered hover>
              <thead>
                <tr className="text-center">
                  <th>Fila</th>
                  <th>Tipo de Habitación</th>
                  <th>Imagen</th>
                  <th>Precio</th>
                  <th>Disponibilidad</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {cargandoHabitaciones || listaHabitaciones.length === 0
                  ? filaEstado(
                      COLUMNAS_HABITACIONES,
                      cargandoHabitaciones,
                      "No hay habitaciones cargadas"
                    )
                  : listaHabitaciones.map((habitacion, index) => (
                      <ItemHabitacion
                        key={habitacion.id}
                        habitacion={habitacion}
                        fila={index + 1}
                        setListaHabitaciones={setListaHabitaciones}
                      />
                    ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
      <div
        className="d-flex justify-content-between align-items-center mt-5"
        ref={usuariosRef}
      >
        <Button
          className="m-auto mt-5 mb-lg-5 btn-admin mb-5"
          onClick={desplegarUsuarios}
        >
          {mostrarUsuarios ? "Ocultar Lista" : "Lista de Usuarios"}
        </Button>
      </div>
      {mostrarUsuarios && (
        <>
          <hr />
          <div className="d-flex mt-lg-4">
            <h2 className="display-4 ">Usuarios</h2>
          </div>
          <div className="tabla-scroll">
            <Table responsive striped bordered hover className="tabla">
              <thead>
                <tr className="text-center">
                  <th>Fila</th>
                  <th>Email</th>
                  <th className="text-center">Permisos</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {cargandoUsuarios || listaUsuarios.length === 0
                  ? filaEstado(
                      COLUMNAS_USUARIOS,
                      cargandoUsuarios,
                      "No hay usuarios registrados"
                    )
                  : listaUsuarios.map((usuario, index) => (
                      <ItemUsuarios
                        key={usuario.id}
                        usuario={usuario}
                        fila={index + 1}
                        setListaUsuarios={setListaUsuarios}
                      />
                    ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
      <div
        className="d-flex justify-content-between align-items-center mt-5"
        ref={reservasRef}
      >
        <Button
          className="m-auto mt-5 mb-lg-5 btn-admin mb-5"
          onClick={desplegarReservas}
        >
          {mostrarReservas ? "Ocultar Lista" : "Lista de Reservas"}
        </Button>
      </div>
      {mostrarReservas && (
        <>
          <hr />
          <div className="d-flex mt-lg-4">
            <h2 className="display-4 ">Reservas</h2>
          </div>
          <div className="tabla-scroll">
            <Table responsive striped bordered hover className="tabla">
              <thead>
                <tr className="text-center">
                  <th>Fila</th>
                  <th>Usuario</th>
                  <th>Tipo de Habitación</th>
                  <th>Imagen</th>
                  <th>Fecha Entrada</th>
                  <th>Fecha Salida</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {cargandoReservas || listaReservas.length === 0
                  ? filaEstado(
                      COLUMNAS_RESERVAS,
                      cargandoReservas,
                      "No hay reservas registradas"
                    )
                  : listaReservas.map((reserva, index) => (
                      <ItemReservasAdmin
                        key={reserva.id}
                        reserva={reserva}
                        fila={index + 1}
                        setListaReservas={setListaReservas}
                      />
                    ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </section>
  );
};

export default Administrador;
