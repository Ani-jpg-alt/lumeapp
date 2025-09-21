import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { saveUserCart, getUserCart, clearUserCart } from '../services/firestoreService';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const { currentUser } = useAuth();

  // Load cart from Firestore when user changes
  useEffect(() => {
    const loadUserCart = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          // Get cart from Firestore for authenticated user
          const userCartItems = await getUserCart(currentUser.uid);
          setCartItems(userCartItems);
        } catch (error) {
          console.error('Error loading cart from Firestore:', error);
          // Fallback to localStorage if Firestore fails
          const savedCart = localStorage.getItem('lumeapp-cart');
          if (savedCart) {
            try {
              const localCartItems = JSON.parse(savedCart);
              setCartItems(localCartItems);
              // Migrate localStorage cart to Firestore
              if (localCartItems.length > 0) {
                await saveUserCart(currentUser.uid, localCartItems);
                localStorage.removeItem('lumeapp-cart');
              }
            } catch (parseError) {
              console.error('Error parsing localStorage cart:', parseError);
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        }
        setIsLoading(false);
      } else {
        // Not authenticated, use localStorage
        const savedCart = localStorage.getItem('lumeapp-cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    };

    loadUserCart();
  }, [currentUser]);

  // Save cart to Firestore or localStorage whenever cartItems change
  useEffect(() => {
    const saveCart = async () => {
      if (currentUser) {
        // User is authenticated, save to Firestore
        try {
          await saveUserCart(currentUser.uid, cartItems);
        } catch (error) {
          console.error('Error saving cart to Firestore:', error);
          // Fallback to localStorage if Firestore fails
          localStorage.setItem('lumeapp-cart', JSON.stringify(cartItems));
        }
      } else {
        // User not authenticated, save to localStorage
        localStorage.setItem('lumeapp-cart', JSON.stringify(cartItems));
      }
    };

    // Only save if we're not in the initial loading state
    if (!isLoading) {
      saveCart();
    }
  }, [cartItems, currentUser, isLoading]);

  const addToCart = (product, selectedSize = null) => {
    // Security check: Ensure product data is valid
    if (!product || !product.id || !product.name || !product.price) {
      console.error('Invalid product data provided to addToCart');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        showNotification(
          `${product.name}${selectedSize ? ` (${selectedSize})` : ''} quantity updated in cart!`,
          'success'
        );
        return prevItems.map(item =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showNotification(
          `${product.name}${selectedSize ? ` (${selectedSize})` : ''} added to cart!`,
          'success'
        );
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || product.image,
          selectedSize: selectedSize,
          quantity: 1,
          product: product // Store full product data
        }];
      }
    });
  };

  const removeFromCart = (productId, selectedSize = null) => {
    setCartItems(prevItems =>
      prevItems.filter(item => 
        !(item.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    if (currentUser) {
      try {
        await clearUserCart(currentUser.uid);
      } catch (error) {
        console.error('Error clearing cart in Firestore:', error);
      }
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemQuantity = (productId, selectedSize = null) => {
    const item = cartItems.find(
      item => item.id === productId && item.selectedSize === selectedSize
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
    isCartOpen,
    setIsCartOpen,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
