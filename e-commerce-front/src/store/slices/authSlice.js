import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../../config/api'

// Sesión del usuario. El JWT vive en una cookie HttpOnly que JavaScript no puede leer,
// así que el front no sabe quién está logueado mirando el token: se lo pregunta al backend.

// Al abrir la app: si el navegador tiene la cookie, /me devuelve el perfil; si no, 401/403.
export const fetchSesion = createAsyncThunk('auth/fetchSesion', async () => {
  const res = await apiFetch('/api/usuarios/me')
  if (res.status === 401 || res.status === 403) return null // sin sesión: no es un error
  if (!res.ok) throw new Error('No se pudo verificar la sesión')
  return res.json()
})

// El front no puede borrar una cookie HttpOnly: se lo pide al backend, que la vence.
export const logout = createAsyncThunk('auth/logout', async () => {
  await apiFetch('/api/auth/logout', { method: 'POST' })
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: null, // { id, nombre, apellido, email, role, ... } o null si no hay sesión
    // 'verificando' hasta que responde /me: las rutas protegidas esperan en vez de mandar al login
    status: 'verificando', // verificando | listo
  },
  reducers: {
    // Login.jsx lo despacha con el perfil que devuelve POST /api/auth/login
    setUsuario: (state, action) => {
      state.usuario = action.payload
      state.status = 'listo'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSesion.fulfilled, (state, action) => {
        state.usuario = action.payload
        state.status = 'listo'
      })
      .addCase(fetchSesion.rejected, (state) => {
        // backend caído: se sigue como invitado en vez de dejar la app colgada
        state.usuario = null
        state.status = 'listo'
      })
      // Se limpia apenas se pide, aunque el backend tarde o falle: el usuario ya eligió salir
      .addCase(logout.pending, (state) => {
        state.usuario = null
      })
  },
})

export const { setUsuario } = authSlice.actions
export default authSlice.reducer
