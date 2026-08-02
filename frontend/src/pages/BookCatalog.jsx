import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, ArrowUpDown, ChevronLeft, ChevronRight, 
  HelpCircle, Sparkles, BookOpen 
} from 'lucide-react';
import { CatalogSkeleton } from '../components/Skeleton';
import BookCard from '../components/BookCard';
import api from '../services/api';

const BookCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search States derived from searchParams
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = parseInt(searchParams.get('page') || '0');
  const searchKeyword = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const language = searchParams.get('language') || '';
  const onlyDiscounted = searchParams.get('discount') === 'true';
  const sortBy = searchParams.get('sort') || 'newest,desc';

  // Input states for smooth price typing (synchronized on blur/enter or reset)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Synchronize price input states when searchParams changes (e.g. on reset)
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch catalog books whenever search criteria or filters mutate
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('size', '8');
        params.append('sort', sortBy);
        
        if (searchKeyword) params.append('keyword', searchKeyword);
        if (selectedCategory) params.append('categoryId', selectedCategory);
        
        const minPriceParam = searchParams.get('minPrice') || '';
        const maxPriceParam = searchParams.get('maxPrice') || '';
        if (minPriceParam) params.append('minPrice', minPriceParam);
        if (maxPriceParam) params.append('maxPrice', maxPriceParam);
        
        if (language) params.append('language', language);
        if (onlyDiscounted) params.append('discount', 'true');

        const response = await api.get(`/books?${params.toString()}`);
        setBooks(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCatalog();
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleLanguageChange = (lang) => {
    const newParams = new URLSearchParams(searchParams);
    if (lang) {
      newParams.set('language', lang);
    } else {
      newParams.delete('language');
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleDiscountChange = (checked) => {
    const newParams = new URLSearchParams(searchParams);
    if (checked) {
      newParams.set('discount', 'true');
    } else {
      newParams.delete('discount');
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handlePriceApply = (type, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (type === 'min') {
      if (val) newParams.set('minPrice', val);
      else newParams.delete('minPrice');
    } else {
      if (val) newParams.set('maxPrice', val);
      else newParams.delete('maxPrice');
    }
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handlePriceReset = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortVal) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortVal);
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-50 dark:border-slate-800">
              <Filter className="h-4.5 w-4.5 text-primary-500" />
              <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Filters</h3>
            </div>

            {/* Category Filter */}
            <div className="space-y-3 mb-6">
              <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider">Book Category</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="radio"
                    checked={selectedCategory === ''}
                    onChange={() => handleCategoryChange('')}
                    className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>All Categories</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedCategory === cat.id.toString()}
                      onChange={() => handleCategoryChange(cat.id.toString())}
                      className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 mb-6">
              <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider">Price Bounds ($)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  onBlur={() => handlePriceApply('min', minPrice)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePriceApply('min', minPrice)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  onBlur={() => handlePriceApply('max', maxPrice)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePriceApply('max', maxPrice)}
                  className="w-full rounded-xl border border-gray-200 p-2 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>
              {(minPrice || maxPrice) && (
                <button onClick={handlePriceReset} className="text-3xs text-primary-500 font-medium hover:underline">
                  Reset price bounds
                </button>
              )}
            </div>

            {/* Language Filter */}
            <div className="space-y-3 mb-6">
              <span className="text-2xs font-semibold text-gray-400 uppercase tracking-wider">Language</span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Telugu">Telugu</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            {/* Promotions Deal Filter */}
            <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-slate-800">
              <label className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => handleDiscountChange(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>Discount Offers Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Right Column Catalog grid */}
        <section className="flex-1 space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-white border border-gray-100 p-4 shadow-soft dark:bg-slate-900 dark:border-slate-800">
            <div>
              <h2 className="font-outfit text-base font-bold text-gray-800 dark:text-white">
                {searchKeyword ? `Results for "${searchKeyword}"` : 'Explore Catalogue'}
              </h2>
              <span className="text-3xs text-gray-400">Page {currentPage + 1} of {totalPages || 1}</span>
            </div>
            
            {/* Sorting actions */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-xl border border-gray-200 p-2 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
              >
                <option value="newest,desc">Newest Releases</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="rating,desc">Highest Customer Rated</option>
                <option value="popularity,desc">Popularity</option>
              </select>
            </div>
          </div>

          {/* Cards Catalog */}
          {loading ? (
            <CatalogSkeleton count={8} />
          ) : books.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center p-16 rounded-2xl border border-gray-100 bg-white shadow-soft dark:bg-slate-900 dark:border-slate-800">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-5 dark:bg-slate-800">
                <HelpCircle className="h-7 w-7" />
              </div>
              <h3 className="font-outfit text-lg font-bold text-gray-800 dark:text-white mb-2">No Matching Results</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm leading-relaxed mb-6">
                We couldn't find any books matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                }}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-semibold text-white hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {/* Pagination controls footer */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 dark:border-slate-800 dark:bg-slate-900 dark:disabled:bg-slate-950"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  {[...Array(totalPages)].map((_, pageIdx) => (
                    <button
                      key={pageIdx}
                      onClick={() => handlePageChange(pageIdx)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold ${
                        currentPage === pageIdx
                          ? 'bg-primary-500 text-white'
                          : 'border border-gray-200 bg-white hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                    >
                      {pageIdx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 dark:border-slate-800 dark:bg-slate-900 dark:disabled:bg-slate-950"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              )}
            </>
          )}

        </section>

      </div>
    </div>
  );
};

export default BookCatalog;
