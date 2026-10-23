import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../config/api'
import '../styles/Admin.css'

function AdminProductos() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Error de eliminación aparte del de carga: si falla un DELETE la tabla tiene que seguir visible
  const [deleteError, setDeleteError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiFetch('/api/productos')
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

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)) return

    setDeleteError(null)
    setDeletingId(product.id)
    try {
      const response = await apiFetch(`/api/productos/${product.id}`, { method: 'DELETE' })
      if (!response.ok) {
        // Los errores llegan como texto plano; el 403 del filtro de seguridad puede venir vacío
        const mensaje = await response.text()
        setDeleteError(mensaje || `Error ${response.status} al eliminar el producto`)
        return
      }
      // 204 sin body: se saca de la lista local en vez de volver a pedir todo
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch {
      setDeleteError('No se pudo conectar con el servidor')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="admin-container">
      <h1>Administrar Productos</h1>

      <div className="admin-toolbar">
        <button className="btn-admin" onClick={() => navigate('/admin/productos/nuevo')}>
          Nuevo producto
        </button>
      </div>

      {deleteError && <p className="admin-error">{deleteError}</p>}

      {/* El wrapper permite scroll horizontal en pantallas chicas sin romper el layout */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Género</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nombre}</td>
                <td>${product.precio}</td>
                <td>{product.stock}</td>
                <td>{product.genero}</td>
                <td className="admin-actions">
                  <button
                    className="btn-admin"
                    onClick={() => navigate(`/admin/productos/${product.id}/editar`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-admin btn-admin-danger"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductos
