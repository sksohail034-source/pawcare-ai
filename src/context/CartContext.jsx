import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Try to get cart from localStorage on initial load
    const savedCart = localStorage.getItem('pawcare_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Failed to parse cart from local storage', error);
        return [];
      }
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('pawcare_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true); // Open drawer when item added
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    // Parse price safely, assuming price could be string like '199' or '199 - 299'
    let priceValue = 0;
    if (typeof item.price === 'string') {
        const parts = item.price.split('-');
        priceValue = parseInt(parts[0].replace(/[^0-9]/g, '')) || 0;
    } else {
        priceValue = Number(item.price) || 0;
    }
    return total + (priceValue * item.quantity);
  }, 0);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      totalItems,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
