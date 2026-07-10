import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, Sparkles, BookHeart, Compass, ArrowRight, 
  BookOpen, Heart, Sparkle 
} from 'lucide-react';
import { CatalogSkeleton } from '../components/Skeleton';
import BookCard from '../components/BookCard';
import api from '../services/api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const trendRes = await api.get('/books/trending');
        const newRes = await api.get('/books/new-arrivals');
        const recRes = await api.get('/books/recommended');
        const catRes = await api.get('/categories');
        
        setTrending(trendRes.data);
        setNewArrivals(newRes.data);
        setRecommended(recRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Promo banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-950 px-6 py-20 text-white dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 sm:px-12 md:py-24">
        {/* Background Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkle className="h-3.5 w-3.5 text-amber-300 animate-spin" />
            <span>Discover The Magic of Reading</span>
          </div>
          
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto leading-tight">
            Explore Your Next Literary Adventure
          </h1>
          
          <p className="mx-auto max-w-xl text-sm sm:text-base text-gray-200/90 font-medium leading-relaxed">
            Browse through thousands of selected bestsellers, classic novels, educational textbooks, and curated exclusive releases.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/books"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-xs font-bold text-primary-500 shadow-soft hover:bg-gray-50 hover:scale-102 transition-all duration-200"
            >
              Browse Catalog
            </Link>
            <Link
              to="/books?discount=true"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-transparent border border-white/30 px-6 text-xs font-bold text-white hover:bg-white/10 transition-all duration-200"
            >
              Discount Deals
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Collections container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Category Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="h-5.5 w-5.5 text-primary-500" />
              <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Shop by Category</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((cat, idx) => {
              // Custom avatars as placeholder illustrations
              const seeds = ['fantasy', 'fiction', 'sci-fi', 'mystery', 'biography'];
              return (
                <Link
                  key={cat.id}
                  to={`/books?category=${cat.id}`}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-soft hover:-translate-y-1 hover:border-primary-100 hover:shadow-soft-lg transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 group-hover:scale-110 transition-transform duration-300 dark:bg-slate-800">
                    <img
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${seeds[idx % seeds.length]}&backgroundColor=transparent`}
                      alt={cat.name}
                      className="h-9 w-9 object-cover"
                    />
                  </div>
                  <h3 className="font-outfit font-bold text-gray-800 dark:text-slate-100 text-sm leading-snug">
                    {cat.name}
                  </h3>
                  <span className="text-3xs text-gray-400 mt-0.5">Explore Genre</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Trending Books section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="h-5.5 w-5.5 text-orange-500 fill-orange-500" />
              <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Trending Books</h2>
            </div>
            <Link to="/books?sort=popularity" className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:underline">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <CatalogSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {trending.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>

        {/* Recommended Books section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookHeart className="h-5.5 w-5.5 text-pink-500" />
              <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">Recommended For You</h2>
            </div>
            <Link to="/books?sort=rating" className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:underline">
              Explore More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <CatalogSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {recommended.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>

        {/* New Arrivals Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5.5 w-5.5 text-amber-500" />
              <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">New Arrivals</h2>
            </div>
            <Link to="/books?sort=newest" className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:underline">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <CatalogSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {newArrivals.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Home;
