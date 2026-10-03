import { Link, useNavigate } from 'react-router-dom'
import '../styles/Contact.css'

function Registro() {
  const navigate = useNavigate()

  const handleRegistro = (event) => {
    event.preventDefault()
    // Registro hardcodeado por ahora: reemplazar por POST /api/auth/register.
    navigate('/login')
  }

  return (
    <div className="contact-container">
      <h1>Crear cuenta</h1>
      <form className="contact-form" onSubmit={handleRegistro}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" required />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input id="apellido" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" required />
        </div>
        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
          <input id="fechaNacimiento" type="date" />
        </div>
        <div className="form-group">
          <label htmlFor="sexo">Sexo</label>
          <select id="sexo">
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="X">Otro</option>
          </select>
        </div>
        <button type="submit" className="btn-send">Registrarme</button>
      </form>
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  )
}

export default Registro
