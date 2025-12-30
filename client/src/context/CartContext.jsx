import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * CartContext Provider.
 * Manages the shopping cart state, including items, sidebar visibility, and totals.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Adds a product to the cart.
     * @param {Object} product - The product to add.
     */
    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsSidebarOpen(true);
    };

    /**
     * Removes a product from the cart by ID.
     * @param {string} productId - The product ID to remove.
     */
    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    /**
     * Updates the quantity of a cart item.
     * @param {string} productId - The product ID.
     * @param {number} delta - The change in quantity (+1 or -1).
     */
    const updateQuantity = (productId, delta) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Using Turkish field 'fiyat' from schema
    const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.fiyat) || 0) * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                isSidebarOpen,
                toggleSidebar,
                closeSidebar,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom hook to use the CartContext.
 * @returns {Object} The cart context value including state and methods.
 */
export const useCart = () => useContext(CartContext);
