import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

/**
 * Input de contraseña con ícono y botón mostrar/ocultar (Login y Registro).
 * `registro` = resultado de register("campo", reglas) de react-hook-form.
 */
const CampoPassword = ({ id, label, registro, error, autoComplete = "current-password" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <InputGroup className="hc-auth-input" hasValidation>
        <InputGroup.Text>
          <i className="bi bi-lock" aria-hidden="true"></i>
        </InputGroup.Text>
        <Form.Control
          type={visible ? "text" : "password"}
          placeholder="Ej: 123aA45$"
          autoComplete={autoComplete}
          isInvalid={Boolean(error)}
          {...registro}
        />
        <button
          type="button"
          className="btn hc-auth-ojo"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
        >
          <i className={`bi ${visible ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true"></i>
        </button>
      </InputGroup>
      <Form.Text className="text-danger hc-auth-error">{error?.message}</Form.Text>
    </Form.Group>
  );
};

export default CampoPassword;
