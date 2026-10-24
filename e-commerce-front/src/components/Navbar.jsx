import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { openCart } from '../store/slices/cartSlice'
import '../styles/Navbar.css'
import vaporLogo from '../assets/vapor-logo.svg'
import { isAuthenticated, getEmail, removeToken, getRoles } from '../utils/auth'
import PerfilMenu from './PerfilMenu'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = useSelector((store) => store.cart.items.length)
  const dispatch = useDispatch()

  const isActive = (path) => location.pathname === path
  const logueado = isAuthenticated()
  // Mismos roles que la ruta /admin/productos (RutaPorRol en App.jsx): si no coinciden,
  // el link lleva a una pantalla que redirige al 404
  const puedeAdministrar = getRoles().some((r) => ['ROLE_ADMIN', 'ROLE_VENDEDOR'].includes(r))

  const handleLogout = () => {
    removeToken()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={vaporLogo} alt="" className="navbar-logo" />
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products') ? 'nav-link active' : 'nav-link'}>
              Productos
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'nav-link active' : 'nav-link'}>
              Acerca de
            </Link>
          </li>
          <li>
            <Link to="/biblioteca" className={isActive('/biblioteca') ? 'nav-link active' : 'nav-link'}>
              Biblioteca
            </Link>
          </li>
          {puedeAdministrar && (
            <li>
              <Link to="/admin/productos" className={isActive('/admin/productos') ? 'nav-link active' : 'nav-link'}>
                Admin
              </Link>
            </li>
          )}
          {logueado ? (
            <>
              <li className="nav-user"><PerfilMenu email={getEmail()} onLogout={handleLogout} /></li>
            </>
          ) : (
            <li>
              <Link to="/login" className={isActive('/login') ? 'nav-link active' : 'nav-link'}>
                Iniciar Sesión
              </Link>
            </li>
          )}
          <li>
            <button
              className="cart-button"
              onClick={() => dispatch(openCart())}
              aria-label={`Abrir carrito (${cartCount} productos)`}
            >
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
