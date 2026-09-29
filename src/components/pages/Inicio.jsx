import Carousel from "react-bootstrap/Carousel";
import {
  hotelImg,
  primeraImg,
  segundaImg,
  terceraImg,
} from "../assets/imagenes.js";
import { useNavigate } from "react-router-dom";

// La sesión llega por props desde App.jsx (única fuente de verdad).
const Inicio = ({ usuarioLogueado }) => {
  const navegacion = useNavigate()
  return (
    <div className="flex-grow-1">
      <Carousel interval={null}>
        <Carousel.Item>
          <img
            className="d-block w-100 object-fit-cover"
            src={primeraImg}
            alt="First slide"
            width={800}
            height={700}
          />
          <Carousel.Caption className="caption-centered w-100">
            <hr className="line" />
            <h2 className="tama1 mt-4">Bienvenido al Hotel Code</h2>
            <div className="mb-4">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </div>
            <hr className="line" />
            <p className="text-white fs-3">Comodidad, Confort, Relajación</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100 object-fit-cover"
            src={segundaImg}
            alt="Second slide"
            width={800}
            height={700}
          />
          <Carousel.Caption className="caption-centered w-100">
            <hr className="line" />
            <h3 className="tama1">Disfruta tu estadia</h3>
            <div className="mb-4">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </div>
            <hr className="line" />
            <p className="text-white fs-3">Junto a tu familia</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item >
          <img
            className="d-block w-100 object-fit-cover"
            src={terceraImg}
            alt="Third slide"
            width={800}
            height={700}
          />
          <Carousel.Caption className="caption-centered w-100">
            <hr className="line" />
            <h3 className="tama1">Hotel Code</h3>
            <div className="mb-4">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
            </div>
            <hr className="line" />
            <p className="text-white fs-3">
              El mejor hotel para tus vacaciones
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      {!usuarioLogueado && (
        <section className="text-center py-3 backCC">
          <button className="btn-inicio" onClick={() => navegacion("/login")}>
            RESERVAR
          </button>
        </section>
      )}
      <div className="text-center py-2 Acerca text-white">
        <h1>Acerca de Hotel Code</h1>
      </div>
      <section className="d-flex flex-wrap flex-column flex-lg-row text-white backCC p-3">
        <div className="col-12  d-flex align-self-center justify-content-center mb-4">
          <img
            className="w-100 p-0"
            src={hotelImg}
            alt="imagen del hotel"
            height={580}
          />
        </div>
        <div className="text-center w-100 mb-3">
        <button className=" border-0 btn ubicacion fs-5" onClick={()=> navegacion('/ubicacion')}>Ubicación</button>
        </div>
        <article className="pe-3 col-12 d-flex flex-column align-self-center text-justify">
          <p className="fs-5">
            Fundado en el año 1995 por unos visionarios emprendedores y
            apasionados de la tecnología, Gabriel Alejandro Haurane y Augusto
            Patricio Brito, quienes soñaron con fusionar lo mejor de la
            hospitalidad tradicional con los avances tecnológicos del futuro.
          </p>
          <p className="fs-5">
            Se consolidó como uno de los más prestigiosos de la región,
            atrayendo a empresarios, artistas, y personalidades del mundo de la
            tecnología y las startups. El Hotel Code ofrece una
            estancia de lujo, siendo un centro de
            innovación, que se convirtio en sede de conferencias tecnológicas, lanzamientos de
            productos, y eventos exclusivos para los líderes del sector.
          </p>
          <p className="fs-5">
            Ubicado en una ciudad cosmopolita y vibrante, el hotel abrió sus
            puertas como una joya de diseño moderno, con una promesa clara:
            ofrecer una experiencia de lujo sofisticada con la mayor innovación
            tecnológica disponible en la época.
          </p>
        </article>
      </section>
    </div>
  );
};

export default Inicio;
