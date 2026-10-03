import { Link } from 'react-router-dom'
import products from '../data/products.json'
import '../styles/Products.css'

// ponytail: mock con products.json; pasar a POST/PUT/DELETE /api/productos
function AdminProductos() {
  return (
    <div className="products-container">
      <h1>Administrar Productos</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.titulo}</td>
              <td>${product.precio}</td>
              <td>
                <Link to={`/products/${product.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductos
