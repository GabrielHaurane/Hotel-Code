import { useEffect, useState } from "react";
import { Alert, Placeholder, Spinner } from "react-bootstrap";

// Tras cuántos ms sin respuesta se asume que el back (Render free) está arrancando.
const DEMORA_ARRANQUE = 8000;

/**
 * Estado "conectando con el servidor": cartel informativo + skeleton que
 * imita un formulario (título, `campos` inputs y botón). Se monta al iniciar
 * la petición y se desmonta al terminar.
 */
const CargandoServidor = ({ campos = 2 }) => {
  const [demorado, setDemorado] = useState(false);

  useEffect(() => {
    const temporizador = setTimeout(() => setDemorado(true), DEMORA_ARRANQUE);
    return () => clearTimeout(temporizador);
  }, []);

  return (
    <div role="status" aria-live="polite" className="hc-cargando">
      <Alert variant="info" className="hc-alerta-servidor d-flex gap-3 align-items-start text-start">
        <Spinner animation="border" size="sm" className="hc-alerta-spinner flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="fw-semibold mb-1">
            {demorado ? "El servidor se está iniciando, ya casi…" : "Conectando con el servidor…"}
          </p>
          <p className="mb-0 small">
            {demorado
              ? "Gracias por la paciencia: en unos segundos más deberías estar adentro."
              : "Por favor esperá. Si es la primera vez en un rato, el servidor puede tardar hasta un minuto en iniciarse."}
          </p>
        </div>
      </Alert>

      <div className="hc-skeleton" aria-hidden="true">
        <Placeholder as="div" animation="glow" className="text-center mb-4">
          <Placeholder xs={7} size="lg" className="hc-skeleton-barra" />
        </Placeholder>
        {Array.from({ length: campos }, (_, i) => (
          <Placeholder as="div" animation="glow" key={i} className="mb-3">
            <Placeholder xs={4} size="sm" className="hc-skeleton-barra mb-2" />
            <Placeholder xs={12} className="hc-skeleton-input" />
          </Placeholder>
        ))}
        <Placeholder as="div" animation="glow" className="mt-4">
          <Placeholder xs={12} className="hc-skeleton-boton" />
        </Placeholder>
      </div>
    </div>
  );
};

export default CargandoServidor;
