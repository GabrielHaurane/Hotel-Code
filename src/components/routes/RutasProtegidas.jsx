import { Navigate } from "react-router-dom";
import { esAdmin } from "../../helpers/sesion.js";

// Guarda de rutas: sin sesión → /login. Con `soloAdmin`, si no es admin → "/".
const RutasProtegidas = ({ children, usuarioLogueado, soloAdmin = false }) => {
  if (!usuarioLogueado) {
    return <Navigate to="/login" replace></Navigate>;
  }
  if (soloAdmin && !esAdmin(usuarioLogueado)) {
    return <Navigate to="/" replace></Navigate>;
  }
  return children;
};

export default RutasProtegidas;
