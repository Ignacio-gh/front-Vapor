import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { API_URL } from '../config/api'
import { normalizar } from '../utils/texto'
import { setBusqueda, setGenero, limpiarFiltros } from '../store/slices/catalogoSlice'
import ProductCarousel from './ProductCarousel'
import '../styles/Products.css'

function Products() {
  const dispatch = useDispatch()
  const { busqueda, genero } = useSelector((store) => store.catalogo)

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

  // Los géneros salen de los productos cargados, así el filtro nunca ofrece uno vacío
  const generos = useMemo(
    () => [...new Set(products.map((p) => p.genero ?? 'Otros'))],
    [products]
  )

  // Un carrusel por género, en el orden en que aparece cada uno por primera vez.
  // Se filtra en el cliente sobre la lista ya cargada, igual que en el panel de Admin.
  const porGenero = useMemo(() => {
    const termino = normalizar(busqueda.trim())
    return products
      .filter((p) => !termino || normalizar(p.nombre).includes(termino))
      .filter((p) => !genero || (p.genero ?? 'Otros') === genero)
      .reduce((acc, product) => {
        const g = product.genero ?? 'Otros'
        if (!acc[g]) acc[g] = []
        acc[g].push(product)
        return acc
      }, {})
  }, [products, busqueda, genero])

  if (loading) return <p>Cargando productos...</p>
  if (error) return <p>{error}</p>

  const hayFiltros = busqueda.trim() !== '' || genero !== null

  return (
    <div className="products-container">
      <h1>Productos</h1>

      <div className="catalogo-filtros">
        <input
          type="search"
          className="catalogo-busqueda"
          placeholder="Buscar por nombre"
          aria-label="Buscar por nombre"
          value={busqueda}
          onChange={(e) => dispatch(setBusqueda(e.target.value))}
        />

        <div className="catalogo-chips" role="group" aria-label="Filtrar por categoría">
          <button
            className="chip"
            aria-pressed={genero === null}
            onClick={() => dispatch(setGenero(null))}
          >
            Todos
          </button>
          {generos.map((g) => (
            <button
              key={g}
              className="chip"
              aria-pressed={genero === g}
              onClick={() => dispatch(setGenero(g))}
            >
              {g}
            </button>
          ))}
        </div>

        {hayFiltros && (
          <button className="chip chip-limpiar" onClick={() => dispatch(limpiarFiltros())}>
            Limpiar filtros
          </button>
        )}
      </div>

      {Object.keys(porGenero).length === 0 && <p>No se encontraron juegos.</p>}

      {Object.entries(porGenero).map(([g, items]) => (
        <ProductCarousel key={g} title={g} items={items} />
      ))}
    </div>
  )
}

export default Products
