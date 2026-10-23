import { useState, useEffect } from 'react'
import { API_URL } from '../config/api'
import ProductCarousel from './ProductCarousel'
import '../styles/Products.css'

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

  // Un carrusel por género, en el orden en que aparece cada uno por primera vez.
  const porGenero = products.reduce((acc, product) => {
    const genero = product.genero ?? 'Otros'
    if (!acc[genero]) acc[genero] = []
    acc[genero].push(product)
    return acc
  }, {})

  return (
    <div className="products-container">
      <h1>Productos</h1>
      {Object.entries(porGenero).map(([genero, items]) => (
        <ProductCarousel key={genero} title={genero} items={items} />
      ))}
    </div>
  )
}

export default Products