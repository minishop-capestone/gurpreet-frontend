import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const { cart, addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [review, setReview] = useState({ username: '', comment: '', star: 1 });

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`https://gurpreet-backend.onrender.com/api/products/${productId}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            toast.error('Failed to fetch product details.');
        }
    };

    const changeImage = (src) => {
        document.getElementById('mainImage').src = src;
    };

    const handleAddToCart = () => {
        const cartProduct = cart.find(item => item._id === product._id);
        const cartQuantity = cartProduct ? cartProduct.quantity : 0;
        if (cartQuantity + quantity > product.inventory) {
            toast.error(`Cannot add more than ${product.inventory} of ${product.name}.`);
        } else {
            addToCart(product, quantity);
            toast.success(`${quantity} ${product.name} added to cart.`);
        }
    };
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
        return totalStars / reviews.length;
    };
    

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://gurpreet-backend.onrender.com/api/reviews/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(review)
            });
            if (response.ok) {
                fetchProduct();
                setReview({ username: '', comment: '', star: 1 }); 
                toast.success('Review added successfully!');
            } else {
                toast.error('Failed to add review.');
            }
        } catch (error) {
            toast.error('Failed to add review.');
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }
    const rating = calculateAverageRating(product.reviews);
    const reviewsCount = product.reviews.length || 0;


    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap -mx-4">
                    {/* Product Images */}
                    <div className="w-full md:w-1/2 px-4 mb-8">
                        <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-md mb-4" id="mainImage" />
                        <div className="flex gap-4 py-4 justify-center overflow-x-auto">
                            {product.images && product.images.map((img, index) => (
                                <img key={index} src={img} alt={`Thumbnail ${index + 1}`} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300" onClick={() => changeImage(img)} />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2 px-4">
                        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                        <p className="text-gray-600 mb-4"></p>
                        <p className="text-gray-600 mb-4"></p>

                        <div className="mb-4">
                            <span className="text-2xl font-bold mr-2">${product.price}</span>
                            {product.discount && (
                                <span className="text-gray-500 line-through">${(product.price / (1 - product.discount / 100)).toFixed(2)}</span>
                            )}
                        </div>
                        <div className="flex items-center mb-4">
                            {[...Array(5)].map((star, index) => (
                                <svg key={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                            ))}
                            <span className="ml-2 text-gray-600">{rating.toFixed(1)} ({reviewsCount} reviews)</span>
                        </div>
                        <p className="text-gray-700 mb-6">{product.description}</p>

                        <div className="mb-6">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                            <input  type="number" id="quantity" name="quantity" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-12 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        </div>

                        <div className="mb-6">
                            <button onClick={handleAddToCart} className="add-cart-button bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Add Reviews:</h3>

                    <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="mb-4">
                            <label htmlFor="username" className=" block text-sm font-medium text-gray-700">Username:</label>
                            <input  type="text" id="username" name="username" value={review.username} onChange={(e) => setReview({ ...review, username: e.target.value })} className=" custom-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment:</label>
                            <textarea id="comment" name="comment" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="star" className="block text-sm font-medium text-gray-700">Rating:</label>
                            <div className="rating mt-1 flex">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <label key={num}>
                                        <input
                                            type="radio"
                                            name="rating-2"
                                            className="hidden"
                                            checked={review.star === num}
                                            onChange={() => setReview({ ...review, star: num })}
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={`w-6 h-6 ${num <= review.star ? 'text-yellow-500' : 'text-gray-300'}`} viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="review-button px-6 py-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Submit Review</button>
                    </form>

                    <h3 className="text-lg font-semibold mb-2">Reviews:</h3>
                    <ul className="list-none mb-4">
                        {product.reviews && product.reviews.map((review, index) => (
                            <li key={index} className="mb-4 bg-white p-4 rounded-lg shadow-md">
                                <article>
                                    <div className="flex items-center mb-4">
                                        <div className="font-medium">
                                            <p>{review.username} <time dateTime={new Date(review.createdAt).toISOString()} className="block text-sm text-gray-500">Joined on {new Date(review.createdAt).toLocaleDateString()}</time></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-1 space-x-1">
                                        {[...Array(5)].map((star, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < review.star ? 'text-yellow-300' : 'text-gray-300'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                            </svg>
                                        ))}
                                        <h3 className="ms-2 text-sm font-semibold">{review.comment}</h3>
                                    </div>
                                    <footer className="mb-5 text-sm text-gray-500">
                                        <p>Reviewed on <time dateTime={new Date(review.createdAt).toISOString()}>{new Date(review.createdAt).toLocaleDateString()}</time></p>
                                    </footer>
                                </article>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
