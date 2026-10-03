import { useParams, Link } from 'react-router-dom'
import products from '../data/products.json'
import '../styles/Products.css'

const generos = [...new Set(products.map((p) => p.genero))]

function Categoria() {
  const { genero } = useParams()
  const filtrados = products.filter((p) => p.genero === genero)

  return (
    <div className="products-container">
      <h1>Categoría: {genero}</h1>
      <nav>
        {generos.map((g) => (
          <Link key={g} to={`/categoria/${g}`} className="btn-details">
            {g}
          </Link>
        ))}
      </nav>

      {filtrados.length === 0 ? (
        <p>No hay juegos en esta categoría.</p>
      ) : (
        <div className="products-grid">
          {filtrados.map((product) => (
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
      )}
    </div>
  )
}

export default Categoria
