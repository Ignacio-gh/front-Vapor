// Importa la función configureStore para crear la tienda Redux
import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './slices/counterSlice';
import cartSlice from './slices/cartSlice';
<<<<<<< HEAD
import favoritosReducer from './slices/favoritosSlice'
=======
import favoriteSlice from './slices/favoriteSlice';
import catalogoSlice from './slices/catalogoSlice';
>>>>>>> 885228834b4f440bdad22945782669276f8dc88b

// este es el store donde va a estar toda la info global que necesitan los todos componentes de la app
// configureStore crea el store global del proyecto, agrupa todos los reducers (contextos o estados globales) en un solo objeto
export const store = configureStore({
  reducer: { 
    counter: counterSlice, // Gestiona el estado del contador
    cart: cartSlice, // Gestiona el estado del carrito y sus funciones: addToCart, removeFromCart, clearCart
<<<<<<< HEAD
    favoritos: favoritosReducer, // Gestiona el estado de los favoritos (si lo tienes)
=======
    favorite: favoriteSlice, // Gestiona el estado de los favoritos (si lo tienes)
    catalogo: catalogoSlice, // Gestiona los filtros del catálogo: búsqueda por nombre y categoría
>>>>>>> 885228834b4f440bdad22945782669276f8dc88b
    // user: userReducer, // Gestiona el estado del usuario (si lo tienes)
  },
});
