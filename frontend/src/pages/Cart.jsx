import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, Ticket, ShoppingCart, 
  ArrowRight, ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { 
    cart, updateQuantity, removeFromCart, clearCart, 
    subtotal, discount, total, applyCoupon, removeCoupon, coupon 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    setApplying(true);
    try {
      await applyCoupon(couponCode.trim());
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code.');
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-6 dark:bg-slate-800">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
          Looks like you haven't added any books to your shopping cart yet. Start exploring our catalog!
        </p>
        <Link to="/books" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-semibold text-white hover:bg-primary-600 transition-all hover:-translate-y-0.5">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <h1 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Columns Cart Items Table list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {cart.map((item) => {
                const price = item.bookDiscountPrice > 0 ? item.bookDiscountPrice : item.bookPrice;
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 hover:bg-gray-50/50 transition-colors dark:hover:bg-slate-800/20">
                    
                    {/* Cover image */}
                    <Link to={`/books/${item.bookId}`} className="h-20 w-15 overflow-hidden rounded-lg border border-gray-100 shrink-0 dark:border-slate-800">
                      <img src={item.bookCoverImage} alt={item.bookTitle} className="h-full w-full object-cover" />
                    </Link>

                    {/* Book Metadata details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${item.bookId}`} className="font-semibold text-gray-800 hover:text-primary-500 transition-colors dark:text-slate-100 text-sm leading-snug block truncate">
                        {item.bookTitle}
                      </Link>
                      <span className="text-2xs text-gray-400 block mt-0.5">Unit Price: ${price.toFixed(2)}</span>
                    </div>

                    {/* Quantity Selector buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal line cost */}
                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-1 w-full sm:w-24 shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 dark:border-slate-800">
                      <span className="text-xs text-gray-400 sm:hidden">Line Total</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">${(price * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors self-end sm:self-center"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>

                  </div>
                );
              })}
            </div>
            
            {/* Clear Cart trigger */}
            <div className="bg-gray-50 p-4 flex justify-between dark:bg-slate-800/30">
              <Link to="/books" className="text-xs font-semibold text-primary-500 hover:underline">
                Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-xs font-semibold text-gray-400 hover:text-red-500">
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Cart Summary & Coupons */}
        <div className="space-y-6">
          {/* Coupons Module */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-3 dark:border-slate-800">
              <Ticket className="h-4.5 w-4.5 text-primary-500" />
              <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Promo Coupon Code</h3>
            </div>
            
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-primary-50/50 border border-primary-100 p-3 text-xs text-primary-600 dark:bg-primary-950/20 dark:border-primary-900/50">
                <div className="space-y-0.5">
                  <span className="font-bold block">Coupon "{coupon.code}" Active</span>
                  <span className="text-3xs block text-primary-500/80">Saving ${discount.toFixed(2)}</span>
                </div>
                <button onClick={removeCoupon} className="text-3xs font-bold text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SAVE10, WELCOME20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={applying || !couponCode}
                    className="rounded-xl bg-gray-900 px-4 text-xs font-bold text-white hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && <span className="text-3xs text-red-500 block">{couponError}</span>}
              </form>
            )}
          </div>

          {/* Pricing Total Summary card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm border-b border-gray-50 pb-3 dark:border-slate-800">
              Order Summary
            </h3>
            
            <div className="space-y-3 text-xs text-gray-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal amount</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery fees</span>
                <span className="font-semibold text-green-500">FREE</span>
              </div>
              <div className="flex justify-between border-t border-gray-50 pt-3 dark:border-slate-800 text-sm font-bold text-gray-800 dark:text-white">
                <span>Total Cost</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft hover:bg-primary-600 transition-all hover:-translate-y-0.5"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-3xs text-gray-400 pt-2 border-t border-gray-50 dark:border-slate-800/50">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Secure checkout. Protected transactions.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
