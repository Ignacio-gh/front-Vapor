import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/Contact.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = (event) => {
    event.preventDefault()

    // Ejemplo solamente: reemplazalo por la respuesta de tu autenticación.
    localStorage.setItem('token', 'token-de-ejemplo')

    const destination = location.state?.from?.pathname || '/'
    navigate(destination, { replace: true })
  }

  return (
    <div className="contact-container">
      <h1>Iniciar sesión</h1>
      <form className="contact-form" onSubmit={handleLogin}>
        <button type="submit" className="btn-send">Ingresar</button>
      </form>
      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </div>
  )
}

export default Login