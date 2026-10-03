const RutaPorRol = ({ usuario, rolRequerido }) => {
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== rolRequerido) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
};

// Uso en las rutas:
<Route element={<RutaPorRol usuario={usuario} rolRequerido="admin" />}>
  <Route path="/admin/productos" element={<GestionProductos />} />
</Route>