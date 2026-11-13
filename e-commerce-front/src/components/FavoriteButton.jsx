import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addFavorito, removeFavorito } from '../store/slices/favoritosSlice'
import '../styles/FavoriteButton.css'

// Corazón para la esquina de una tarjeta de producto.
// El contenedor padre tiene que tener position: relative.
function FavoriteButton({ product }) {
  const dispatch = useDispatch()
  const usuario = useSelector((state) => state.auth.usuario)
  const navigate = useNavigate()
  const location = useLocation()

  const esFavorito = useSelector((state) =>
    state.favoritos.items.some((item) => item.id === product.id)
  )

  const handleClick = (e) => {
    // Si la tarjeta está envuelta en un <Link>, evita que el click navegue al detalle
    e.preventDefault()
    e.stopPropagation()

    if (!usuario) {
      navigate('/login', { state: { from: location } })
      return
    }
    dispatch(esFavorito ? removeFavorito(product) : addFavorito(product))
  }

  return (
    <button
      type="button"
      className={esFavorito ? 'favorite-button active' : 'favorite-button'}
      onClick={handleClick}
      aria-pressed={esFavorito}
      aria-label={
        esFavorito
          ? `Quitar ${product.nombre} de favoritos`
          : `Agregar ${product.nombre} a favoritos`
      }
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
