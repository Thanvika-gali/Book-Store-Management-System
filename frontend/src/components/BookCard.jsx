import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookCard = ({ book, onWishlistToggle }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Check if book is wishlisted if user is authenticated
    const checkWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await api.get('/users/wishlist');
        const exists = response.data.some((item) => item.bookId === book.id);
        setIsWishlisted(exists);
      } catch (err) {
        console.error('Error checking wishlist status:', err);
      }
    };
    checkWishlist();
  }, [isAuthenticated, book.id]);

  const handleCartAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    try {
      await addToCart(book.id, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      await api.post(`/users/wishlist/${book.id}`);
      setIsWishlisted(!isWishlisted);
      if (onWishlistToggle) onWishlistToggle(book.id);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const originalPrice = book.price;
  const discountPrice = book.discountPrice;
  const hasDiscount = discountPrice > 0;
  const activePrice = hasDiscount ? discountPrice : originalPrice;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg dark:bg-slate-900 dark:border-slate-800">
      {/* Cover Image & Hover Actions */}
      <Link to={`/books/${book.id}`} className="relative block aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-slate-800">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400'}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Discount Badge */}
        {hasDiscount && book.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {book.discountPercentage}% OFF
          </span>
        )}
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 text-gray-500 hover:text-red-500 dark:bg-slate-800/90 dark:text-slate-400"
        >
          <Heart className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </Link>

      {/* Book Metadata */}
      <div className="flex flex-1 flex-col p-4.5">
        <span className="text-xs font-medium text-primary-500 uppercase tracking-wider mb-1">
          {book.category?.name || 'Catalog'}
        </span>
        <Link to={`/books/${book.id}`} className="block group-hover:text-primary-500 transition-colors">
          <h3 className="line-clamp-1 font-semibold text-gray-800 dark:text-slate-100 text-base leading-snug">
            {book.title}
          </h3>
        </Link>
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 mb-2 block">
          by {book.author?.name || 'Unknown Author'}
        </span>

        {/* Ratings Review Star */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(book.rating || 0) ? 'fill-current' : 'text-gray-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">
            {book.rating > 0 ? book.rating.toFixed(1) : 'New'}
          </span>
          <span className="text-2xs text-gray-400">
            ({book.reviewCount})
          </span>
        </div>

        {/* Footer Pricing & Buy */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800/50">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-2xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base font-bold text-gray-900 dark:text-white">
              ${activePrice.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleCartAdd}
            disabled={adding || book.stock === 0}
            className="flex h-9 items-center justify-center gap-2 rounded-xl bg-primary-500 px-3.5 text-xs font-semibold text-white shadow-soft transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {book.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
