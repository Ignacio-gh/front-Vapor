import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../config/api'
import '../styles/Admin.css'

// Pasa a minúsculas y quita tildes para que "accion" encuentre "Acción":
// NFD separa la letra de su diacrítico y el rango ̀-ͯ son esos diacríticos
function normalizar(texto) {
  return (texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Cada opción del select apunta a su comparador; así agregar un orden nuevo es una línea
const ORDENES = {
  'nombre-asc': { label: 'Nombre (A-Z)', comparar: (a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? '', 'es') },
  'nombre-desc': { label: 'Nombre (Z-A)', comparar: (a, b) => (b.nombre ?? '').localeCompare(a.nombre ?? '', 'es') },
  'precio-asc': { label: 'Precio (menor a mayor)', comparar: (a, b) => a.precio - b.precio },
  'precio-desc': { label: 'Precio (mayor a menor)', comparar: (a, b) => b.precio - a.precio },
  'stock-asc': { label: 'Stock (menor a mayor)', comparar: (a, b) => a.stock - b.stock },
  'stock-desc': { label: 'Stock (mayor a menor)', comparar: (a, b) => b.stock - a.stock },
  id: { label: 'ID', comparar: (a, b) => a.id - b.id },
}

function AdminProductos() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Error de eliminación aparte del de carga: si falla un DELETE la tabla tiene que seguir visible
  const [deleteError, setDeleteError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('id')

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

  // Filtro y orden en el cliente sobre la lista ya cargada. Se deriva de `products`,
  // así que si se elimina un producto desaparece también de la vista filtrada.
  // sort sobre una copia: ordenar `products` en el lugar mutaría el estado.
  const productosVisibles = useMemo(() => {
    const termino = normalizar(busqueda.trim())
    const filtrados = termino
      ? products.filter((p) => normalizar(p.nombre).includes(termino))
      : products
    return [...filtrados].sort(ORDENES[orden].comparar)
  }, [products, busqueda, orden])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="admin-container">
      <h1>Administrar Productos</h1>

      <div className="admin-toolbar">
        <div className="admin-filters">
          <div className="admin-filter">
            <label htmlFor="busqueda">Buscar por nombre</label>
            <input
              id="busqueda"
              type="search"
              placeholder="Ej: zelda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="admin-filter">
            <label htmlFor="orden">Ordenar por</label>
            <select id="orden" value={orden} onChange={(e) => setOrden(e.target.value)}>
              {Object.entries(ORDENES).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn-admin" onClick={() => navigate('/admin/productos/nuevo')}>
          Nuevo producto
        </button>
      </div>

      <p className="admin-count">
        Mostrando {productosVisibles.length} de {products.length} productos
      </p>

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
            {productosVisibles.length === 0 && (
              <tr>
                <td colSpan="6" className="admin-empty">
                  No se encontraron productos
                </td>
              </tr>
            )}
            {productosVisibles.map((product) => (
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
