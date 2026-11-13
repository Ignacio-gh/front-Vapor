import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function ProtectedRoute() {
  const location = useLocation()
  const { usuario, status } = useSelector((state) => state.auth)

  // Mientras el backend confirma la sesión (cookie HttpOnly) no se redirige:
  // si no, un F5 en /biblioteca mandaría al login aunque haya sesión
  if (status === 'verificando') return <p>Cargando...</p>

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
