import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import { useAuth } from '../components/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user, login, loginAsAdmin } = useAuth();

  useEffect(() => {
    if (user) navigate("/");

    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://gurpreet-backend.onrender.com/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products.');
    }
  };

  return (
    <main className={`home-content`}>
      <header className="header">
        <div className="header-content">
          <h1>Your One-Stop Electronic Market</h1>
          <p>Welcome to Minishop, your ultimate destination for the latest and greatest in electronics. Discover unbeatable deals and exclusive offers every day!</p>
          <p>
            ✔️ Wide range of products from top brands<br />
            ✔️ Exclusive discounts and deals<br />
            ✔️ Fast and reliable shipping<br />
            ✔️ 24/7 customer support
          </p>
          <button className="shop-now" onClick={() => navigate('/shop')}>Shop Now</button>
        </div>

        <div className="header-image">
          <img src="./banner.png" alt="Electronics" />
        </div>
      </header>
     
      <section className="benefits">
        <div className="benefit">
          <img src="./customer.svg" alt="Responsive" />
          <h3>Responsive</h3>
          <p>Customer service available 24/7</p>
        </div>
        <div className="benefit">
          <img src="./secure.svg" alt="Secure" />
          <h3>Secure</h3>
          <p>Certified marketplace since 2017</p>
        </div>
        <div className="benefit">
          <img src="./shipping.svg" alt="Shipping" />
          <h3>Shipping</h3>
          <p>Free, fast, and reliable worldwide</p>
        </div>
        <div className="benefit">
          <img src="./return.svg" alt="Transparent" />
          <h3>Transparent</h3>
          <p>Hassle-free return policy</p>
        </div>
      </section>
      
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-list">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-rating">Rating: {product.rating}</p>
              <p className="product-description">{product.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
