import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

// Pasa la respuesta del backend al shape del formulario: los inputs
// controlados necesitan strings (nunca null) para no volverse no controlados
function productoAForm(product) {
  return {
    nombre: product.nombre ?? '',
    descripcion: product.descripcion ?? '',
    precio: product.precio != null ? String(product.precio) : '',
    stock: product.stock != null ? String(product.stock) : '',
    genero: product.genero ?? '',
    tipo: product.tipo ?? 'BASE',
    imagen: product.imagenes?.[0] ?? '',
  }
}

// type="url" del navegador acepta cualquier esquema (ftp:, javascript:, ...);
// acá solo sirven imágenes que se puedan cargar en un <img>
function esUrlHttp(valor) {
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// La validación nativa (required, min, step) no detecta valores con solo
// espacios, así que se repite el chequeo sobre los valores ya recortados.
// Devuelve un objeto { campo: mensaje } vacío si está todo bien.
function validar(datos) {
  const errores = {}

  if (!datos.nombre) errores.nombre = 'El nombre es obligatorio'
  if (!datos.descripcion) errores.descripcion = 'La descripción es obligatoria'

  const precio = Number(datos.precio)
  if (!datos.precio) {
    errores.precio = 'El precio es obligatorio'
  } else if (!Number.isFinite(precio) || precio <= 0) {
    errores.precio = 'El precio tiene que ser mayor a 0'
  }

  const stock = Number(datos.stock)
  if (!datos.stock) {
    errores.stock = 'El stock es obligatorio'
  } else if (!Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock tiene que ser un número entero mayor o igual a 0'
  }

  if (!datos.genero) errores.genero = 'El género es obligatorio'
  if (!TIPOS.includes(datos.tipo)) errores.tipo = 'Elegí un tipo válido'

  if (!datos.imagen) {
    errores.imagen = 'La URL de la imagen es obligatoria'
  } else if (!esUrlHttp(datos.imagen)) {
    errores.imagen = 'Ingresá una URL válida que empiece con http:// o https://'
  }

  return errores
}

// Se usa para alta (/admin/productos/nuevo) y edición (/admin/productos/:id/editar):
// si la URL trae id, precarga el producto y guarda con PUT en vez de POST
function ProductoForm() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_VACIO)
  const [fieldErrors, setFieldErrors] = useState({})
  const [generos, setGeneros] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(esEdicion)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!esEdicion) return

    let ignore = false // descarta respuestas viejas si el id cambia antes de que lleguen

    const fetchProduct = async () => {
      try {
        const response = await apiFetch(`/api/productos/${id}`)
        if (response.status === 404) {
          if (!ignore) setNotFound(true)
          return
        }
        if (!response.ok) throw new Error('Error al cargar el producto')
        const data = await response.json()
        if (!ignore) setForm(productoAForm(data))
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchProduct()
    return () => {
      ignore = true
    }
  }, [id, esEdicion])

  // Los géneros existentes solo alimentan las sugerencias del <datalist>:
  // si el pedido falla se ignora y el input queda como texto libre
  useEffect(() => {
    let ignore = false

    const fetchGeneros = async () => {
      try {
        const response = await apiFetch('/api/productos/generos')
        if (!response.ok) return
        const data = await response.json()
        if (!ignore && Array.isArray(data)) setGeneros(data)
      } catch {
        // sin sugerencias, no es un error para el usuario
      }
    }

    fetchGeneros()
    return () => {
      ignore = true
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    // Se borra el error del campo apenas se corrige, sin esperar al próximo submit
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: undefined })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    // Se recorta todo una sola vez: lo mismo que se valida es lo que se envía
    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: form.precio.trim(),
      stock: form.stock.trim(),
      genero: form.genero.trim(),
      tipo: form.tipo,
      imagen: form.imagen.trim(),
    }

    const errores = validar(datos)
    setFieldErrors(errores)
    if (Object.keys(errores).length > 0) return

    setSaving(true)

    // Los inputs devuelven strings; el DTO espera números en precio y stock
    // y una lista de URLs en imagenes
    const body = {
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      genero: datos.genero,
      tipo: datos.tipo,
      imagenes: [datos.imagen],
    }

    try {
      const response = await apiFetch(esEdicion ? `/api/productos/${id}` : '/api/productos', {
        method: esEdicion ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })

      // POST responde 201 y PUT 200
      if (response.ok) {
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

  // Props comunes para enlazar cada input con su mensaje de error (accesibilidad)
  const errorProps = (campo) =>
    fieldErrors[campo]
      ? { 'aria-invalid': true, 'aria-describedby': `${campo}-error` }
      : {}

  const mensajeError = (campo) =>
    fieldErrors[campo] && (
      <p id={`${campo}-error`} className="field-error">
        {fieldErrors[campo]}
      </p>
    )

  if (loading) return <p>Cargando producto...</p>

  if (notFound) {
    return (
      <div className="admin-container">
        <h1>Producto no encontrado</h1>
        <div className="admin-form-actions">
          <button className="btn-admin" onClick={() => navigate('/admin/productos')}>
            Volver a Administrar Productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <h1>{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <p className="admin-error">{error}</p>}

        <p className="form-hint">Los campos marcados con * son obligatorios.</p>

        <div className="form-row">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            {...errorProps('nombre')}
          />
          {mensajeError('nombre')}
        </div>

        <div className="form-row">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="4"
            value={form.descripcion}
            onChange={handleChange}
            required
            {...errorProps('descripcion')}
          />
          {mensajeError('descripcion')}
        </div>

        <div className="form-row">
          <label htmlFor="precio">Precio *</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0.01"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            required
            {...errorProps('precio')}
          />
          {mensajeError('precio')}
        </div>

        <div className="form-row">
          <label htmlFor="stock">Stock *</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
            {...errorProps('stock')}
          />
          {mensajeError('stock')}
        </div>

        <div className="form-row">
          <label htmlFor="genero">Género *</label>
          <input
            id="genero"
            name="genero"
            list="generos-sugeridos"
            value={form.genero}
            onChange={handleChange}
            required
            {...errorProps('genero')}
          />
          {/* Sugiere los géneros existentes pero deja escribir uno nuevo */}
          <datalist id="generos-sugeridos">
            {generos.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
          {mensajeError('genero')}
        </div>

        <div className="form-row">
          <label htmlFor="tipo">Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            {...errorProps('tipo')}
          >
            {TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {mensajeError('tipo')}
        </div>

        <div className="form-row">
          <label htmlFor="imagen">URL de la imagen *</label>
          <input
            id="imagen"
            name="imagen"
            type="url"
            placeholder="https://..."
            value={form.imagen}
            onChange={handleChange}
            required
            {...errorProps('imagen')}
          />
          {mensajeError('imagen')}
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
