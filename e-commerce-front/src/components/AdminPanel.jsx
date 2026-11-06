import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config/api'
import '../styles/Admin.css'

// Inicio del panel de administración (/admin): métricas del catálogo y accesos a cada sección.
// Las métricas se calculan en el cliente con GET /api/productos, que es público.
function AdminPanel() {
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

  const stats = useMemo(() => {
    const porGenero = {}
    products.forEach((p) => {
      const genero = p.genero ?? 'Otros'
      porGenero[genero] = (porGenero[genero] ?? 0) + 1
    })

    return {
      total: products.length,
      // BASE es el juego; todo lo demás (DLC, expansión, edición especial) es contenido adicional
      juegos: products.filter((p) => p.tipo === 'BASE').length,
      adicionales: products.filter((p) => p.tipo !== 'BASE').length,
      // de más a menos productos
      porGenero: Object.entries(porGenero).sort((a, b) => b[1] - a[1]),
    }
  }, [products])

  return (
    <div className="admin-container">
      <h1>Panel de administración</h1>

      <div className="admin-cards">
        <Link to="/admin/productos" className="admin-card">
          <h2>Administrar productos</h2>
          <p>Ver, buscar, editar y eliminar los juegos publicados.</p>
        </Link>
        <Link to="/admin/productos/nuevo" className="admin-card">
          <h2>Nuevo producto</h2>
          <p>Publicar un juego, DLC, expansión o edición especial.</p>
        </Link>
        <Link to="/products" className="admin-card">
          <h2>Ver catálogo</h2>
          <p>Cómo ven la tienda los clientes.</p>
        </Link>
      </div>

      {loading && <p>Cargando métricas...</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat-value">{stats.total}</span>
              <span className="admin-stat-label">Productos publicados</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{stats.juegos}</span>
              <span className="admin-stat-label">Juegos base</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{stats.adicionales}</span>
              <span className="admin-stat-label">DLC, expansiones y ediciones especiales</span>
            </div>
          </div>

          <h2 className="admin-subtitle">Productos por género</h2>
          {stats.porGenero.length === 0 ? (
            <p className="admin-count">Todavía no hay productos publicados.</p>
          ) : (
            <ul className="admin-genres">
              {stats.porGenero.map(([genero, cantidad]) => (
                <li key={genero}>
                  <span>{genero}</span>
                  <strong>{cantidad}</strong>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default AdminPanel
