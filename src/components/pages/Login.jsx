import { useState } from "react";
import { Row, Container, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { login, registro } from "../../helpers/queries.usuarios.js";
import { esAdmin, guardarSesion } from "../../helpers/sesion.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo-hotelcode.jpg";

const Login = ({ setUsuarioLogueado }) => {
  const [registrarse, setRegistrarse] = useState(false);
  const navegacion = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const onsubmit = async (usuario) => {
    if (registrarse) {
      const { ok, datos } = await registro(usuario);
      if (ok) {
        Swal.fire({
          title: "Registro Exitoso",
          text: datos?.mensaje || "Gracias por unirte a Hotel Code, ya puedes Iniciar Sesión",
          icon: "success",
        }).then(() => {
          reset();
          setRegistrarse(false);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: datos?.mensaje || "No se pudo completar el registro",
          icon: "error",
        });
      }
      return;
    }

    const { ok, status, datos } = await login(usuario);
    if (ok) {
      const sesion = guardarSesion(datos);
      setUsuarioLogueado(sesion);
      Swal.fire({
        title: "Usuario Logueado",
        text: `Bienvenido a HotelCode`,
        icon: "success",
      });
      navegacion(esAdmin(sesion) ? "/administrador" : "/catalogo");
    } else if (status === 429) {
      Swal.fire({
        title: "Demasiados intentos",
        text:
          datos?.mensaje ||
          "Superaste el límite de intentos de inicio de sesión. Esperá unos minutos e intentá de nuevo.",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: datos?.mensaje || "Email o Password incorrecto",
        icon: "error",
      });
    }
  };

  const cambiarFormulario = () => {
    setRegistrarse(!registrarse);
    reset();
  };

  return (
    <section className="container text-center my-5 m-auto sectionLogin flex-grow-1">
      <Container>
        <Row className="justify-content-center">
          <div className="col-lg-6 d-flex my-lg-5 mt-3 ">
            <h1
              className={`fst-italic my-lg-5 ms-lg-5 ${
                registrarse ? "titulo-registro" : "titulo-login"
              }`}
            >
              {registrarse
                ? "¡Creá tu cuenta y comenzá a navegar!"
                : `¡Iniciá sesión y encontrá tu habitación ideal!`}
            </h1>
          </div>
          <Card
            className={`col-lg-6 text-center my-5 border-0 ${
              registrarse ? "bg-registro" : "bg-login"
            }`}
          >
            <Card.Title>
              <img src={logo} alt="Logo-HotelCode" className="img-login mt-lg-3 mt-3" />
            </Card.Title>
            <Card.Body>
              <Form
                onSubmit={handleSubmit(onsubmit)}
                className={`fw-bold ${
                  registrarse ? "text-dark" : "text-white"
                }`}
              >
                <Form.Group controlId="formGroupEmail">
                  <Form.Label>Correo Electrónico *</Form.Label>
                  <Form.Control
                    className="text-center w-75 m-auto"
                    type="email"
                    placeholder="Ej: juanperez@email.com"
                    {...register("email", {
                      required: "El  correo electrónico es un dato obligatorio",
                      minLength: {
                        value: 3,
                        message:
                          "El correo electrónico debe tener al menos 3 caracteres",
                      },
                      maxLength: {
                        value: 320,
                        message:
                          "El correo electrónico no debe tener más de 320 caracteres",
                      },
                      pattern: {
                        value:
                          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                        message:
                          "Ingresa un formato valido de email.Ej: juanperez@email.com",
                      },
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors.email?.message}
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                  <Form.Label>Contraseña *</Form.Label>
                  <Form.Control
                    className="text-center w-75 m-auto"
                    type="password"
                    placeholder="Ej: 123aA45$"
                    {...register("password", {
                      required: "La contraseña es un campo obligatorio",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe contener al menos 8 caracteres",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "La contraseña no debe contener más de 100 caracteres",
                      },
                      pattern: {
                        value:
                          /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,100}$/,
                        message:
                          "La contraseña debe incluir al menos una letra mayúscula, una minúscula, un númmero y un carácter especial",
                      },
                    })}
                  />
                  <Form.Text className="text-danger">
                    {errors.password?.message}
                  </Form.Text>
                </Form.Group>
                {registrarse && (
                  <Form.Group controlId="formGroupPassword">
                    <Form.Label>Repetir Contraseña *</Form.Label>
                    <Form.Control
                      className="text-center w-75 m-auto"
                      type="password"
                      placeholder="Ej: 123aA45$"
                      {...register("confirmarPassword", {
                        required: "La contraseña es un campo obligatorio",
                        validate: (value) =>
                          value === getValues("password") || "Las contraseñas no coinciden",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe contener al menos 8 caracteres",
                        },
                        maxLength: {
                          value: 100,
                          message: "La contraseña no debe contener más de 100 caracteres",
                        },
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,100}$/,
                          message:
                            "La contraseña debe incluir al menos una letra mayúscula, una minúscula, un númmero y un carácter especial",
                        },
                      })}
                      
                    />
                    <Form.Text className="text-danger">
                      {errors.confirmarPassword?.message}
                    </Form.Text>
                  </Form.Group>
                )}

                <div className="justify-content-center d-flex my-3">
                  <Button type="submit" variant="success" className="btnLogin">
                    {registrarse ? "Registrarse" : "Iniciar Sesion"}
                  </Button>
                </div>
              </Form>
              <div>
                <p
                  onClick={cambiarFormulario}
                  className={`texto-opcion ${
                    registrarse ? "text-dark" : "text-white"
                  }`}
                >
                  {registrarse
                    ? "¿Ya tenes cuenta? Inicia sesión aquí"
                    : "¿No tenes cuenta?  Registrate aquí"}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
