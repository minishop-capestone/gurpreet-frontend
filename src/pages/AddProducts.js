import React, { useState } from 'react';
import AddProduct from './AddProduct';

const AddProducts = () => {
  const [products, setProducts] = useState([]);

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  return (
    <div>
      <AddProduct onProductAdded={handleProductAdded} />
    </div>
  );
};

export default AddProducts;
