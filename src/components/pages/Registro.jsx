import { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login, registro } from "../../helpers/queries.usuarios.js";
import { guardarSesion } from "../../helpers/sesion.js";
import {
  configErrorAuth,
  reglasEmail,
  reglasPassword,
  rutaTrasLogin,
} from "../../helpers/autenticacion.js";
import CampoPassword from "../common/CampoPassword.jsx";
import CargandoServidor from "../common/CargandoServidor.jsx";

const Registro = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navegacion = useNavigate();
  const [cargando, setCargando] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "", confirmarPassword: "" } });

  if (usuarioLogueado) {
    return <Navigate to={rutaTrasLogin(usuarioLogueado)} replace></Navigate>;
  }

  const registrarse = async (usuario) => {
    setCargando(true);
    const alta = await registro(usuario);
    if (!alta.ok) {
      setCargando(false);
      Swal.fire(configErrorAuth(alta.status, alta.datos, "No se pudo completar el registro"));
      return;
    }

    // Registro OK → inicio de sesión automático con las mismas credenciales.
    const { ok, datos } = await login({ email: usuario.email, password: usuario.password });
    setCargando(false);

    if (ok) {
      const sesion = guardarSesion(datos);
      setUsuarioLogueado(sesion);
      Swal.fire({
        title: "¡Bienvenido a Hotel Code!",
        text: "Tu cuenta se creó y ya iniciaste sesión.",
        icon: "success",
      });
      navegacion(rutaTrasLogin(sesion), { replace: true });
      return;
    }

    await Swal.fire({
      title: "Registro exitoso",
      text: alta.datos?.mensaje || "Gracias por unirte a Hotel Code, ya podés iniciar sesión.",
      icon: "success",
    });
    navegacion("/login", { state: { email: usuario.email } });
  };

  return (
    <section className="hc-auth flex-grow-1">
      <Card className="hc-auth-card">
        <Card.Body className="p-4 p-sm-5">
          {cargando && <CargandoServidor campos={3} />}

          {/* El form se oculta (no se desmonta) para no perder lo tipeado */}
          <div className={cargando ? "d-none" : undefined}>
            <div className="text-center mb-4">
              <span className="hc-auth-icono" aria-hidden="true">
                <i className="bi bi-person-plus"></i>
              </span>
              <h1 className="hc-auth-titulo">Crear cuenta</h1>
              <p className="hc-auth-subtitulo mb-0">
                ¡Registrate y empezá a reservar!
              </p>
            </div>

            <Form noValidate onSubmit={handleSubmit(registrarse)}>
              <Form.Group className="mb-3" controlId="registroEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <InputGroup className="hc-auth-input" hasValidation>
                  <InputGroup.Text>
                    <i className="bi bi-envelope" aria-hidden="true"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Ej: juanperez@email.com"
                    autoComplete="email"
                    isInvalid={Boolean(errors.email)}
                    {...register("email", reglasEmail)}
                  />
                </InputGroup>
                <Form.Text className="text-danger hc-auth-error">{errors.email?.message}</Form.Text>
              </Form.Group>

              <CampoPassword
                id="registroPassword"
                label="Contraseña"
                autoComplete="new-password"
                registro={register("password", reglasPassword)}
                error={errors.password}
              />

              <CampoPassword
                id="registroConfirmarPassword"
                label="Repetir contraseña"
                autoComplete="new-password"
                registro={register("confirmarPassword", {
                  ...reglasPassword,
                  validate: (valor) =>
                    valor === getValues("password") || "Las contraseñas no coinciden",
                })}
                error={errors.confirmarPassword}
              />

              <Button type="submit" className="hc-auth-btn w-100 mt-2" disabled={cargando}>
                <i className="bi bi-person-check" aria-hidden="true"></i>
                <span>Registrarme</span>
              </Button>
            </Form>

            <p className="hc-auth-pie text-center mt-4 mb-0">
              ¿Ya tenés cuenta?{" "}
              <Link to="/login" className="hc-auth-link">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Registro;
