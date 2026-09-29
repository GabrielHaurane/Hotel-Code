import FormularioHabitacion from "../../Admin/FormularioHabitacion.jsx";
import Administrador from "../pages/Administrador.jsx";
import { Route, Routes } from "react-router-dom";

const RutasAdmin = () => {
  return (
    <Routes>
      <Route path="/" element={<Administrador></Administrador>}></Route>
      <Route
        path="/crear"
        element={
          <FormularioHabitacion
            titulo="Nueva Habitación"
            creandoHabitacion={true}
          ></FormularioHabitacion>
        }
      ></Route>
      <Route
        path="/editar/:id"
        element={
          <FormularioHabitacion
            titulo="Editar Habitación"
            creandoHabitacion={false}
          ></FormularioHabitacion>
        }
      ></Route>
    </Routes>
  );
};

export default RutasAdmin;
