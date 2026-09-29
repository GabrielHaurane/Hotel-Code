import logo from "../assets/logo-hotelcode.jpg";

const Footer = () => {
  return (
    <div className=" backC py-4 d-flex align-item-center justify-content-center">
      <div className="d-flex flex-column flex-md-row align-items-center mb-4 w-100 flex-wrap justify-content-around">
        <div className="d-flex justify-content-around align-items-center col-12">
        <div className="d-flex align-items-center me-md-5 mb-3 mb-md-0 ">
          <img
            src={logo}
            alt="logo Hotel Code"
            className="img-fluid"
            width={65}
          />
          <div className="ms-3">
            <p className="text-white m-0">Trabaja con nosotros:</p>
            <p className="text-white m-0">Tel: +54 381 2584026</p>
            <p className="text-white m-0">Email: hotelcod3@gmail.com</p>
          </div>
        </div>
        
        <div className="d-flex mb-4 flex-wrap">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-2"
          >
            <i className="bi bi-facebook fs-4"></i>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-2"
          >
            <i className="bi bi-instagram fs-4"></i>
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-2"
          >
            <i className="bi bi-twitter fs-4"></i>
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white mx-2"
          >
            <i className="bi bi-linkedin fs-4"></i>
          </a>
        </div>
        </div>
        
        <div className="text-center text-white mt-md-3 container col-12">
          <p className="m-0">
            © {new Date().getFullYear()} Hotel Code. Todos los derechos
            reservados.
          </p>
          <a
            href="/terminos-y-condiciones"
            className="text-white text-decoration-none"
          >
            Términos y Condiciones
          </a>
          <a
            href="/politica-privacidad"
            className="text-white text-decoration-none"
          >
            Política de Privacidad
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default Footer;
