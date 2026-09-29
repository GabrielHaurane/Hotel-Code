import { useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  buscarCatalogoPorFechas,
  listarHabitacionesDisponibles,
} from "../../helpers/queries.js";
import { hoyLocal } from "../../helpers/fechas.js";
import CardHabitacion from "./Habitaciones/CardHabitacion.jsx";

// Catálogo público (no requiere sesión).
// Sin filtro usa /disponibles; con fechas usa /catalogo?fechaEntrada&fechaSalida.
const Catalogo = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeError, setMensajeError] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [errorFiltro, setErrorFiltro] = useState("");
  const [filtrando, setFiltrando] = useState(false);
  const hoy = hoyLocal();

  const cargarHabitaciones = useCallback(async (entrada, salida) => {
    setCargando(true);
    setMensajeError("");
    const { ok, datos } =
      entrada && salida
        ? await buscarCatalogoPorFechas(entrada, salida)
        : await listarHabitacionesDisponibles();
    if (ok && Array.isArray(datos)) {
      setHabitaciones(datos);
    } else {
      setHabitaciones([]);
      setMensajeError(
        datos?.mensaje || "Ocurrió un error al cargar las habitaciones."
      );
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarHabitaciones();
  }, [cargarHabitaciones]);

  const filtrarPorFechas = (e) => {
    e.preventDefault();
    if (!fechaEntrada || !fechaSalida) {
      setErrorFiltro("Ingresá la fecha de entrada y la de salida.");
      return;
    }
    if (fechaEntrada < hoy) {
      setErrorFiltro("La fecha de entrada no puede ser anterior a hoy.");
      return;
    }
    if (fechaSalida <= fechaEntrada) {
      setErrorFiltro("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }
    setErrorFiltro("");
    setFiltrando(true);
    cargarHabitaciones(fechaEntrada, fechaSalida);
  };

  const limpiarFiltro = () => {
    setFechaEntrada("");
    setFechaSalida("");
    setErrorFiltro("");
    setFiltrando(false);
    cargarHabitaciones();
  };

  return (
    <div className="backQS flex-grow-1">
      <div className="container ">
        <h1 className="text-center my-3">Catálogo de Habitaciones</h1>
        <Form
          onSubmit={filtrarPorFechas}
          noValidate
          className="d-flex flex-column flex-md-row flex-wrap gap-2 align-items-md-end justify-content-center mb-4"
        >
          <Form.Group controlId="filtroFechaEntrada">
            <Form.Label>Fecha de Entrada</Form.Label>
            <Form.Control
              type="date"
              value={fechaEntrada}
              min={hoy}
              onChange={(e) => setFechaEntrada(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="filtroFechaSalida">
            <Form.Label>Fecha de Salida</Form.Label>
            <Form.Control
              type="date"
              value={fechaSalida}
              min={fechaEntrada || hoy}
              onChange={(e) => setFechaSalida(e.target.value)}
            />
          </Form.Group>
          <Button variant="dark" type="submit">
            Buscar disponibilidad
          </Button>
          {filtrando && (
            <Button variant="outline-dark" onClick={limpiarFiltro}>
              Ver todas
            </Button>
          )}
        </Form>
        {errorFiltro && (
          <p className="text-danger fw-bold text-center">{errorFiltro}</p>
        )}
        <section className="d-flex justify-content-center">
          {cargando ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          ) : mensajeError ? (
            <div className="alert alert-warning">{mensajeError}</div>
          ) : habitaciones.length === 0 ? (
            <div className="alert alert-warning">
              {filtrando
                ? "No hay habitaciones libres para esas fechas."
                : "No hay habitaciones disponibles."}
            </div>
          ) : (
            <div className="row">
              {habitaciones.map((habitacion) => (
                <CardHabitacion key={habitacion.id} habitacion={habitacion} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Catalogo;
