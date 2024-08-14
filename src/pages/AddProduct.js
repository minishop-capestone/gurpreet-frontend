import React, { useState } from 'react';
import '../css/AddProduct.css';
import toast from 'react-hot-toast';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      price,
      inventory,
      category,
      image, // This is the base64 string
    };

    try {
      const response = await fetch('https://gurpreet-backend.onrender.com/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        toast.success('Product added successfully!');
        onProductAdded(newProduct);
        setName('');
        setDescription('');
        setPrice('');
        setInventory('');
        setCategory('');
        setImage(null);
      } else {
        toast.error('Failed to add product.');
      }
    } catch (error) {
      toast.error('An error occurred while adding the product.');
    }
  };

  return (
    <main>
      <div className="add-product-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Inventory</label>
            <input
              type="number"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <div className="form-group">
            <label>Image</label>
            <input type="file" onChange={handleImageUpload} required />
            {image && (
              <div className="image-preview">
                <img
                  src={image}
                  alt="Product"
                  className="preview-img"
                />
              </div>
            )}
          </div>
          <button  type="submit" className="save-button">Save Product</button>
        </form>
      </div>
    </main>
  );
};

export default AddProduct;
