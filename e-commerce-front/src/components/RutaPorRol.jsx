import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

// Uso: <Route element={<RutaPorRol roles={['ROLE_ADMIN', 'ROLE_VENDEDOR']} />}>
const RutaPorRol = ({ roles }) => {
  const location = useLocation()
  const { usuario, status } = useSelector((state) => state.auth)

  if (status === 'verificando') return <p>Cargando...</p>

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // El perfil trae el rol como el enum del backend (ADMIN); las rutas lo piden como ROLE_ADMIN
  if (!roles.includes(`ROLE_${usuario.role}`)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <Outlet />
}

export default RutaPorRol
