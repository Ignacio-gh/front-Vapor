import { useState } from 'react'
import '../styles/Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Gracias ${formData.name}, nos pondremos en contacto pronto!`)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-container">
      <h1>Contáctanos</h1>
      <section className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <h3>📧 Email</h3>
            <p>contacto@ecommerce.com</p>
          </div>
          <div className="info-item">
            <h3>📱 Teléfono</h3>
            <p>+54 (11) 1234-5678</p>
          </div>
          <div className="info-item">
            <h3>📍 Ubicación</h3>
            <p>Buenos Aires, Argentina</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Tu email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Asunto</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Asunto del mensaje"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Tu mensaje"
            ></textarea>
          </div>

          <button type="submit" className="btn-send">
            Enviar Mensaje
          </button>
        </form>
      </section>
    </div>
  )
}

export default Contact
