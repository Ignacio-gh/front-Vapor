import { Navigate, Outlet } from 'react-router-dom'

// Uso: <Route element={<RutaPorRol roles={['ROLE_ADMIN', 'ROLE_VENDEDOR']} />}>
const RutaPorRol = ({ roles }) => {
  // Autenticación y rol hardcodeados por ahora: reemplazar por los datos reales del login.
  const isAuthenticated = true
  const rol = 'ROLE_ADMIN'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // logueado pero sin el rol pedido -> no autorizado (cae en el 404)
  if (!roles.includes(rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}

export default RutaPorRol
