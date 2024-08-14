import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item._id === product._id);
            if (existingProduct) {
                const newQuantity = existingProduct.quantity + quantity;
                if (newQuantity > product.inventory) {
                    toast.error(`Cannot add more than ${product.inventory} of ${product.name}.`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item
                );
            } else {
                if (quantity > product.inventory) {
                    toast.error(`Cannot add more than ${product.inventory} of ${product.name}.`);
                    return prevCart;
                }
                return [...prevCart, { ...product, quantity, total: quantity * product.price }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    const incrementQuantity = (productId) => {
        setCart(prevCart => {
            const product = prevCart.find(item => item._id === productId);
            if (product.quantity + 1 > product.inventory) {
                toast.error(`Cannot add more than ${product.inventory} of ${product.name}.`);
                return prevCart;
            }
            return prevCart.map(item =>
                item._id === productId ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price } : item
            );
        });
    };

    const decrementQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1, total: (item.quantity - 1) * item.price } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
