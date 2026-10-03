import { Link } from 'react-router-dom'
import products from '../data/products.json'
import '../styles/Products.css'

// ponytail: mock con products.json; pasar a GET /api/usuarios/{id}/biblioteca
// cuando el login devuelva el id del usuario
function Biblioteca() {
  return (
    <div className="products-container">
      <h1>Mi Biblioteca</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.imagen} alt={product.titulo} />
            </div>
            <div className="product-info">
              <h3>{product.titulo}</h3>
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

export default Biblioteca
