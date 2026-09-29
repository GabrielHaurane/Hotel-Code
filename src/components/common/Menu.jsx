import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo-hotelcode.jpg";
import { borrarSesion, esAdmin } from "../../helpers/sesion.js";

const Menu = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navegacion = useNavigate();
  const logout = () => {
    borrarSesion();
    setUsuarioLogueado(null);
    navegacion("/");
  };

  return (
    <>
      <Navbar expand="lg" className="backC">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              alt="logo Hotel code"
              className="img-fluid"
              width={100}
            />
          </Navbar.Brand>
          <NavLink
            end
            className="nav-link fs-2 text-white text-decoration-none"
            to="/"
          >
            Hotel Code
          </NavLink>
          <Navbar.Toggle
            className=" bg-white"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto w-100 d-flex justify-content-end">
              <NavLink
                end
                className="nav-link text-white d-flex align-self-center text-center"
                to="/"
              >
                Inicio
              </NavLink>
              <NavLink
                end
                className="nav-link text-white d-flex align-self-center text-center"
                to="/quienessomos"
              >
                Quienes somos
              </NavLink>
              <NavLink
                end
                className="nav-link text-white d-flex align-self-center text-center"
                to="/galeria"
              >
                Servicios
              </NavLink>

              {usuarioLogueado && (
                <NavLink
                  end
                  className="nav-link text-white d-flex align-self-center text-center"
                  to="/reservas"
                >
                  Mis Reservas
                </NavLink>
              )}

              <NavLink
                end
                className="nav-link text-white d-flex align-self-center text-center"
                to="/catalogo"
              >
                Catalogo de habitaciones
              </NavLink>
              {esAdmin(usuarioLogueado) ? (
                <>
                  <NavLink
                    end
                    className="nav-link text-white d-flex align-self-center text-center"
                    to="/administrador"
                  >
                    Administrador
                  </NavLink>
                  <button
                    className="nav-link text-white d-flex align-self-center text-center"
                    onClick={logout}
                  >
                    Cerrar Sesion
                  </button>
                </>
              ) : usuarioLogueado ? (
                <>
                  <button
                    className="nav-link text-white d-flex align-self-center text-center"
                    onClick={logout}
                  >
                    Cerrar Sesion
                  </button>
                </>
              ) : (
                <NavLink
                  end
                  className="nav-link text-white d-flex flex-wrap align-self-center text-center"
                  to="/login"
                >
                  Iniciar Sesion
                </NavLink>
              )}
              <NavLink
                end
                className="nav-link text-white d-flex align-self-center text-center"
                to="/contacto"
              >
                Contacto
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Menu;
