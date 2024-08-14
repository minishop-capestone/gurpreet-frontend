import React from 'react';
import { useCart } from '../components/CartContext';
import { Link as RouterLink } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const stripePromise = loadStripe('pk_test_51PkakeP0Cg8PDGsZad3loQ2uMrVH8LO2UM5T09vm8LTZA5sq4Q6OUuosucs2SDXaFyWsRzXd3ZqogWqklBG5grIY00FRywGSMg');

const Cart = () => {
    const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCart();
    const { user } = useAuth();

    const getTotalPrice = () => {
        return cart.reduce((acc, item) => acc + item.total, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        const stripe = await stripePromise;
        const response = await axios.post('https://gurpreet-backend.onrender.com/api/payment/create-checkout-session', {
            items: cart,
            userId:user.id
        });

        const session = response.data;

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        console.log(result)

        if (result.error) {
            console.error(result.error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
            <div className="flow-root">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cart.map((product) => (
                        <li key={product._id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img alt={product.name} src={product.image} className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <RouterLink to={`/product/${product._id}`}>{product.name}</RouterLink>
                                        </h3>
                                        <p className="ml-4">${product.total.toFixed(2)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center">
                                        <button 
                                            type="button" 
                                            className="font-medium text-indigo-600 " 
                                            onClick={() => decrementQuantity(product._id)}
                                        >
                                            -
                                        </button>
                                        <p className="mx-2 text-gray-500">Qty {product.quantity}</p>
                                        <button 
                                            type="button" 
                                            className="font-medium text-indigo-600 " 
                                            onClick={() => incrementQuantity(product._id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex">
                                        <button 
                                            type="button" 
                                            className="font-medium text-indigo-600 hover:text-indigo-500" 
                                            onClick={() => removeFromCart(product._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${getTotalPrice()}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                <button 
    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
    onClick={handleCheckout}
    disabled={cart.length === 0}
>
    Checkout
</button>

                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                        or{' '}
                        <RouterLink 
                            to="/shop" 
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                        </RouterLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cart;
