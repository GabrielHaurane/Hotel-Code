import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  crearHabitacionAdmin,
  editarHabitacionAdmin,
  obtenerHabitacion,
} from "../helpers/queries.js";
import { datetimeLocalAISO, isoADatetimeLocal } from "../helpers/fechas.js";

const valoresIniciales = {
  tipoHabitacion: "",
  capacidad: "",
  precio: "",
  servicios: "",
  descripcion_breve: "",
  descripcion_amplia: "",
  tamanio: "",
  imagen: "",
  disponibilidad: "true",
  fechaEntrada: "",
  fechaSalida: "",
};

// Arma el texto de error con el `mensaje` del back y, si vienen, los `errores` de validación.
const textoErrorBack = (datos, porDefecto) => {
  const mensaje = datos?.mensaje || porDefecto;
  if (!Array.isArray(datos?.errores) || datos.errores.length === 0) return mensaje;
  const detalle = datos.errores
    .map((e) => (typeof e === "string" ? e : e?.msg || e?.mensaje))
    .filter(Boolean)
    .join(" | ");
  return detalle ? `${mensaje}: ${detalle}` : mensaje;
};

// Inicio del día de hoy (hora local), para validar "fecha de entrada >= hoy" al crear.
const inicioDeHoy = () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy;
};

const FormularioHabitacion = ({ creandoHabitacion, titulo }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({ defaultValues: valoresIniciales });

  const { id } = useParams();
  const navegacion = useNavigate();

  useEffect(() => {
    if (creandoHabitacion) return;

    const cargarHabitacion = async () => {
      const { ok, status, datos } = await obtenerHabitacion(id);
      if (ok && datos) {
        reset({
          tipoHabitacion: datos.tipoHabitacion ?? "",
          capacidad: datos.capacidad ?? "",
          precio: datos.precio ?? "",
          servicios: datos.servicios ?? "",
          descripcion_breve: datos.descripcion_breve ?? "",
          descripcion_amplia: datos.descripcion_amplia ?? "",
          tamanio: datos.tamanio ?? "",
          imagen: datos.imagen ?? "",
          disponibilidad: String(Boolean(datos.disponibilidad)),
          fechaEntrada: isoADatetimeLocal(datos.fechaEntrada),
          fechaSalida: isoADatetimeLocal(datos.fechaSalida),
        });
      } else {
        Swal.fire({
          title: "Error",
          text:
            status === 404
              ? "La habitación que querés editar no existe."
              : datos?.mensaje || "No se pudo cargar la habitación. Inténtalo más tarde.",
          icon: "error",
        }).then(() => navegacion("/administrador"));
      }
    };
    cargarHabitacion();
  }, [creandoHabitacion, id, reset, navegacion]);

  const onSubmit = async (formulario) => {
    const fechaEntrada = datetimeLocalAISO(formulario.fechaEntrada);
    const fechaSalida = datetimeLocalAISO(formulario.fechaSalida);
    if (!fechaEntrada || !fechaSalida) {
      Swal.fire({
        title: "Error",
        text: "Las fechas ingresadas no son válidas.",
        icon: "error",
      });
      return;
    }

    const habitacion = {
      ...formulario,
      disponibilidad: formulario.disponibilidad === true || formulario.disponibilidad === "true",
      fechaEntrada,
      fechaSalida,
    };

    if (creandoHabitacion) {
      const { ok, status, datos } = await crearHabitacionAdmin(habitacion);
      if (ok) {
        reset(valoresIniciales);
        Swal.fire({
          title: "Habitación creada",
          text: datos?.mensaje || "La habitación fue creada correctamente",
          icon: "success",
        });
      } else if (status !== 401) {
        Swal.fire({
          title: "Error",
          text: textoErrorBack(
            datos,
            `No se pudo cargar la ${habitacion.tipoHabitacion}. Inténtalo más tarde.`
          ),
          icon: "error",
        });
      }
    } else {
      const { ok, status, datos } = await editarHabitacionAdmin(id, habitacion);
      if (ok) {
        Swal.fire({
          title: "Habitación editada",
          text: datos?.mensaje || "La habitación fue editada correctamente",
          icon: "success",
        });
        navegacion("/administrador");
      } else if (status !== 401) {
        Swal.fire({
          title: "Error",
          text: textoErrorBack(datos, "No se pudo editar la habitación. Inténtalo más tarde."),
          icon: "error",
        });
      }
    }
  };
  return (
    <section className="container flex-grow-1">
      <h1 className="display-4 mt-5">{titulo}</h1>
      <hr />
      <Form className="my-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Form.Group className="mb-3" controlId="forTipoHabitacion">
          <Form.Label>Tipo de Habitación*</Form.Label>
          <Form.Select
            {...register("tipoHabitacion", {
              required: "Seleccione un tipo de habitacion",
            })}
          >
            <option value="">Selecciona una opción</option>
            <option value="Habitacion Individual">Habitacion Individual</option>
            <option value="Habitacion Doble">Habitacion Doble</option>
            <option value="Habitacion Familiar">Habitacion Familiar</option>
            <option value="Suite Junior">Suite Junior</option>
            <option value="Suite Presidencial">Suite Presidencial</option>
          </Form.Select>
          <Form.Text className="text-danger">
            {errors.tipoHabitacion?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Capacidad*</Form.Label>
          <Form.Control
            type="number"
            {...register("capacidad", {
              valueAsNumber: true,
              required: "La capacidad es un dato obligatorio",
              min: { value: 1, message: "La capacidad mínima es de 1 persona" },
              max: {
                value: 6,
                message: "La capacidad máxima es de 6 personas",
              },
              validate: (valor) =>
                Number.isInteger(valor) || "La capacidad debe ser un número entero",
            })}
          />
          <Form.Text className="text-danger">
            {errors.capacidad?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Precio por noche ($)*</Form.Label>
          <Form.Control
            type="number"
            {...register("precio", {
              valueAsNumber: true,
              required: "El precio es un dato obligatorio",
              min: { value: 100, message: "El precio mínimo es 100 usd" },
              max: { value: 500, message: "El precio máximo es de 500 usd" },
            })}
          />
          <Form.Text className="text-danger">
            {errors.precio?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Servicios*</Form.Label>
          <Form.Control
            type="text"
            {...register("servicios", {
              required: "El servicio es un dato obligatorio",
              minLength: {
                value: 10,
                message: "Debe ingresar como mínimo 10 caracteres",
              },
              maxLength: {
                value: 500,
                message: "Debe ingresar como máximo 500 caracteres",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.servicios?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripcion Breve*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Habitacion espaciosa con vista al mar.."
            {...register("descripcion_breve", {
              required: "La descripcion breve es un dato obligatorio",
              minLength: {
                value: 20,
                message: "Debe ingresar como mínimo 20 caracteres",
              },
              maxLength: {
                value: 300,
                message: "Debe ingresar como máximo 300 caracteres",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.descripcion_breve?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripcion Amplia*</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...register("descripcion_amplia", {
              required: "La descripcion amplia es un dato obligatorio",
              minLength: {
                value: 30,
                message: "Debe ingresar como mínimo 30 caracteres",
              },
              maxLength: {
                value: 1000,
                message: "Debe ingresar como máximo 1000 caracteres",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.descripcion_amplia?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tamaño de la Habitación (m²)*</Form.Label>
          <Form.Control
            type="number"
            {...register("tamanio", {
              valueAsNumber: true,
              required: "El tamaño es un dato obligatorio",
              min: {
                value: 10,
                message: "Tamaño mínimo  10 m²",
              },
              max: {
                value: 100,
                message: "Tamaño máximo  100 m²",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.tamanio?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Url de imagen*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: https://wwww.ejemploimagen.com/habitacion.jpg"
            {...register("imagen", {
              required: "La URL de la imagen es un dato obligatorio",
              pattern: {
                value: /^https?:\/\/\S+$/i,
                message:
                  "Debe ingresar una URL válida que comience con http:// o https://",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.imagen?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group  className="mb-3">
        <Form.Label>Disponibilidad*</Form.Label>
          <Form.Select
            {...register("disponibilidad", {
              required: "seleccione su disponibilidad",
            })}
          >
          <option value="true">Si</option>
          <option value="false">No</option>
          </Form.Select>
          <Form.Text className="text-danger">
            {errors.disponibilidad?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group  className="mb-3">
          <Form.Label>Fecha de Entrada*</Form.Label>
          <Form.Control
            type="datetime-local"
            {...register("fechaEntrada", {
              required: "La fecha de entrada es un dato obligatorio",
              validate: {
                valida: (valor) =>
                  datetimeLocalAISO(valor) !== null || "Ingrese una fecha válida",
                desdeHoy: (valor) =>
                  !creandoHabitacion ||
                  new Date(valor) >= inicioDeHoy() ||
                  "La fecha de entrada no puede ser anterior a hoy",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.fechaEntrada?.message}
          </Form.Text>
        </Form.Group>
        <Form.Group   className="mb-3">
          <Form.Label>Fecha de Salida*</Form.Label>
          <Form.Control
            type="datetime-local"
            {...register("fechaSalida", {
              required: "La fecha de salida es un dato obligatorio",
              validate: {
                valida: (valor) =>
                  datetimeLocalAISO(valor) !== null || "Ingrese una fecha válida",
                posterior: (valor) =>
                  !getValues("fechaEntrada") ||
                  new Date(valor) > new Date(getValues("fechaEntrada")) ||
                  "La fecha de salida debe ser posterior a la fecha de entrada",
              },
            })}
          />
          <Form.Text className="text-danger">
            {errors.fechaSalida?.message}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {creandoHabitacion ? "Crear Habitación" : "Editar Habitación"}
        </Button>
      </Form>
    </section>
  );
};

export default FormularioHabitacion;
