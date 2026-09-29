import { useEffect, useState } from "react";
import { obtenerHabitacion } from "../../helpers/queries.js";
import { crearReserva } from "../../helpers/queries.reserva.js";
import { hoyLocal } from "../../helpers/fechas.js";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const DetalleHabitacion = ({ usuarioLogueado }) => {
  const { id } = useParams();
  const navegacion = useNavigate();
  const [habitacion, setHabitacion] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const [fechaEntradaa, setFechaEntradaa] = useState("");
  const [fechaSalidaa, setFechaSalidaa] = useState("");
  const [errores, setErrores] = useState({});
  const [reservando, setReservando] = useState(false);
  const today = hoyLocal();

  useEffect(() => {
    const cargarHabitacion = async () => {
      setMensajeError("");
      const { ok, status, datos } = await obtenerHabitacion(id);
      if (ok) {
        setHabitacion(datos || {});
      } else {
        setMensajeError(
          status === 404
            ? "La habitación que buscás no existe."
            : datos?.mensaje || "No se pudo cargar la habitación."
        );
      }
    };
    cargarHabitacion();
  }, [id]);

  const handleReserva = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!fechaEntradaa) {
      nuevosErrores.fechaEntrada = "Por favor ingrese una fecha de entrada.";
    } else if (fechaEntradaa < today) {
      nuevosErrores.fechaEntrada =
        "La fecha de entrada no puede ser anterior a hoy.";
    }
    if (!fechaSalidaa) {
      nuevosErrores.fechaSalida = "Por favor ingrese una fecha de salida.";
    } else if (fechaEntradaa && fechaSalidaa <= fechaEntradaa) {
      nuevosErrores.fechaSalida =
        "La fecha de salida debe ser posterior a la fecha de entrada.";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (!usuarioLogueado) {
      Swal.fire({
        icon: "info",
        title: "Iniciá sesión",
        text: "Debes iniciar sesión para reservar una habitación.",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
      }).then((resultado) => {
        if (resultado.isConfirmed) navegacion("/login");
      });
      return;
    }

    setReservando(true);
    const { ok, status, datos } = await crearReserva({
      habitacionID: habitacion.id,
      fechaEntrada: fechaEntradaa,
      fechaSalida: fechaSalidaa,
    });
    setReservando(false);

    if (ok) {
      setFechaEntradaa("");
      setFechaSalidaa("");
      Swal.fire({
        title: "Reserva Exitosa",
        text: `Tu reserva ha sido confirmada.`,
        icon: "success",
      });
    } else if (status !== 401) {
      // El 401 (sesión vencida) ya lo maneja TiempoToken.
      Swal.fire({
        title: status === 409 ? "Fechas no disponibles" : "Error",
        text: datos?.mensaje || "No se pudo realizar la reserva",
        icon: "error",
      });
    }
  };

  if (mensajeError) {
    return (
      <div className="backQS flex-grow-1">
        <div className="container text-center">
          <h1 className="my-3">Detalles de la habitación</h1>
          <div className="alert alert-warning">{mensajeError}</div>
          <Button variant="dark" onClick={() => navegacion("/catalogo")}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="backQS flex-grow-1">
      <div className=" container">
        <h1 className="text-center my-3">Detalles de la habitación</h1>

        <Card className="d-flex flex-xl-row flex-column mb-4">
          <div className="d-flex flex-wrap align-content-center">
            <img
              className="col-12 rounded-top-2 object-fit-cover"
              src={habitacion?.imagen || ""}
              alt="Imagen de la habitación"
            />
          </div>
          <Card.Body className="col-12">
            <Card.Title className="fs-2 col-12">
              {habitacion?.tipoHabitacion || (
                <span className="placeholder col-12"></span>
              )}
            </Card.Title>
            <Card.Text>
              {habitacion?.descripcion_breve || (
                <span className="placeholder col-12"></span>
              )}
            </Card.Text>
            <div className="mb-2 fs-5">
              <b>Servicios:</b>{" "}
              {habitacion?.servicios || (
                <span className="placeholder col-12"></span>
              )}
            </div>
            <div className="mb-2 fs-5">
              <b>
                Capacidad:{" "}
                {habitacion?.capacidad || (
                  <span className="placeholder col-12"></span>
                )}
              </b>
            </div>
            <div className="mb-2 fs-5">
              <b>
                Tamaño:{" "}
                {habitacion?.tamanio || (
                  <span className="placeholder col-12"></span>
                )}
            m2</b>
            </div>
            <div className="mb-2 fs-3">
              <b>
                U$D 
                 {habitacion?.precio || (
                  <span className="placeholder col-12"></span>
                )}{" "}
                X Noche
              </b>
            </div>

            <Form onSubmit={handleReserva} noValidate>
              <Form.Group className="col-12" controlId="formFechaEntrada">
                <Form.Label>Fecha de Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaEntradaa}
                  onChange={(e) => setFechaEntradaa(e.target.value)}
                  min={today}
                  required
                />
                {errores.fechaEntrada && (
                  <p className="text-danger fw-bold">{errores.fechaEntrada}</p>
                )}
              </Form.Group>

              <Form.Group className="col-12" controlId="formFechaSalida">
                <Form.Label>Fecha de Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaSalidaa}
                  onChange={(e) => setFechaSalidaa(e.target.value)}
                  min={fechaEntradaa}
                  required
                />
                {errores.fechaSalida && (
                  <p className="text-danger fw-bold">{errores.fechaSalida}</p>
                )}
              </Form.Group>

              <div className="d-flex align-content-md-end flex-md-wrap justify-content-end my-2">
                <Button
                  variant="dark"
                  type="submit"
                  className="mt-2"
                  disabled={reservando || !habitacion.id}
                >
                  {reservando ? "Reservando..." : "Reservar"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DetalleHabitacion;
