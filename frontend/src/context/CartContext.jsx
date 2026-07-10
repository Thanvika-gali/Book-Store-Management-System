import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
      setCoupon(null);
    }
  }, [isAuthenticated]);

  const addToCart = async (bookId, quantity = 1) => {
    try {
      setLoading(true);
      await api.post('/cart', { bookId, quantity });
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      await api.put(`/cart/${cartItemId}?quantity=${quantity}`);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${cartItemId}`);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await api.delete('/cart/clear');
      setCart([]);
      setCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (code) => {
    const subtotal = getSubtotal();
    try {
      const response = await api.get(`/orders/validate-coupon?code=${code}&total=${subtotal}`);
      setCoupon(response.data);
      return response.data;
    } catch (err) {
      setCoupon(null);
      throw err;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const getSubtotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.bookDiscountPrice > 0 ? item.bookDiscountPrice : item.bookPrice;
      return acc + price * item.quantity;
    }, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    const subtotal = getSubtotal();
    if (coupon.discountType === 'FLAT') {
      return Math.min(coupon.discountAmount, subtotal);
    } else {
      return (subtotal * coupon.discountAmount) / 100;
    }
  };

  const getFinalTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    return Math.max(0, subtotal - discount);
  };

  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        coupon,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal: getSubtotal(),
        discount: getDiscountAmount(),
        total: getFinalTotal(),
        cartCount: getCartCount(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
