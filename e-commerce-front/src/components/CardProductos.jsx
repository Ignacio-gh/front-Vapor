import './CardProductos.css';

const CardProductos = ({ product }) => {
  return (
    <div className="card-producto">
      <img className="producto-imagen" src={product.imagen} alt={product.titulo} />
      <h3 className="producto-titulo">{product.titulo}</h3>
      <p className="producto-descripcion">{product.descripcion}</p>
      <p className="producto-precio">${product.precio}</p>
      <button className="producto-boton">Agregar al carrito</button>
    </div>
  );
};

export default CardProductos;
