import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contacto = () => {
  const form = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const sendEmail = () => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error(
        "Faltan VITE_EMAILJS_SERVICE_ID / VITE_EMAILJS_TEMPLATE_ID / VITE_EMAILJS_PUBLIC_KEY"
      );
      Swal.fire({
        icon: "error",
        title: "Formulario no disponible",
        text: "El envío de mensajes no está configurado en este momento. Escribinos por otro medio o intentá más tarde.",
      });
      return;
    }
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          Swal.fire({
            icon: "success",
            title: "Mensaje enviado!",
            text: "Tu mensaje ha sido enviado con éxito.",
          });
          reset();
        },
        (error) => {
          console.error("Error de EmailJS:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Hubo un error al enviar el mensaje. Inténtalo de nuevo.",
          });
        }
      );
  };
  return (
    <div className="backQS flex-grow-1 d-flex flex-column justify-content-evenly align-content-center">
      <h1 className="text-center my-3">Contactanos:</h1>
      <section className="container d-flex flex-wrap justify-content-center flex-column flex-md-row align-content-center ">
        <Form
          ref={form}
          onSubmit={handleSubmit(sendEmail)}
          className="border w-100 backS d-flex flex-column flex-wrap align-content-center rounded-5"
        >
          <div className="col-10">
            <Form.Group>
            <Form.Label className="m-2 text-white">Nombre</Form.Label>
            <Form.Control
              placeholder="Jose Perez"
              type="text"
              name="user_name"
              className="w-100"
              {...register("user_name", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message: "El nombre no puede exceder los 20 caracteres",
                },
              })}
            />
            <Form.Text className="text-danger">{errors.user_name?.message}</Form.Text>
            </Form.Group>
            <Form.Group>
            <Form.Label className="m-2 text-white">Email </Form.Label>
            <Form.Control
              placeholder="JosePerez@gmail.com"
              type="email"
              name="user_email"
              className="w-100"
              {...register("user_email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Introduce un correo válido",
                },
                minLength: {
                  value: 3,
                  message: "El correo debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 320,
                  message: "El correo no puede exceder los 320 caracteres",
                },
              })}
            />
            <Form.Text className="text-danger">{errors.user_email?.message}</Form.Text>
            </Form.Group>
          </div>
          <div>
            <Form.Group>
            <Form.Label className="m-2 text-white">mensaje</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Querido Hotel Code..."
              name="message"
              className="mb-3 w-100"
              {...register("message", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 5,
                  message: "El mensaje debe tener al menos 5 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El mensaje no puede exceder los 50 caracteres",
                },
              })}
            />
            <Form.Text className="text-danger">{errors.message?.message}</Form.Text>
            </Form.Group>
          </div>
          <div className="d-flex justify-content-center mb-2">
            <Button type="submit"  className="backC border-0">
              Enviar
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
};

export default Contacto;
