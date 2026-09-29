import error from '../assets/error404.jpg'
import { Button } from 'react-bootstrap';
const Error404 = () => {
    return (
        <div className='flex-grow-1 text-center backQ'>
            <h1>Lo siento la pagina no esta funcionando</h1>
            <div className='my-5 col-12'>
            <img src={error} alt="error 404" className='col-12 col-lg-8'/>
            </div>
            <Button className='mb-5 btn-dark' href="/">volver al inicio</Button>
        </div>
    );
};

export default Error404;