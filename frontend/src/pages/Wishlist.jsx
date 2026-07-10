import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, BookOpen } from 'lucide-react';
import BookCard from '../components/BookCard';
import api from '../services/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/users/wishlist');
      // The backend returns a list of WishlistDto: id, bookId, bookTitle, bookPrice, bookDiscountPrice, bookCoverImage.
      // To display them, we can fetch their complete details, or we can transform the WishlistDto to look like a Book object for BookCard!
      // This is a very elegant solution!
      const mappedBooks = response.data.map(item => ({
        id: item.bookId,
        title: item.bookTitle,
        price: item.bookPrice,
        discountPrice: item.bookDiscountPrice,
        coverImage: item.bookCoverImage,
        rating: 4.8, // Fallback rating for card visual
        reviewCount: 12
      }));
      setWishlist(mappedBooks);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (bookId) => {
    // When wish icon is clicked inside BookCard, remove it from list
    setWishlist(wishlist.filter(book => book.id !== bookId));
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-6 dark:bg-slate-800">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
          You haven't liked any books yet. Keep browsing to build your reading wishlist!
        </p>
        <Link to="/books" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-semibold text-white">
          Explore Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-slate-800">
        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        <h1 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">My Wishlist</h1>
        <span className="text-3xs text-gray-400 font-semibold bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-full">{wishlist.length} Items</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 animate-fade-in">
        {wishlist.map((book) => (
          <BookCard key={book.id} book={book} onWishlistToggle={handleWishlistToggle} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
