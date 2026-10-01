import { Card, CardFooter } from "react-bootstrap";
import { Link } from "react-router-dom";
import { galeriaIMG1 } from "../../assets/imagenes.js";

const CardHabitacion = ({ habitacion }) => {
  return (
    <div>
      <Card className="card-habitacion d-flex flex-md-row flex-column mb-3">
        <div className="card-habitacion__media w-100">
          <img className="col-12 rounded-top-2 object-fit-cover" src={habitacion.imagen || galeriaIMG1} alt={habitacion.tipoHabitacion} />
        </div>
        <Card.Body className="col-12">
          <Card.Title>{habitacion.tipoHabitacion}</Card.Title>
          <Card.Text>
            {habitacion.descripcion_breve}
          </Card.Text>
          <div><b>U$D {habitacion.precio}</b></div>
        </Card.Body>
        <CardFooter className="d-flex align-content-md-end flex-md-wrap justify-content-end">
          <div>
            <Link to={`../detallehabitacion/${habitacion.id}`} className="btn btn-dark text-white">
              Ver detalles
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardHabitacion;
