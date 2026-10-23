import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, clearCart, closeCart } from '../store/slices/cartSlice'
import defaultImage from '../assets/imgXdefault.jpg'
import '../styles/Carrito.css'

// Carrito lateral: se renderiza en App, así está disponible en todas las páginas.
function Carrito() {
  const cartItems = useSelector((store) => store.cart.items)
  const isOpen = useSelector((store) => store.cart.isOpen)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // pop-up que pide iniciar sesión antes de pagar
  const [showLogin, setShowLogin] = useState(false)

  const total = cartItems.reduce((sum, item) => sum + Number(item.precio), 0)

  const close = () => dispatch(closeCart())

  const handlePagar = () => {
    // El login guarda el JWT y el id del usuario en localStorage;
    // el checkout necesita los dos para crear la orden
    if (!localStorage.getItem('token') || !localStorage.getItem('usuarioId')) {
      setShowLogin(true)
      return
    }
    close()
    navigate('/checkout')
  }

  const irAlLogin = () => {
    setShowLogin(false)
    close()
    // Login usa state.from para volver al checkout después de iniciar sesión
    navigate('/login', { state: { from: { pathname: '/checkout' } } })
  }

  // Esc cierra primero el pop-up y después el drawer;
  // mientras está abierto la página de atrás no scrollea
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return
      if (showLogin) setShowLogin(false)
      else dispatch(closeCart())
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, showLogin, dispatch])

  return (
    <>
      <div className={isOpen ? 'cart-overlay open' : 'cart-overlay'} onClick={close} />

      {/* inert evita que se pueda tabular dentro del panel cuando está cerrado */}
      <aside
        className={isOpen ? 'cart-drawer open' : 'cart-drawer'}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        inert={!isOpen}
      >
        <div className="cart-drawer-header">
          <h2>Carrito</h2>
          <button className="btn-close" onClick={close} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío</p>
            <Link to="/products" className="link-continue" onClick={close}>
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            <p className="cart-count">
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
            </p>

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    className="cart-item-image"
                    src={item.imagenes?.[0] || defaultImage}
                    alt={item.nombre}
                  />
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.nombre}</h3>
                    <p className="cart-item-price">
                      ${Number(item.precio).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>${total.toLocaleString('es-AR')}</strong>
              </div>
              <div className="cart-actions">
                <button className="btn-clear" onClick={() => dispatch(clearCart())}>
                  Vaciar
                </button>
                <button className="link-checkout" onClick={handlePagar}>
                  Pagar
                </button>
              </div>
            </div>
          </>
        )}
      </aside>

      {showLogin && (
        <div className="login-modal-overlay" onClick={() => setShowLogin(false)}>
          <div
            className="login-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="login-modal-title">Iniciá sesión para pagar</h3>
            <p>Necesitás una cuenta para completar la compra. Tu carrito se mantiene.</p>
            <div className="login-modal-actions">
              <button className="btn-clear" onClick={() => setShowLogin(false)}>
                Cancelar
              </button>
              <button className="link-checkout" onClick={irAlLogin} autoFocus>
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Carrito
