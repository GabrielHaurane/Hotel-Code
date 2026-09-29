import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo-hotelcode.jpg";

const linksRapidos = [
  { to: "/", texto: "Inicio" },
  { to: "/quienessomos", texto: "Quiénes somos" },
  { to: "/galeria", texto: "Servicios" },
  { to: "/catalogo", texto: "Habitaciones" },
  { to: "/ubicacion", texto: "Ubicación" },
  { to: "/contacto", texto: "Contacto" },
];

const redes = [
  { href: "https://www.facebook.com", icono: "bi-facebook", nombre: "Facebook" },
  { href: "https://www.instagram.com", icono: "bi-instagram", nombre: "Instagram" },
  { href: "https://www.twitter.com", icono: "bi-twitter-x", nombre: "X (Twitter)" },
  { href: "https://www.linkedin.com", icono: "bi-linkedin", nombre: "LinkedIn" },
];

const Footer = () => {
  const anio = new Date().getFullYear();

  return (
    <footer className="hc-footer">
      <Container className="py-5">
        <Row className="gy-4 text-center text-md-start">
          <Col xs={12} md={6} lg={4}>
            <Link to="/" className="hc-footer-brand">
              <img
                src={logo}
                alt="Logo de Hotel Code"
                className="hc-brand-logo"
                width={56}
                height={56}
              />
              <span className="hc-brand-text">
                Hotel <span className="hc-accent">Code</span>
              </span>
            </Link>
            <p className="hc-footer-text mt-3 mb-0">
              Confort, elegancia y atención personalizada para que tu estadía
              sea inolvidable.
            </p>
          </Col>

          <Col xs={12} md={6} lg={2}>
            <h2 className="hc-footer-title">Enlaces</h2>
            <ul className="list-unstyled hc-footer-links mb-0">
              {linksRapidos.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.texto}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <h2 className="hc-footer-title">Contacto</h2>
            <ul className="list-unstyled hc-footer-contacto mb-0">
              <li>
                <i className="bi bi-telephone" aria-hidden="true"></i>
                <a href="tel:+543812584026">+54 381 2584026</a>
              </li>
              <li>
                <i className="bi bi-envelope" aria-hidden="true"></i>
                <a href="mailto:hotelcod3@gmail.com">hotelcod3@gmail.com</a>
              </li>
              <li>
                <i className="bi bi-geo-alt" aria-hidden="true"></i>
                <Link to="/ubicacion">Cómo llegar</Link>
              </li>
              <li>
                <i className="bi bi-briefcase" aria-hidden="true"></i>
                <Link to="/contacto">Trabajá con nosotros</Link>
              </li>
            </ul>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <h2 className="hc-footer-title">Seguinos</h2>
            <div className="hc-redes justify-content-center justify-content-md-start">
              {redes.map((red) => (
                <a
                  key={red.nombre}
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hc-red"
                  aria-label={`Hotel Code en ${red.nombre} (se abre en una pestaña nueva)`}
                  title={red.nombre}
                >
                  <i className={`bi ${red.icono}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      <div className="hc-footer-bottom">
        <Container className="py-3 text-center">
          <p className="m-0">
            © {anio} Hotel Code. Todos los derechos reservados.
          </p>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
