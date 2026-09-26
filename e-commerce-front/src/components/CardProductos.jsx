import './CardProductos.css';

const CardProductos = ({ product }) => {
  return (
    <div className="card-producto">
      <h3 className="producto-titulo">{product.titulo}</h3>
      <p className="producto-descripcion">{product.descripcion}</p>
      <p className="producto-precio">${product.precio}</p>
    </div>
  );
};

export default CardProductos;
