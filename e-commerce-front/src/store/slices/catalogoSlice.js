import { createSlice } from '@reduxjs/toolkit';

// Filtros del catálogo (/products). Viven en Redux porque los comparten dos componentes
// que no son padre/hijo: el buscador del Navbar y los chips de categoría de Products.
const catalogoSlice = createSlice({
  name: 'catalogo',
  initialState: {
    busqueda: '',
    // null = todas las categorías
    genero: null,
  },

  reducers: {
    setBusqueda: (state, action) => {
      state.busqueda = action.payload;
    },

    setGenero: (state, action) => {
      state.genero = action.payload;
    },

    limpiarFiltros: (state) => {
      state.busqueda = '';
      state.genero = null;
    },
  },
});

export const { setBusqueda, setGenero, limpiarFiltros } = catalogoSlice.actions;

export default catalogoSlice.reducer;
