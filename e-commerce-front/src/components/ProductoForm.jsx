import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../config/api'
import '../styles/Admin.css'

// Valores del enum TipoProducto del backend: si no coinciden exacto, Spring
// no puede deserializar el body y responde 400
const TIPOS = ['BASE', 'DLC', 'EXPANSION_PACK', 'EDICION_ESPECIAL']

const FORM_VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  genero: '',
  tipo: 'BASE',
  imagen: '',
}

function ProductoForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_VACIO)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSaving(true)

    // Los inputs devuelven strings; el DTO espera números en precio y stock
    // y una lista de URLs en imagenes
    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      stock: Number(form.stock),
      genero: form.genero,
      tipo: form.tipo,
      imagenes: form.imagen ? [form.imagen] : [],
    }

    try {
      const response = await apiFetch('/api/productos', {
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (response.status === 201) {
        navigate('/admin/productos')
        return
      }

      // El backend manda los errores como texto plano (precio/stock negativo, sin permiso).
      // Si el rechazo viene del filtro de seguridad el body puede llegar vacío.
      const mensaje = await response.text()
      setError(mensaje || `Error ${response.status} al guardar el producto`)
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-container">
      <h1>Nuevo producto</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <p className="admin-error">{error}</p>}

        <div className="form-row">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="4"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="genero">Género</label>
          <input id="genero" name="genero" value={form.genero} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="imagen">URL de la imagen</label>
          <input id="imagen" name="imagen" type="url" value={form.imagen} onChange={handleChange} />
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="btn-admin btn-admin-secondary"
            onClick={() => navigate('/admin/productos')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-admin" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductoForm
