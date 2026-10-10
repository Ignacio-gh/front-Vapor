import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_URL, PLACEHOLDER_IMG } from '../config/api'
import '../styles/Products.css'

function Categoria() {
  const { genero } = useParams()

  const [generos, setGeneros] = useState([])
  const [errorGeneros, setErrorGeneros] = useState(null)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Géneros para el nav: no dependen de la categoría actual, se piden una sola vez
  useEffect(() => {
    let ignore = false

    const fetchGeneros = async () => {
      try {
        const response = await fetch(`${API_URL}/api/productos/generos`)
        if (!response.ok) throw new Error('Error al cargar los géneros')
        const data = await response.json()
        if (!ignore) setGeneros(data)
      } catch (err) {
        if (!ignore) setErrorGeneros(err.message)
      }
    }

    fetchGeneros()
    return () => {
      ignore = true
    }
  }, [])

  // Productos: se vuelve a pedir cada vez que cambia el género de la URL
  useEffect(() => {
    let ignore = false

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_URL}/api/productos?genero=${encodeURIComponent(genero)}`
        )
        if (!response.ok) throw new Error('Error al cargar los productos')
        const data = await response.json()
        if (!ignore) setProducts(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProducts()
    return () => {
      ignore = true
    }
  }, [genero])

  return (
    <div className="products-container">
      <h1>Categoría: {genero}</h1>

      <nav>
        {errorGeneros && <span>{errorGeneros}</span>}
        {generos.map((g) => (
          <Link key={g} to={`/categoria/${g}`} className="btn-details">
            {g}
          </Link>
        ))}
      </nav>

      {loading && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No hay juegos en esta categoría.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
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
      )}
    </div>
  )
}

export default Categoria