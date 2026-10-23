import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, clearCart } from '../store/slices/cartSlice'
import defaultImage from '../assets/imgXdefault.jpg'
import '../styles/Cart.css'

function Cart() {
  const cartItems = useSelector((store) => store.cart.items)
  const dispatch = useDispatch()

  const total = cartItems.reduce((sum, item) => sum + item.precio, 0)

  return (
    <div className="cart-container">
      <h1>Carrito de compras</h1>

      {cartItems.length > 0 && (
        <p className="cart-count">
          Tenés {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en el carrito
        </p>
      )}

      {cartItems.length === 0 ? (
        <p className="cart-empty">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  className="cart-item-image"
                  src={item.imagen || defaultImage}
                  alt={item.titulo}
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.titulo}</h3>
                  <p className="cart-item-price">
                    ${item.precio.toLocaleString('es-AR')}
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

          <div className="cart-total">
            <h3>Total: ${total.toLocaleString('es-AR')}</h3>
            <button className="btn-clear" onClick={() => dispatch(clearCart())}>
              Vaciar carrito
            </button>
          </div>
        </>
      )}

      <div className="cart-links">
        <Link to="/products" className="link-continue">
          Seguir comprando
        </Link>
        {cartItems.length > 0 && (
          <Link to="/checkout" className="link-checkout">
            Pagar
          </Link>
        )}
      </div>
    </div>
  )
}

export default Cart
