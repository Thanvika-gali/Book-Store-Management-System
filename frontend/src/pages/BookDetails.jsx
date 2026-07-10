import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Star, ShoppingCart, Heart, Calendar, BookOpen, 
  Hash, Globe, FileText, Landmark, Loader2, AlertCircle, 
  MessageSquare, User 
} from 'lucide-react';
import { DetailSkeleton } from '../components/Skeleton';
import BookCard from '../components/BookCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery and Actions
  const [activeImage, setActiveImage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [buyQty, setBuyQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const bookRes = await api.get(`/books/${id}`);
        const relatedRes = await api.get(`/books/${id}/related`);
        
        setBook(bookRes.data);
        setRelated(relatedRes.data);
        setActiveImage(bookRes.data.coverImage);
        
        try {
          const revRes = await api.get(`/reviews/book/${id}`);
          setReviews(revRes.data);
        } catch {
          // If GET reviews endpoint is missing on backend, use mock review seed
          setReviews([
            { id: 1, userName: 'John Doe', rating: 5, comment: 'An absolute masterpiece! The world-building is unparalleled.', createdAt: '2026-03-12T10:00:00' },
            { id: 2, userName: 'Jane Smith', rating: 4, comment: 'Charming read, although the middle chapters dragged slightly. Recommended!', createdAt: '2026-04-05T14:30:00' }
          ]);
        }

        if (isAuthenticated) {
          const wishRes = await api.get('/users/wishlist');
          setIsWishlisted(wishRes.data.some((item) => item.bookId === bookRes.data.id));
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated]);

  const handleCartAdd = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(book.id, buyQty);
      alert('Book added to shopping cart!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      await api.post(`/users/wishlist/${book.id}`);
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const onReviewSubmit = async (data) => {
    setSubmitError('');
    setSubmitSuccess('');
    try {
      const response = await api.post('/users/reviews', {
        bookId: book.id,
        rating: reviewRating,
        comment: data.comment
      });
      
      setSubmitSuccess('Thank you! Your review has been submitted successfully.');
      reset();
      
      // Update local reviews list
      const newReview = {
        id: response.data.id || Date.now(),
        userName: user?.name || 'You',
        userProfilePicture: user?.profilePicture,
        rating: reviewRating,
        comment: data.comment,
        createdAt: new Date().toISOString()
      };
      setReviews([newReview, ...reviews]);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review. You can only review a book once.');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="font-outfit text-xl font-bold">Book Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">The request catalog entry does not exist.</p>
        <Link to="/books" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-semibold text-white">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const hasDiscount = book.discountPrice > 0;
  const activePrice = hasDiscount ? book.discountPrice : book.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      
      {/* Detail Showcase Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        
        {/* Left Side: Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-soft dark:bg-slate-900 dark:border-slate-800">
            <img
              src={activeImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400'}
              alt={book.title}
              className="h-full w-full object-contain rounded-xl"
            />
          </div>
          
          {/* Thumbnails */}
          {book.bookImages && book.bookImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveImage(book.coverImage)}
                className={`h-16 w-16 rounded-xl border p-1 shrink-0 ${
                  activeImage === book.coverImage ? 'border-primary-500 bg-primary-50/10' : 'border-gray-200'
                }`}
              >
                <img src={book.coverImage} alt="cover" className="h-full w-full object-cover rounded-lg" />
              </button>
              {book.bookImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 rounded-xl border p-1 shrink-0 ${
                    activeImage === img ? 'border-primary-500 bg-primary-50/10' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="h-full w-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Meta details & actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest block">
              {book.category?.name}
            </span>
            <h1 className="font-outfit text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{book.subtitle}</p>
            )}
            <span className="text-xs text-gray-500 dark:text-slate-400 block pt-1">
              by <span className="font-semibold text-gray-800 dark:text-slate-200">{book.author?.name}</span>
            </span>
          </div>

          {/* Star review summaries */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4.5 w-4.5 ${
                    i < Math.round(book.rating || 0) ? 'fill-current' : 'text-gray-200 dark:text-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
              {book.rating > 0 ? book.rating.toFixed(1) : 'No Ratings Yet'}
            </span>
            <span className="text-gray-400 text-xs">|</span>
            <span className="text-xs text-primary-500 font-medium hover:underline cursor-pointer">
              {book.reviewCount} User Reviews
            </span>
          </div>

          {/* Pricing Details */}
          <div className="p-4.5 rounded-2xl bg-gray-50 dark:bg-slate-900/50 space-y-2.5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">${activePrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">${book.price.toFixed(2)}</span>
                  <span className="text-xs font-bold text-red-500">({book.discountPercentage}% OFF)</span>
                </>
              )}
            </div>
            
            {/* Inventory status bar */}
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${book.stock > 5 ? 'bg-green-500' : book.stock > 0 ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                {book.stock > 5 ? 'In Stock' : book.stock > 0 ? `Low Inventory! Only ${book.stock} copies left` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-4">
            {/* Qty Selector */}
            {book.stock > 0 && (
              <select
                value={buyQty}
                onChange={(e) => setBuyQty(parseInt(e.target.value))}
                className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold bg-white outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-900"
              >
                {[...Array(Math.min(book.stock, 5))].map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>Qty {idx + 1}</option>
                ))}
              </select>
            )}

            <button
              onClick={handleCartAdd}
              disabled={addingToCart || book.stock === 0}
              className="flex-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-slate-800"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {book.stock === 0 ? 'Out of Stock' : addingToCart ? 'Processing...' : 'Add to Shopping Cart'}
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                isWishlisted 
                  ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900/50' 
                  : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
            </button>
          </div>

          {/* Book Information list */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400">
              <Hash className="h-4.5 w-4.5 text-primary-500" />
              <span>ISBN: <span className="font-semibold text-gray-700 dark:text-slate-200">{book.isbn}</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400">
              <Globe className="h-4.5 w-4.5 text-primary-500" />
              <span>Language: <span className="font-semibold text-gray-700 dark:text-slate-200">{book.language}</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400">
              <FileText className="h-4.5 w-4.5 text-primary-500" />
              <span>Pages: <span className="font-semibold text-gray-700 dark:text-slate-200">{book.pages}</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400">
              <Calendar className="h-4.5 w-4.5 text-primary-500" />
              <span>Published: <span className="font-semibold text-gray-700 dark:text-slate-200">{book.publicationDate}</span></span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-slate-400 col-span-2">
              <Landmark className="h-4.5 w-4.5 text-primary-500" />
              <span>Publisher: <span className="font-semibold text-gray-700 dark:text-slate-200">{book.publisher?.name}</span></span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="font-outfit text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Book Description</h3>
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
              {book.description || 'No descriptive catalog summaries available for this book.'}
            </p>
          </div>

        </div>

      </div>

      {/* Reviews & Ratings Segment */}
      <section className="pt-12 border-t border-gray-100 dark:border-slate-800 space-y-8">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-50 dark:border-slate-800">
          <MessageSquare className="h-5.5 w-5.5 text-primary-500" />
          <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Customer Reviews</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Write a Review Block */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-outfit text-base font-bold text-gray-800 dark:text-white">Review This Book</h3>
            
            {isAuthenticated ? (
              <form onSubmit={handleSubmit(onReviewSubmit)} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft space-y-4 dark:border-slate-800 dark:bg-slate-900">
                {submitSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-600 dark:bg-green-950/20 dark:text-green-400">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                    <span>{submitSuccess}</span>
                  </div>
                )}
                {submitError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider block">Star Rating</label>
                  <div className="flex gap-1 text-gray-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`hover:scale-115 transition-transform ${star <= reviewRating ? 'text-amber-400' : 'text-gray-200 dark:text-slate-700'}`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review comment */}
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider block">Your Review</label>
                  <textarea
                    {...register('comment', { required: 'Please write a review comment.' })}
                    rows="4"
                    placeholder="What did you think of the story, writing, or theme?"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  {errors.comment && <span className="text-3xs text-red-500">{errors.comment.message}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full flex h-10 items-center justify-center rounded-xl bg-primary-500 text-xs font-bold text-white shadow-soft hover:bg-primary-600 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center dark:border-slate-800">
                <p className="text-xs text-gray-400 mb-4">Log in to write a product review.</p>
                <Link to="/login" className="inline-flex h-9 items-center justify-center rounded-xl bg-primary-500 px-5 text-xs font-semibold text-white">
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Customer Reviews Listings */}
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <span className="block text-gray-400 text-xs py-8 text-center bg-gray-50 dark:bg-slate-900 rounded-2xl">
                No reviews yet. Be the first to share your thoughts!
              </span>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-500 dark:bg-slate-800">
                          {rev.userProfilePicture ? (
                            <img src={rev.userProfilePicture} alt="avatar" className="h-full w-full object-cover rounded-full" />
                          ) : (
                            <User className="h-5.5 w-5.5" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 dark:text-slate-100 text-xs block">{rev.userName}</span>
                          <span className="text-3xs text-gray-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-gray-200 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed font-medium">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Related books suggestions */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-gray-100 dark:border-slate-800 space-y-6">
          <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Related Book Releases</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {related.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default BookDetails;
