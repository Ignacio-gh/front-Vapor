import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated, getRoles } from '../utils/auth'

// Uso: <Route element={<RutaPorRol roles={['ROLE_ADMIN', 'ROLE_VENDEDOR']} />}>
const RutaPorRol = ({ roles }) => {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const misRoles = getRoles()
  const autorizado = misRoles.some((rol) => roles.includes(rol))

  if (!autorizado) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}

export default RutaPorRol
