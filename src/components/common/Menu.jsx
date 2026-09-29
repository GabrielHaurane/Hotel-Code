import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo-hotelcode.jpg";
import { borrarSesion, esAdmin } from "../../helpers/sesion.js";

const ItemMenu = ({ to, icono, children, onClick, end = true }) => (
  <NavLink end={end} className="nav-link hc-nav-link" to={to} onClick={onClick}>
    <i className={`bi ${icono}`} aria-hidden="true"></i>
    <span>{children}</span>
  </NavLink>
);

const Menu = ({ usuarioLogueado, setUsuarioLogueado }) => {
  const navegacion = useNavigate();
  const [expandido, setExpandido] = useState(false);
  const cerrarMenu = () => setExpandido(false);

  const logout = () => {
    cerrarMenu();
    borrarSesion();
    setUsuarioLogueado(null);
    navegacion("/");
  };

  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      collapseOnSelect
      expanded={expandido}
      onToggle={setExpandido}
      className="hc-navbar"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="hc-brand" onClick={cerrarMenu}>
          <img
            src={logo}
            alt="Logo de Hotel Code"
            className="hc-brand-logo"
            width={48}
            height={48}
          />
          <span className="hc-brand-text">
            Hotel <span className="hc-accent">Code</span>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="hc-navbar-nav"
          aria-label="Abrir o cerrar menú de navegación"
          className="hc-toggler"
        />
        <Navbar.Collapse id="hc-navbar-nav">
          <Nav className="ms-auto align-items-lg-center hc-nav">
            <ItemMenu onClick={cerrarMenu} to="/" icono="bi-house-door">
              Inicio
            </ItemMenu>
            <ItemMenu onClick={cerrarMenu} to="/quienessomos" icono="bi-people">
              Quiénes somos
            </ItemMenu>
            <ItemMenu onClick={cerrarMenu} to="/galeria" icono="bi-stars">
              Servicios
            </ItemMenu>
            {usuarioLogueado && (
              <ItemMenu onClick={cerrarMenu} to="/reservas" icono="bi-calendar-check">
                Mis Reservas
              </ItemMenu>
            )}
            <ItemMenu onClick={cerrarMenu} to="/catalogo" icono="bi-door-open">
              Habitaciones
            </ItemMenu>
            <ItemMenu onClick={cerrarMenu} to="/contacto" icono="bi-envelope">
              Contacto
            </ItemMenu>
            {esAdmin(usuarioLogueado) && (
              <ItemMenu onClick={cerrarMenu} to="/administrador" icono="bi-speedometer2" end={false}>
                Administrador
              </ItemMenu>
            )}
            {usuarioLogueado ? (
              <button
                type="button"
                className="btn hc-btn-sesion hc-btn-logout"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <>
                <NavLink
                  end
                  className="btn hc-btn-sesion hc-btn-registro"
                  to="/registro"
                  onClick={cerrarMenu}
                >
                  <i className="bi bi-person-plus" aria-hidden="true"></i>
                  <span>Registrarse</span>
                </NavLink>
                <NavLink
                  end
                  className="btn hc-btn-sesion"
                  to="/login"
                  onClick={cerrarMenu}
                >
                  <i className="bi bi-person-circle" aria-hidden="true"></i>
                  <span>Iniciar Sesión</span>
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
