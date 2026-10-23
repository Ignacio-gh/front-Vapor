import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Products from './components/Products'
import ProductDetail from './components/ProductDetail'
import About from './components/About'
import NotFound from './components/NotFound'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import Cart from './components/Cart'
import Login from './components/Login'
import RutaPorRol from './components/RutaPorRol'
import Biblioteca from './components/Biblioteca'
import AdminProductos from './components/AdminProductos'
import Registro from './components/Registro'
import Categoria from './components/Categoria'
import ProductoForm from './components/ProductoForm'


function App() {
  return (
    <>
      <Navbar />
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          {/* <Route path="/checkout" element={<Checkout   />} /> */}
        </Route>

        <Route element={<RutaPorRol roles={['ROLE_ADMIN', 'ROLE_VENDEDOR']} />}>
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
        </Route>
      </Routes>
      </>
      )
}



      export default App
