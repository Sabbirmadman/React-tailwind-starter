import React from 'react';
import { Link } from 'react-router-dom';

const ProductListPage: React.FC = () => {
  // Example product list
  const products = [
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
  ];

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductListPage; 