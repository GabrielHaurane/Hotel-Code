import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EVENTO_SESION_VENCIDA } from "../../helpers/api.js";
import { borrarSesion, vencimientoToken } from "../../helpers/sesion.js";

// Controla la expiración de la sesión:
// 1) programa el cierre para el `exp` real del JWT;
// 2) escucha el evento que dispara api.js cuando el back responde 401.
const TiempoToken = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuarioLogueado) return;

    let avisado = false;
    const cerrarSesion = () => {
      if (avisado) return;
      avisado = true;
      borrarSesion();
      setUsuarioLogueado(null);
      navigate("/login");
      Swal.fire({
        title: "Sesión Expirada",
        text: "Tu sesión expiró. Por favor, inicia sesión nuevamente.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
    };

    const exp = vencimientoToken(usuarioLogueado.token);
    const restante = exp ? exp - Date.now() : 0;
    // setTimeout admite hasta ~24,8 días; tokens más largos no se programan.
    const temporizador =
      restante <= 2147483647 ? setTimeout(cerrarSesion, Math.max(restante, 0)) : null;

    window.addEventListener(EVENTO_SESION_VENCIDA, cerrarSesion);
    return () => {
      if (temporizador) clearTimeout(temporizador);
      window.removeEventListener(EVENTO_SESION_VENCIDA, cerrarSesion);
    };
  }, [usuarioLogueado, navigate, setUsuarioLogueado]);

  return null;
};

export default TiempoToken;
