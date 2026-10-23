import { createSlice } from '@reduxjs/toolkit';

// createSlice reúne en un solo lugar el estado inicial y las funciones que lo modifican. 
const cartSlice = createSlice({
  name: 'cart',  // Nombre del slice o estado del contador
  initialState: { // Estado inicial del carrito: [] sin times, 0 total
    // listado de productos en el carrito
    items: [],
    // total de items del carrito
    total: 0,
    // si el drawer del carrito está abierto
    isOpen: false
  },

  // agrupa todas las funciones que modifican el estado del carrito
  reducers: {
    
    // función para agregar un producto al carrito
    // state = es el estado actual del carrito { items: [] } 
    // action es un objeto que contiene la acción y el dato enviado (payload) cuando se ejecuta dipatch(addToCart(producto))
    // action = {
    //   type: 'cart/addToCart', // Tipo de acción generado automáticamente
    //   payload: { id: 1, nombre: 'Producto A', precio: 100 } // El producto que enviaste
    // }
    // addToCart se invoca cuando se ejecuta dipatch(addToCart(producto))
    addToCart: (state, action) => {
      //obtiene los datos del producto enviados desde el dispatch
      const product = action.payload;

      // find busca en items si ya existe un producto con el mismo id. 
      const existingItem = state.items.find(item => item.id === product.id);

      if (!existingItem) {
        // si no encuentra el producto lo agrega al array items del carrito
        state.items.push(product);
      }

      //TODO: bsanchez - si existe, incrementar la cantidad del producto
    },

    // se invoca cuando se ejecuta dipatch(removeFromCart(productId))
    removeFromCart: (state, action) => {
      // filter crea un nuevo array sin el producto que queremos eliminar
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearCart: (state) => {
      state.items = [];
    },

    // abren y cierran el drawer del carrito desde cualquier componente
    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    }
  }
});

// exporta las funciones para que puedan ser utilizadas por los componentes
export const { addToCart, removeFromCart, clearCart, openCart, closeCart } = cartSlice.actions;

export default cartSlice.reducer;
