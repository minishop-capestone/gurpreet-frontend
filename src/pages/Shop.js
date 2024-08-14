import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../components/CartContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [selectedCategory, setSelectedCategory] = useState(''); // Category filter state
    const [priceRange, setPriceRange] = useState([0, 10000]); // Price range filter state
    const navigate = useNavigate();
    const { cart, addToCart } = useCart();

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

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (product, event) => {
        event.stopPropagation(); // Prevents the click event from bubbling up to the product card
        const cartProduct = cart.find(item => item._id === product._id);
        const cartQuantity = cartProduct ? cartProduct.quantity : 0;
        if (cartQuantity + 1 > product.inventory) {
            toast.error(`Cannot add more than ${product.inventory} of ${product.name}.`);
        } else {
            addToCart(product);
            toast.success(`${product.name} added to cart.`);
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handlePriceRangeChange = (event) => {
        const { name, value } = event.target;
        setPriceRange((prevRange) => {
            if (name === 'min') {
                return [Number(value), prevRange[1]];
            } else {
                return [prevRange[0], Number(value)];
            }
        });
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setPriceRange([0, 10000]);
    };

    const filteredProducts = products
        .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(product => selectedCategory === '' || product.category === selectedCategory)
        .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    return (
        <main className="shop-content">
            <div className="flex justify-center mt-10 space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                        placeholder="Search products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M12.9 14.32a8 8 0 111.42-1.42l5.38 5.38-1.42 1.42-5.38-5.38zM8 14a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                </div>
                <div>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="w-full h-10 pl-3 pr-10 bg-white border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        {/* Add more categories as needed */}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        name="min"
                        value={priceRange[0]}
                        onChange={handlePriceRangeChange}
                        placeholder="Min Price"
                        className="w-24 h-10 pl-3 pr-4 bg-white border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        name="max"
                        value={priceRange[1]}
                        onChange={handlePriceRangeChange}
                        placeholder="Max Price"
                        className="w-24 h-10 pl-3 pr-4 bg-white border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    />
                </div>
                <button
                    onClick={handleResetFilters}
                    className="reset-button h-10 px-4 bg-red-500 text-white rounded-md focus:ring focus:ring-red-300 focus:outline-none"
                >
                    Reset
                </button>
            </div>

            <section id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {filteredProducts.map(product => (
                    <div key={product._id} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl" onClick={() => handleProductClick(product._id)}>
                        <div>
                            <img src={product.image} alt={product.name} className="h-80 w-72 object-cover rounded-t-xl" />
                            <div className="px-4 py-3 w-72">
                                <span className="text-gray-400 mr-3 uppercase text-xs">{product.category}</span>
                                <p className="text-lg font-bold text-black truncate block capitalize">{product.name}</p>
                                <div className="flex items-center">
                                    <p className="text-lg font-semibold text-black cursor-auto my-3">${product.price}</p>
                                    {product.discount && (
                                        <del>
                                            <p className="text-sm text-gray-600 cursor-auto ml-2">${(product.price / (1 - product.discount / 100)).toFixed(2)}</p>
                                        </del>
                                    )}
                                    <div className="ml-auto" onClick={(event) => handleAddToCart(product, event)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" className="bi bi-bag-plus cursor-pointer" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                                            <path
                                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 cursor-auto">{product.rating} reviews</p>
                                <p className="text-sm text-gray-600 cursor-auto">{product.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
};

export default Shop;
