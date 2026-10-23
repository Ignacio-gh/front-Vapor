import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, PLACEHOLDER_IMG } from '../config/api'
import '../styles/Products.css'

// Juegos que compró el usuario: el backend los agrega al confirmar una orden
function Biblioteca() {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBiblioteca = async () => {
      try {
        // El login guarda el JWT y el id del usuario en localStorage
        const usuarioId = localStorage.getItem('usuarioId')
        if (!usuarioId) throw new Error('Iniciá sesión para ver tu biblioteca.')

        const response = await fetch(`${API_URL}/api/usuarios/${usuarioId}/biblioteca`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (response.status === 401 || response.status === 403) {
          throw new Error('Iniciá sesión para ver tu biblioteca.')
        }
        if (!response.ok) throw new Error('Error al cargar la biblioteca')
        setJuegos(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBiblioteca()
  }, [])

  if (loading) return <p>Cargando biblioteca...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="products-container">
      <h1>Mi Biblioteca</h1>
      {juegos.length === 0 ? (
        <p>
          Todavía no tenés juegos. <Link to="/products">Ver productos</Link>
        </p>
      ) : (
        <div className="products-grid">
          {juegos.map((juego) => (
            <div key={juego.id} className="product-card">
              <div className="product-image">
                <img src={juego.imagenes?.[0] ?? PLACEHOLDER_IMG} alt={juego.nombre} />
              </div>
              <div className="product-info">
                <h3>{juego.nombre}</h3>
                <Link to={`/products/${juego.id}`} className="btn-details">
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

export default Biblioteca
