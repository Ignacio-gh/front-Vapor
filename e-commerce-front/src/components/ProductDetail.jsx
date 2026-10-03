import { useParams, Link } from 'react-router-dom'
import products from '../data/products.json'
import '../styles/ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()

  const product = products.find((p) => p.id === Number(id))

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
          <img src={product.imagen} alt={product.titulo} />
        </div>
        <div className="product-description">
          <h1>{product.titulo}</h1>
          <Link to={`/categoria/${product.genero}`}>{product.genero}</Link>
          <p className="description">{product.descripcion}</p>
          <p className="price">${product.precio}</p>
          <Link to="/cart" className="btn-back">
            <button className="btn-add-cart">Agregar al Carrito</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
