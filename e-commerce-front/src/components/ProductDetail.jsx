import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { API_URL, PLACEHOLDER_IMG } from '../config/api'
import '../styles/ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  useEffect(() => {
    let ignore = false // descarta respuestas viejas si el id cambia antes de que lleguen

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/productos/${id}`)
        // El backend responde 404 cuando no existe: no es un error de red,
        // así que fetch no lo rechaza y hay que chequearlo a mano.
        if (response.status === 404) {
          if (!ignore) setProduct(null)
          return
        }
        if (!response.ok) throw new Error('Error al cargar el producto')
        const data = await response.json()
        if (!ignore) setProduct(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProduct()
    return () => {
      ignore = true
    }
  }, [id]) // se vuelve a pedir cada vez que cambia el id de la URL

  if (loading) return <p>Cargando producto...</p>
  if (error) return <p>{error}</p>

  if (!product) {
    return (
      <div className="product-detail-container">
        <h1>Producto no encontrado</h1>
        <Link to="/products" className="btn-back">
          Volver a Productos
        </Link>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="btn-back">
        ← Volver a Productos
      </Link>
      <div className="product-detail">
        <div className="product-image">
          <img
            src={product.imagenes?.[0] ?? PLACEHOLDER_IMG}
            alt={product.nombre}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = PLACEHOLDER_IMG
            }}
          />
        </div>
        <div className="product-description">
          <h1>{product.nombre}</h1>
          <Link to={`/categoria/${product.genero}`}>{product.genero}</Link>
          <p className="description">{product.descripcion}</p>
          <p className="price">${product.precio}</p>
          <button className="btn-add-cart" onClick={handleAddToCart}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail