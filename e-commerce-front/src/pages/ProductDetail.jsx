import { useParams, Link } from 'react-router-dom'
import '../styles/ProductDetail.css'

function ProductDetail() {
  const { id } = useParams()

  const products = {
    1: { name: 'Laptop Pro', price: 999.99, description: 'Laptop de última generación con procesador Intel i9' },
    2: { name: 'Mouse Inalámbrico', price: 29.99, description: 'Mouse inalámbrico ergonómico con batería duradera' },
    3: { name: 'Teclado Mecánico', price: 89.99, description: 'Teclado mecánico RGB con switches personalizables' },
    4: { name: 'Monitor 4K', price: 399.99, description: 'Monitor UltraHD de 32 pulgadas' },
    5: { name: 'Auriculares', price: 149.99, description: 'Auriculares inalámbricos con cancelación de ruido' },
    6: { name: 'Webcam HD', price: 59.99, description: 'Cámara web 1080p con micrófono integrado' },
  }

  const product = products[id]

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
          <img src={`https://via.placeholder.com/400?text=${product.name}`} alt={product.name} />
        </div>
        <div className="product-description">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <p className="price">${product.price}</p>
          <button className="btn-add-cart">Agregar al Carrito</button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
