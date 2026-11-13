import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { API_URL } from '../config/api'
import { setUsuario } from '../store/slices/authSlice'
import TiltedGridHero from './TiltedGridHero'
import products from '../data/products.json'
import '../styles/Auth.css'

// Mismas portadas que usa el carrusel del Home, como fondo decorativo.
const heroImages = products.map((producto) => ({
  src: producto.imagen,
  alt: producto.titulo,
}))

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        // Sin esto el navegador ignora la cookie HttpOnly que manda el backend (otro origen)
        credentials: 'include',
      })

      if (!response.ok) {
        const mensaje = await response.text()
        throw new Error(mensaje || 'No se pudo iniciar sesión. Intentá de nuevo.')
      }

      // El token quedó en la cookie; el body trae el perfil (nombre, email, rol)
      dispatch(setUsuario(await response.json()))

      const destination = location.state?.from?.pathname || '/'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <TiltedGridHero images={heroImages} curve={75} className="auth-page__band" />
      <div className="auth-card">
        <h1>Iniciar sesión</h1>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
