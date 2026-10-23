import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { PLACEHOLDER_IMG } from '../config/api'
import './ProductCarousel.css'

const TIPO_LABELS = {
  DLC: 'DLC',
  EXPANSION_PACK: 'Expansión',
  EDICION_ESPECIAL: 'Edición especial',
}

function ProductCard({ product }) {
  const badge = TIPO_LABELS[product.tipo]

  return (
    <Link to={`/products/${product.id}`} className="carousel-card">
      <div className="carousel-card__image">
        <img
          src={product.imagenes?.[0] ?? PLACEHOLDER_IMG}
          alt={product.nombre}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = PLACEHOLDER_IMG
          }}
        />
        {badge && <span className="carousel-card__badge">{badge}</span>}
      </div>
      <div className="carousel-card__info">
        <h3>{product.nombre}</h3>
        <p className="carousel-card__price">${product.precio}</p>
      </div>
    </Link>
  )
}

function ProductCarousel({ title, items }) {
  const trackRef = useRef(null)

  const scrollByAmount = (amount) => {
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if (!items || items.length === 0) return null

  return (
    <section className="product-carousel">
      <div className="product-carousel__header">
        <h2>{title}</h2>
        <div className="product-carousel__nav">
          <button
            type="button"
            aria-label="Desplazar a la izquierda"
            onClick={() => scrollByAmount(-280)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Desplazar a la derecha"
            onClick={() => scrollByAmount(280)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="product-carousel__track" ref={trackRef}>
        {items.map((product) => (
          <div className="product-carousel__item" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductCarousel
