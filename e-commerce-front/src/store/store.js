// Importa la función configureStore para crear la tienda Redux
import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './slices/counterSlice';
import cartSlice from './slices/cartSlice';
import favoritosReducer from './slices/favoritosSlice'
import catalogoSlice from './slices/catalogoSlice';
import authSlice from './slices/authSlice';
import { cargarCarrito, persistirCarrito } from './persistencia';

// este es el store donde va a estar toda la info global que necesitan los todos componentes de la app
// configureStore crea el store global del proyecto, agrupa todos los reducers (contextos o estados globales) en un solo objeto
export const store = configureStore({
  reducer: { 
    counter: counterSlice, // Gestiona el estado del contador
    cart: cartSlice, // Gestiona el estado del carrito y sus funciones: addToCart, removeFromCart, clearCart
    favoritos: favoritosReducer, // Gestiona el estado de los favoritos (si lo tienes)
    catalogo: catalogoSlice, // Gestiona los filtros del catálogo: búsqueda por nombre y categoría
    auth: authSlice, // Usuario logueado (perfil y rol), confirmado por el backend con la cookie de sesión
    // user: userReducer, // Gestiona el estado del usuario (si lo tienes)
  },
  // Estado inicial restaurado de localStorage: el carrito sobrevive a un F5.
  // cartSlice(undefined, { type: '@@INIT' }) da el estado inicial del slice y se le pisan solo los items.
  preloadedState: {
    cart: { ...cartSlice(undefined, { type: '@@INIT' }), items: cargarCarrito() },
  },
});

// Cada vez que cambia el carrito, se guarda en localStorage
persistirCarrito(store);
