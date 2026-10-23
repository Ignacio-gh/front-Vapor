import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../config/api'
import TiltedGridHero from './TiltedGridHero'
import products from '../data/products.json'
import '../styles/Auth.css'

// Mismas portadas que usa el carrusel del Home, como fondo decorativo.
const heroImages = products.map((producto) => ({
  src: producto.imagen,
  alt: producto.titulo,
}))

function Registro() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    sexo: 'M',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { id, value } = event.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleRegistro = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fechaNacimiento: form.fechaNacimiento || null,
        }),
      })

      const body = await response.text()

      if (!response.ok) {
        throw new Error(body || 'No se pudo completar el registro. Intentá de nuevo.')
      }

      navigate('/login')
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
        <h1>Crear cuenta</h1>
        <form className="auth-form" onSubmit={handleRegistro}>
          <div className="auth-form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input id="apellido" value={form.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="auth-form-row">
            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input id="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select id="sexo" value={form.sexo} onChange={handleChange}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="X">Otro</option>
              </select>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Registro
