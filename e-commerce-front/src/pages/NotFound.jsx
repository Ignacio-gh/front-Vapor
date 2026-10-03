import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="error-code">404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <Link to="/" className="btn-home">
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound
