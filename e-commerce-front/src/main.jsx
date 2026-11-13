import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'

// Limpia claves corruptas de localStorage que puedan causar errores de parsing JSON
// El error "Unexpected token ']'... \"blioteca\":]}]}]}]}]}" sugiere una clave truncada "biblioteca"
function limpiarLocalStorageCorrupto() {
  try {
    const clavesABorrar = []
    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i)
      if (!clave) continue
      
      // Verificar si la CLAVE parece corrupta (truncada como "blioteca", o parece JSON)
      const clavePareceCorrupta = 
        clave.toLowerCase().includes('blioteca') ||  // "blioteca" truncado
        clave.startsWith('{') || 
        clave.startsWith('[')
      
      // Verificar si el VALOR es JSON malformado
      let valorEsJSONMalformado = false
      try {
        const valor = localStorage.getItem(clave)
        if (valor && (valor.startsWith('{') || valor.startsWith('['))) {
          JSON.parse(valor) // Si falla, es JSON malformado
        }
      } catch {
        valorEsJSONMalformado = true
      }
      
      // Borrar si la clave parece corrupta O el valor es JSON malformado
      if (clavePareceCorrupta || valorEsJSONMalformado) {
        clavesABorrar.push(clave)
      }
    }
    clavesABorrar.forEach(clave => {
      console.warn('[localStorage] Eliminando clave corrupta: ' + clave)
      localStorage.removeItem(clave)
    })
  } catch (e) {
    console.error('[localStorage] Error al limpiar claves corruptas:', e)
  }
}

// Ejecutar limpieza antes de renderizar
limpiarLocalStorageCorrupto()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
