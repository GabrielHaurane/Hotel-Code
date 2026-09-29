import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import Menu from './components/common/Menu.jsx'
import Footer from './components/common/Footer.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DetalleHabitacion from './components/pages/DetalleHabitacion.jsx'
import Login from './components/pages/Login.jsx'
import Registro from './components/pages/Registro.jsx'
import Inicio from './components/pages/Inicio.jsx'
import Catalogo from './components/pages/Catalogo.jsx'
import Contacto from './components/pages/Contacto.jsx'
import Galeria from './components/pages/Galeria.jsx'
import Quienes from './components/pages/Quienes.jsx'
import Error404 from './components/pages/Error404.jsx'
import RutasAdmin from './components/routes/RutasAdmin.jsx'
import RutasProtegidas from './components/routes/RutasProtegidas.jsx'
import { useState } from 'react'
import Reservas from './components/pages/Reservas.jsx';
import TiempoToken from './components/TiempoToken/TiempoToken.jsx';
import Ubicacion from './components/pages/Ubicacion.jsx';
import { borrarSesion, obtenerSesion, tokenExpirado } from './helpers/sesion.js';

// Sesión inicial: la guardada en sessionStorage, siempre que el JWT no esté vencido.
const sesionInicial = () => {
  const sesion = obtenerSesion();
  if (sesion && tokenExpirado(sesion.token)) {
    borrarSesion();
    return null;
  }
  return sesion;
};

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(sesionInicial)

  return (
    <>
      <BrowserRouter>
        <TiempoToken
          usuarioLogueado={usuarioLogueado}
          setUsuarioLogueado={setUsuarioLogueado}
        />
        <Menu usuarioLogueado={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado}></Menu>
        <Routes>
          <Route path="/" element={<Inicio usuarioLogueado={usuarioLogueado}></Inicio>}></Route>
          <Route path='/quienessomos' element={<Quienes></Quienes>}></Route>
          <Route path="/contacto" element={<Contacto></Contacto>}></Route>
          <Route path="/galeria" element={<Galeria></Galeria>}></Route>
          <Route path="/ubicacion" element={<Ubicacion></Ubicacion>}></Route>
          <Route path="/catalogo" element={<Catalogo></Catalogo>}></Route>
          <Route
            path="/reservas"
            element={
              <RutasProtegidas usuarioLogueado={usuarioLogueado}>
                <Reservas></Reservas>
              </RutasProtegidas>
            }
          ></Route>
          <Route
            path="/detallehabitacion/:id"
            element={<DetalleHabitacion usuarioLogueado={usuarioLogueado}></DetalleHabitacion>}
          ></Route>
          <Route
            path="/login"
            element={
              <Login usuarioLogueado={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado}></Login>
            }
          ></Route>
          <Route
            path="/registro"
            element={
              <Registro usuarioLogueado={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado}></Registro>
            }
          ></Route>
          <Route
            path="/administrador/*"
            element={
              <RutasProtegidas usuarioLogueado={usuarioLogueado} soloAdmin>
                <RutasAdmin></RutasAdmin>
              </RutasProtegidas>
            }
          ></Route>
          <Route path="*" element={<Error404></Error404>}></Route>
        </Routes>
      <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App
