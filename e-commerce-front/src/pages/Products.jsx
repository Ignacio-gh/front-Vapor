import { Link } from 'react-router-dom'
import '../styles/Products.css'

function Products() {
  const products = [
    { id: 1, name: 'Laptop Pro', price: 999.99 },
    { id: 2, name: 'Mouse Inalámbrico', price: 29.99 },
    { id: 3, name: 'Teclado Mecánico', price: 89.99 },
    { id: 4, name: 'Monitor 4K', price: 399.99 },
    { id: 5, name: 'Auriculares', price: 149.99 },
    { id: 6, name: 'Webcam HD', price: 59.99 },
  ]

  return (
    <div className="products-container">
      <h1>Nuestros Productos</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={`https://via.placeholder.com/200?text=${product.name}`} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
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
