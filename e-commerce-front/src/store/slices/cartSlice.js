import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// createAsyncThunk crear acciones asincrónicas
export const fetchCarritoItems = createAsyncThunk(
  // 'cart/fetchCarritoItems' es el tipo de acción que se genera automáticamente para identificar esta acción asincrónica en los reducers
  'Carrito/fetchCarritoItems',
  async () => {
    const response = await fetch('http://localhost:8080/api/carrito', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      mode: 'cors'
    });
    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }
    const data = await response.json();
    return data;
  }
);

// cartSlice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    isOpen: false,   // nuevo, para el desplegable lateral del carrito
  },

  reducers: {
    //TODO: ssanchez - llamar a la api de cartSlice
    addToCart: (state, action) => {
      //state.total datos de total
      const product = action.payload;
      // find busca en items si ya existe un producto con el mismo id. 
      const existingItem = state.items.find(item => item.id === product.id);

      if (!existingItem) {
        // si no encuentra el producto en el array items
        // agrega dicho producto al array items del carrito
        state.items.push(product);
      }

      //TODO: ssanchez - si no existe, incrementar la cantidad del producto
    },

    removeFromCart: (state, action) => {
      // filter crea un nuevo array sin el producto que queremos eliminar
      //action.payload es el id del producto que queremos eliminar, 
      // lo enviamos con dispatch(removeFromCart(productId)) desde el componente Carrito.jsx
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // estados del carrito: abierto o cerrado
    clearCart: (state) => {
      state.items = [];
    },
    openCart: (state) => {
      state.isOpen = true
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },

  // extraReducers maneja las acciones generadas por createAsyncThunk (fetchCarritoItems) para actualizar el estado de carga y error al obtener los items del carrito desde la API
  // reducers acciones externas
  // builder es un objeto que permite agregar casos para manejar las acciones generadas por createAsyncThunk
  extraReducers: (builder) => {
    builder
      //fetchCarritoItems genera tres acciones automáticamente: pending (cuando la petición está en curso), 
      // fulfilled (cuando la petición se completa exitosamente) y rejected (cuando la petición falla)
      .addCase(fetchCarritoItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      //action en este caso trae el payload con los items del carrito obtenidos desde la API. También se actualiza el estado de carga y error.
      .addCase(fetchCarritoItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      // action en este caso trae el error generado al intentar obtener los items del carrito desde la API. También se actualiza el estado de carga y error.
      .addCase(fetchCarritoItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { addToCart, removeFromCart, clearCart, openCart, closeCart } = cartSlice.actions;

export default cartSlice.reducer;