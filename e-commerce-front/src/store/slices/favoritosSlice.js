import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../../config/api'

// Trae los favoritos del usuario logueado
export const fetchFavoritos = createAsyncThunk('favoritos/fetch', async () => {
  const res = await apiFetch('/api/favoritos')
  if (!res.ok) throw new Error('No se pudieron cargar los favoritos')
  return res.json()
})

// Reciben el producto completo (no solo el id) para poder actualizar la lista al instante
export const addFavorito = createAsyncThunk('favoritos/add', async (product) => {
  const res = await apiFetch(`/api/favoritos/${product.id}`, { method: 'POST' })
  if (!res.ok) throw new Error('No se pudo agregar a favoritos')
  return product.id
})

export const removeFavorito = createAsyncThunk('favoritos/remove', async (product) => {
  const res = await apiFetch(`/api/favoritos/${product.id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('No se pudo quitar de favoritos')
  return product.id
})

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState: {
    items: [], // productos favoritos completos
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Se usa al cerrar sesión
    clearFavoritos: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavoritos.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchFavoritos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFavoritos.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Actualización optimista: la UI cambia al toque y se revierte si el back falla
      .addCase(addFavorito.pending, (state, action) => {
        const product = action.meta.arg
        if (!state.items.some((i) => i.id === product.id)) state.items.unshift(product)
      })
      .addCase(addFavorito.rejected, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.meta.arg.id)
        state.error = action.error.message
      })
      .addCase(removeFavorito.pending, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.meta.arg.id)
      })
      .addCase(removeFavorito.rejected, (state, action) => {
        const product = action.meta.arg
        if (!state.items.some((i) => i.id === product.id)) state.items.push(product)
        state.error = action.error.message
      })
  },
})

export const { clearFavoritos } = favoritosSlice.actions
export default favoritosSlice.reducer
