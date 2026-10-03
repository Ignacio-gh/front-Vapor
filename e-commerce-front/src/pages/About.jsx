import '../styles/About.css'

function About() {
  return (
    <div className="about-container">
      <h1>Acerca de Nosotros</h1>
      <section className="about-content">
        <p>
          Somos una empresa dedicada a proporcionar los mejores productos tecnológicos
          del mercado a precios competitivos.
        </p>
        <h2>Nuestra Misión</h2>
        <p>
          Hacer que la tecnología de calidad sea accesible para todos, ofreciendo
          productos confiables y un excelente servicio al cliente.
        </p>
        <h2>Nuestra Visión</h2>
        <p>
          Ser líderes en el comercio electrónico de tecnología en Latinoamérica,
          reconocidos por nuestra calidad y servicio.
        </p>
        <h2>Valores</h2>
        <ul className="values-list">
          <li>✓ Calidad en todos nuestros productos</li>
          <li>✓ Honestidad y transparencia</li>
          <li>✓ Atención al cliente excepcional</li>
          <li>✓ Innovación continua</li>
          <li>✓ Responsabilidad social</li>
        </ul>
      </section>
    </div>
  )
}

export default About
