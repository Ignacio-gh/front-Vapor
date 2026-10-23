import { Link } from 'react-router-dom'
import TiltedGridHero from './TiltedGridHero'
import products from '../data/products.json'
import '../styles/Home.css'

// Portadas de los juegos destacados para el carrusel curvo del hero.
const heroImages = products.map((producto) => ({
  src: producto.imagen,
  alt: producto.titulo,
}))

function Home() {
  return (
    <div className="home-container">
      <section className="hero-destacados">
        <TiltedGridHero
          images={heroImages}
          curve={75}
          className="hero-destacados__band"
        >
          <div className="hero-destacados__content">
            <h1>Juegos Destacados</h1>
            <p>Descubre los títulos más jugados de la tienda Vapor</p>
            <div className="hero-destacados__actions">
              <Link to="/products" className="cta-button">
                Ver Productos
              </Link>
              <Link to="/about" className="cta-button">
                Conócenos
              </Link>
            </div>
          </div>
        </TiltedGridHero>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🛍️ Productos Variados</h3>
          <p>Encuentra todo lo que necesitas en un solo lugar</p>
        </div>
        <div className="feature-card">
          <h3>💰 Mejores Precios</h3>
          <p>Obtén los mejores descuentos del mercado</p>
        </div>
      </section>
    </div>
  )
}

export default Home
