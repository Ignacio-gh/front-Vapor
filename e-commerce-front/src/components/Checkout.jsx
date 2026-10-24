import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/slices/cartSlice'
import { apiFetch } from '../config/api'
import defaultImage from '../assets/imgXdefault.jpg'
import '../styles/Checkout.css'

// Traduce los errores del backend a algo que el usuario entienda
const mensajeDeError = (status) => {
  if (status === 401 || status === 403) return 'Tenés que iniciar sesión para comprar.'
  if (status === 400) return 'No se pudo completar la compra: revisá el stock de los productos.'
  return 'Hubo un error al procesar la compra. Probá de nuevo.'
}

function Checkout() {
  const cartItems = useSelector((store) => store.cart.items)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orden, setOrden] = useState(null)

  const total = cartItems.reduce((sum, item) => sum + Number(item.precio), 0)

  const handleConfirmar = async () => {
    setLoading(true)
    setError(null)

    try {
      // El JWT no trae el id del usuario: lo pedimos al perfil del logueado
      const me = await apiFetch('/api/usuarios/me')
      if (!me.ok) throw new Error(mensajeDeError(me.status))
      const usuarioId = (await me.json()).id

      // El backend arma la orden con su propio carrito: le cargamos lo que hay en Redux.
      // Primero vemos qué tiene, porque si quedó un juego de un intento anterior,
      // agregarlo de nuevo le suma cantidad y se cobraría dos veces.
      const carrito = await apiFetch(`/api/carrito/${usuarioId}`)
      if (!carrito.ok) throw new Error(mensajeDeError(carrito.status))
      const yaCargados = new Set((await carrito.json()).items.map((i) => i.productoId))

      for (const item of cartItems.filter((i) => !yaCargados.has(i.id))) {
        const response = await apiFetch(`/api/carrito/${usuarioId}/items`, {
          method: 'POST',
          body: JSON.stringify({ productoId: item.id, cantidad: 1 }),
        })
        if (!response.ok) throw new Error(mensajeDeError(response.status))
      }

      // Crea la orden: descuenta stock y agrega los juegos a la biblioteca
      const response = await apiFetch(`/api/ordenes/${usuarioId}`, { method: 'POST' })
      if (!response.ok) throw new Error(mensajeDeError(response.status))

      setOrden(await response.json())
      dispatch(clearCart())
    } catch (err) {
      // fetch tira TypeError cuando no puede conectarse al backend
      setError(err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  if (orden) {
    return (
      <div className="checkout-container">
        <div className="checkout-success">
          <h1>¡Compra confirmada!</h1>
          <p>Orden #{orden.id} por ${Number(orden.total).toLocaleString('es-AR')}</p>
          <p>Tus juegos ya están en tu biblioteca.</p>
          <Link to="/biblioteca" className="btn-confirmar">
            Ir a mi biblioteca
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p className="checkout-empty">No tenés productos en el carrito.</p>
        <Link to="/products" className="link-volver">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-items">
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            <img src={item.imagenes?.[0] || defaultImage} alt={item.nombre} />
            <span className="checkout-item-nombre">{item.nombre}</span>
            <span className="checkout-item-precio">
              ${Number(item.precio).toLocaleString('es-AR')}
            </span>
          </div>
        ))}
      </div>

      <div className="checkout-total">
        <span>Total</span>
        <strong>${total.toLocaleString('es-AR')}</strong>
      </div>

      {error && <p className="checkout-error">{error}</p>}

      <button className="btn-confirmar" onClick={handleConfirmar} disabled={loading}>
        {loading ? 'Procesando...' : 'Confirmar compra'}
      </button>
    </div>
  )
}

export default Checkout
