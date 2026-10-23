import '../styles/About.css'

function About() {
  return (
    <div className="about-container">
      <h1>Acerca de Vapor</h1>
      <section className="about-content">
        <p>
          Vapor es una tienda digital de videojuegos pensada para jugadores: catálogo
          curado, precios competitivos y entrega inmediata, sin colas ni intermediarios.
        </p>
        <h2>Nuestra Misión</h2>
        <p>
          Acercar los mejores juegos, desde los grandes lanzamientos AAA hasta los
          indies más prometedores, a cualquier jugador de Latinoamérica.
        </p>
        <h2>Nuestra Visión</h2>
        <p>
          Ser la plataforma de referencia para comprar videojuegos digitales en la
          región, reconocida por su catálogo, su comunidad y la confianza de sus jugadores.
        </p>
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          <div className="value-card">
            <span className="value-icon">🎮</span>
            <h3>Catálogo completo</h3>
            <p>De AAA a indies, siempre hay algo nuevo para jugar.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🔒</span>
            <h3>Compras seguras</h3>
            <p>Transacciones protegidas de punta a punta.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">⚡</span>
            <h3>Entrega inmediata</h3>
            <p>Tu clave y tu biblioteca, disponibles al instante.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🕹️</span>
            <h3>Comunidad gamer</h3>
            <p>Hecho por y para jugadores apasionados.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
