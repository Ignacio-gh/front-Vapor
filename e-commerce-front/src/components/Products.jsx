import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config/api'
import '../styles/Products.css'

const PLACEHOLDER = 'https://placehold.co/300x200?text=Sin+imagen'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/productos`)
        if (!response.ok) throw new Error('Error al cargar los productos')
        setProducts(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="products-container">
      <h1>Productos</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img
                src={product.imagenes?.[0] ?? PLACEHOLDER}
                alt={product.nombre}
                onError={(e) => {
                  e.currentTarget.onerror = null // evita un bucle si el placeholder también falla
                  e.currentTarget.src = PLACEHOLDER
                }}
              />
            </div>
            <div className="product-info">
              <h3>{product.nombre}</h3>
              <p className="price">${product.precio}</p>
              <Link to={`/products/${product.id}`} className="btn-details">
                Ver Detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products