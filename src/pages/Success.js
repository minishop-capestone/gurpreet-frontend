import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../components/CartContext';

const Success = () => {
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const { clearCart } = useCart(); // Importing the clearCart function

    useEffect(() => {
        const updateOrderStatus = async () => {
            const query = new URLSearchParams(location.search);
            const sessionId = query.get('session_id');
            const orderId = query.get('order_id');

            if (sessionId && orderId) {
                try {
                    await axios.post('https://gurpreet-backend.onrender.com/api/payment/update-order', {
                        sessionId,
                        orderId
                    });

                    clearCart(); // Clear the cart after successful payment

                    setShowModal(true); 
                } catch (error) {
                    console.error('Error updating order status:', error);
                }
            }
        };

        updateOrderStatus();
    }, [location, clearCart]);

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
            <div className="container mx-auto px-4 py-8 flex-grow">
                {showModal && (
                    <div className="bg-gray-100 h-screen flex items-center justify-center">
                        <div className="bg-white p-6 md:mx-auto">
                            <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                                <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path>
                            </svg>
                            <div className="text-center">
                                <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                                <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                                <p> Have a great day! </p>
                                <div className="py-10 text-center">
                                    <a href="/shop" className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                                        GO BACK
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Success;
