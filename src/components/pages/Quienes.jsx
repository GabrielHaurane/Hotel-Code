import { Card } from "react-bootstrap";
import gabrielH from "../assets/Gabriel_Haurane.jpg";
import augustoB from "../assets/Augusto-Brito.jpg";
const Quienes = () => {
  return (
    <div className="flex-grow-1 backQ d-flex">
      <div className=" d-flex flex-wrap justify-content-around flex-column flex-md-row container">
        <div className="col-12 col-md-8 backQ my-3 d-flex justify-content-center align-items-center flex-lg-row flex-column flex-wrap">
          <div className="d-flex flex-row flex-wrap">
            <div className="d-flex col-6 justify-content-center align-items-center">
              <img className="col-11 h-75 object-fit-cover" src={gabrielH} />
            </div>
            <div className="d-flex col-6 justify-content-center align-items-center">
              <img className="col-11 h-75 object-fit-cover" src={augustoB} />
            </div>
            <Card.Body className="col-12 d-flex flex-row text-center">
              <div className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                <div className="d-flex flex-row justify-content-around w-100">
                  <div className="d-flex flex-column justify-content-between">
                  <Card.Title className="col-12 text-center">
                    Gabriel Alejandro Haurane
                  </Card.Title>
                  <Card.Text className="col-12 text-center">
                    <b>Desarrollador</b>
                  </Card.Text>
                  </div>
                  <div className="d-flex flex-column justify-content-between">
                  <Card.Title className="col-12 text-center">
                  Augusto Patricio Brito
                  </Card.Title>
                  <Card.Text className="col-12 text-center">
                    <b>Desarrollador</b>
                  </Card.Text>
                  </div>
                </div>
                <Card.Text className="col-12 mt-4 fs-5">
                  “Nuestra misión es ofrecer una experiencia de estancia única y
                  cálida, donde cada huésped se sienta en un ambiente familiar,
                  rodeado de confort y elegancia. Aspiramos a ser la primera
                  elección para quienes valoran la calidad, la paz y un servicio
                  personalizado.”
                </Card.Text>
              </div>
            </Card.Body>
            <Card.Body className="col-12 d-flex flex-row text-center"></Card.Body>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quienes;
