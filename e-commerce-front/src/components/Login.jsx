import { Link, useLocation, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = (event) => {
    event.preventDefault()

    // Ejemplo solamente: reemplazalo por la respuesta de tu autenticación.
    localStorage.setItem('token', 'token-de-ejemplo')

    const destination = location.state?.from?.pathname || '/cart'
    navigate(destination, { replace: true })
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Iniciar sesión</h1>
      <button type="submit">Ingresar</button>
      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </form>
  )
}

export default Login