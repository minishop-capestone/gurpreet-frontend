import React, { useState, useEffect } from 'react';
import '../css/ViewProducts.css';
import toast, { Toaster } from 'react-hot-toast';

function ViewProducts() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState('add'); // 'add' or 'update'
    const [currentProduct, setCurrentProduct] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://gurpreet-backend.onrender.com/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            toast.error('Failed to fetch products.');
        }
    };

    const handleUpdateProductClick = (product) => {
        setCurrentProduct(product);
        setFormMode('update');
        setShowForm(true);
        setImage(product.image || null);
    };

    const handleDeleteProduct = async (_id) => {
        try {
            const response = await fetch(`https://gurpreet-backend.onrender.com/api/products/${_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Product deleted successfully!');
                setProducts(products.filter(product => product._id !== _id));
            } else {
                toast.error('Failed to delete product.');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the product.');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setCurrentProduct(null);
        setImage(null);
    };

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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = Object.fromEntries(formData.entries());
        productData.image = image;

        try {
            const response = await fetch(`https://gurpreet-backend.onrender.com/api/products/${formMode === 'add' ? '' : currentProduct._id}`, {
                method: formMode === 'add' ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                toast.success(`Product ${formMode === 'add' ? 'added' : 'updated'} successfully!`);
                fetchProducts();
                handleCloseForm();
            } else {
                toast.error(`Failed to ${formMode === 'add' ? 'add' : 'update'} product.`);
            }
        } catch (error) {
            toast.error('An error occurred while submitting the form.');
        }
    };

    return (
        <div className="admin-page">
            <Toaster />
            <div className="header-all">
                <h1>All Products</h1>
            </div>
            <section className="featured-products">
                <div className="products-list">
                    {products.map(product => (
                        <div key={product._id} className="product-card">
                            {product.image && (
                                <img src={product.image} alt={product.name} className="product-image" />
                            )}
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">${product.price}</p>
                            <p className="product-description">{product.description}</p>
                            <div className="product-button">
                                <button className="update-product-btn" onClick={() => handleUpdateProductClick(product)}>Edit</button>
                                <button className="delete-product-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <p>{formMode === 'add' ? 'Add Product' : 'Update Product'}</p>
                        <button className="close-btn" onClick={handleCloseForm}>×</button>
                        <form onSubmit={handleFormSubmit}>
                            <label htmlFor="product-name">Name:</label>
                            <input type="text" id="product-name" name="name" defaultValue={currentProduct ? currentProduct.name : ''} required />
                            <label htmlFor="product-description">Description:</label>
                            <input id="product-description" name="description" defaultValue={currentProduct ? currentProduct.description : ''} required />
                            <label htmlFor="product-price">Price:</label>
                            <input type="number" id="product-price" name="price" defaultValue={currentProduct ? currentProduct.price : ''} required />
                            <label htmlFor="product-category">Category:</label>
                            <select id="product-category" name="category" defaultValue={currentProduct ? currentProduct.category : ''} required>
                                <option value="">Select a Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home</option>
                                <option value="Sports">Sports</option>
                            </select>
                            <label htmlFor="product-image">Upload Image:</label>
                            <div className="form-group">
                                <input type="file" onChange={handleImageUpload} />
                                {image && (
                                    <div className="image-preview">
                                        <img src={image} alt="Product" className="preview-img" />
                                    </div>
                                )}
                            </div>
                            <button className='account-button' type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewProducts;
