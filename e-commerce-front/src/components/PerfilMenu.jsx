import { useState, useEffect, useRef, useId } from 'react'
import { apiFetch } from '../config/api'
import '../styles/Perfil.css'

// El backend devuelve el enum Role (ADMIN, USER, VENDEDOR); se traduce para mostrarlo
const ROLES = {
  ADMIN: 'Administrador',
  USER: 'Usuario',
  VENDEDOR: 'Vendedor',
}

function nombreRol(role) {
  // Por si algún día llega con el prefijo de Spring Security (ROLE_ADMIN)
  const clave = (role ?? '').replace(/^ROLE_/, '')
  return ROLES[clave] ?? clave
}

// Icono de perfil inline para no sumar una librería de íconos por un solo SVG
function IconoPerfil() {
  return (
    <svg
      className="perfil-icono"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

// Menú del usuario logueado en el Navbar. El Navbar solo lo muestra si hay sesión,
// así que acá no se decide nada de autenticación: solo se piden y muestran los datos.
// `email` es el que el Navbar ya lee del token y se usa mientras no llega /me.
// `onLogout` es el handleLogout del Navbar: la lógica de cerrar sesión vive allá
// y acá solo se dispara, para no duplicarla.
function PerfilMenu({ email, onLogout }) {
  const [abierto, setAbierto] = useState(false)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const contenedorRef = useRef(null)
  const botonRef = useRef(null)
  const popupId = useId()

  // Se pide recién al abrir (no al montar el Navbar) para no hacer un request por
  // cada página visitada. Si ya se cargó no se vuelve a pedir; si falló, se reintenta.
  const cargarPerfil = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/usuarios/me')
      if (response.status === 401 || response.status === 403) {
        throw new Error('Tu sesión venció, iniciá sesión de nuevo')
      }
      if (!response.ok) throw new Error('No se pudieron cargar tus datos')
      setPerfil(await response.json())
    } catch (err) {
      // fetch rechaza con TypeError si no hay conexión: mensaje genérico en ese caso
      setError(err instanceof TypeError ? 'No se pudo conectar con el servidor' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = () => {
    const abrir = !abierto
    setAbierto(abrir)
    if (abrir && !perfil && !loading) cargarPerfil()
  }

  // Los listeners globales solo viven mientras el popup está abierto
  useEffect(() => {
    if (!abierto) return

    const handleClickAfuera = (event) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
        setAbierto(false)
      }
    }

    const handleTecla = (event) => {
      if (event.key === 'Escape') {
        setAbierto(false)
        // Devuelve el foco al botón para que el teclado no quede "perdido"
        botonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickAfuera)
    document.addEventListener('keydown', handleTecla)
    return () => {
      document.removeEventListener('mousedown', handleClickAfuera)
      document.removeEventListener('keydown', handleTecla)
    }
  }, [abierto])

  const handleLogout = () => {
    // Se cierra primero para no dejar listeners globales colgando mientras se navega
    setAbierto(false)
    onLogout?.()
  }

  const nombreCompleto = perfil ? [perfil.nombre, perfil.apellido].filter(Boolean).join(' ') : ''

  return (
    <div className="perfil-menu" ref={contenedorRef}>
      <button
        type="button"
        ref={botonRef}
        className={abierto ? 'perfil-boton abierto' : 'perfil-boton'}
        onClick={toggle}
        aria-label={abierto ? 'Cerrar menú de perfil' : 'Abrir menú de perfil'}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        aria-controls={popupId}
        title={email ?? 'Mi perfil'}
      >
        <IconoPerfil />
      </button>

      {abierto && (
        <div id={popupId} className="perfil-popup" role="dialog" aria-label="Mi perfil">
          {loading && <p className="perfil-estado">Cargando...</p>}

          {!loading && error && <p className="perfil-estado perfil-error">{error}</p>}

          {!loading && !error && perfil && (
            <dl className="perfil-datos">
              <div className="perfil-dato">
                <dt>Nombre</dt>
                <dd>{nombreCompleto || '—'}</dd>
              </div>
              <div className="perfil-dato">
                <dt>Email</dt>
                <dd>{perfil.email ?? email}</dd>
              </div>
              <div className="perfil-dato">
                <dt>Rol</dt>
                <dd>
                  <span className="perfil-rol">{nombreRol(perfil.role)}</span>
                </dd>
              </div>
            </dl>
          )}

          {/* Siempre visible, incluso si /me falló: con la sesión vencida es la salida natural */}
          <hr className="perfil-divisor" />
          <button type="button" className="perfil-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default PerfilMenu
