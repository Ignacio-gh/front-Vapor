import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FavoriteButton from './FavoriteButton'
import defaultImage from '../assets/imgXdefault.jpg'
import '../styles/FavoritosLista.css'

// Sección "Mis favoritos" para incluir dentro de Biblioteca
function FavoritosLista() {
  const { items, status, error } = useSelector((state) => state.favoritos)

  return (
    <section className="favoritos">
      <h2>Mis favoritos</h2>

      {status === 'failed' && <p className="favoritos-msg">{error}</p>}

      {status === 'loading' && items.length === 0 && (
        <p className="favoritos-msg">Cargando favoritos…</p>
      )}

      {status !== 'loading' && status !== 'failed' && items.length === 0 && (
        <p className="favoritos-msg">
          Todavía no tenés favoritos. Tocá el corazón de un producto para guardarlo acá.
        </p>
      )}

      <div className="favoritos-grid">
        {items.map((producto) => (
          <div key={producto.id} className="favorito-card">
            <FavoriteButton product={producto} />
            <Link to={`/products/${producto.id}`} className="favorito-link">
              <img
                className="favorito-image"
                src={producto.imagenes?.[0] || defaultImage}
                alt={producto.nombre}
              />
              <div className="favorito-info">
                <h3>{producto.nombre}</h3>
                <p className="favorito-price">
                  ${Number(producto.precio).toLocaleString('es-AR')}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FavoritosLista
