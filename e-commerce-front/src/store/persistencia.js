// Persistencia del store de Redux en localStorage.
// Redux vive en memoria: sin esto, al recargar la página (F5) el carrito vuelve a estar vacío.
// Solo se guardan los productos del carrito; el resto (si el drawer está abierto, carga, errores)
// no tiene sentido restaurarlo, y los favoritos se vuelven a pedir al backend.

const CART_KEY = 'vapor-carrito'

// Devuelve los items guardados, o [] si no hay nada o el dato está roto.
// localStorage puede tirar error (modo privado, almacenamiento bloqueado): en ese caso, carrito vacío.
export function cargarCarrito() {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY))
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function guardarCarrito(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    // sin almacenamiento disponible el carrito sigue funcionando, solo que no sobrevive al F5
  }
}

// Se suscribe al store y guarda el carrito cada vez que cambia.
// Compara la referencia de items: Redux Toolkit crea un array nuevo solo cuando el carrito cambia,
// así no se escribe en localStorage por cada acción (abrir el drawer, buscar, etc.).
export function persistirCarrito(store) {
  let ultimosItems = store.getState().cart.items
  store.subscribe(() => {
    const items = store.getState().cart.items
    if (items !== ultimosItems) {
      ultimosItems = items
      guardarCarrito(items)
    }
  })
}
