import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Products from './components/Products'
import ProductDetail from './components/ProductDetail'
import About from './components/About'
import NotFound from './components/NotFound'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import Carrito from './components/Carrito'
import Checkout from './components/Checkout'
import Login from './components/Login'
import RutaPorRol from './components/RutaPorRol'
import Biblioteca from './components/Biblioteca'
import AdminProductos from './components/AdminProductos'
import AdminPanel from './components/AdminPanel'
import Registro from './components/Registro'
import Categoria from './components/Categoria'
import ProductoForm from './components/ProductoForm'
import { fetchFavoritos } from './store/slices/favoritosSlice'
import { isAuthenticated } from './utils/auth'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const favStatus = useSelector((state) => state.favoritos.status)

  // Carga los favoritos cuando hay sesión. Se vuelve a evaluar al cambiar de ruta,
  // así también se cargan justo después de iniciar sesión (sin recargar la página).
  // Al cerrar sesión, clearFavoritos() deja el estado en 'idle' y no se vuelve a pedir.
  useEffect(() => {
    if (isAuthenticated() && favStatus === 'idle') {
      dispatch(fetchFavoritos())
    }
  }, [location.pathname, favStatus, dispatch])

  return (
    <>
      <Navbar />
      <Carrito />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/categoria/:genero" element={<Categoria />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Panel de administración: solo ADMIN (alta, edición y baja de juegos incluidas) */}
        <Route element={<RutaPorRol roles={['ROLE_ADMIN']} />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/productos/nuevo" element={<ProductoForm key="nuevo" />} />
          <Route path="/admin/productos/:id/editar" element={<ProductoForm key="editar" />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
