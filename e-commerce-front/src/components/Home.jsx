import { Link } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>¡Bienvenido a Nuestro E-Commerce!</h1>
        <p>Descubre los mejores productos con React Router</p>
        {/* mala práctica trae todos los componentes, con sus js, css, y carga toda la página de vuelta */}
        <a href="https://example.com" className="cta-button">
          ejemplo
        </a>
        {/* solo carga el componente central */}
        <Link to="/products" className="cta-button">
          Ver Productos
        </Link>
        <Link to="/about" className="cta-button">
          Conócenos
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🛍️ Productos Variados</h3>
          <p>Encuentra todo lo que necesitas en un solo lugar</p>
        </div>
        <div className="feature-card">
          <h3>🚚 Envío Rápido</h3>
          <p>Entrega segura y rápida a tu hogar</p>
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
