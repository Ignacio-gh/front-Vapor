import { Link } from 'react-router-dom'
import products from '../data/products.json'
import '../styles/Products.css'

function Products() {
  return (
    <div className="products-container">
      <h1>Nuestros Productos</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.imagen} alt={product.titulo} />
            </div>
            <div className="product-info">
              <h3>{product.titulo}</h3>
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
