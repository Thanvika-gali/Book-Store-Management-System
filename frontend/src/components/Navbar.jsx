import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Search, LogOut, User, BookOpen, 
  Heart, ChevronDown, Bell, Sun, Moon, Grid, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const suggestionRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Fetch Categories & Notifications
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);
        
        if (isAuthenticated) {
          const notifRes = await api.get('/users/notifications');
          setNotifications(notifRes.data.filter(n => !n.isRead));
        }
      } catch (err) {
        console.error('Error fetching navbar metadata:', err);
      }
    };
    fetchNavbarData();
  }, [isAuthenticated]);

  // Suggestions API fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await api.get(`/books/suggestions?query=${searchQuery}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/books?search=${encodeURIComponent(suggestion)}`);
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await api.put('/users/notifications/read');
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 text-primary-500 shrink-0">
            <BookOpen className="h-7 w-7 stroke-[2.5]" />
            <span className="font-outfit text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Book<span className="text-primary-500">Verse</span>
            </span>
          </Link>

          {/* Catalog Mega Dropdown */}
          <div className="relative hidden md:block group shrink-0">
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
              <Grid className="h-4 w-4" />
              Categories
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-soft-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 dark:border-slate-800 dark:bg-slate-900">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/books?category=${cat.id}`}
                  className="block rounded-xl px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-primary-50 hover:text-primary-500 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Inputs */}
          <form onSubmit={handleSearchSubmit} ref={suggestionRef} className="relative flex-1 max-w-lg hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by book name, author, publisher, ISBN..."
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-11 text-xs outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:bg-slate-900"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-gray-400 hover:text-primary-500 dark:text-slate-500">
                <Search className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Suggestions Overlay */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Search className="h-3.5 w-3.5 text-gray-400" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 dark:hover:bg-slate-800 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist Icon */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 dark:hover:bg-slate-800 dark:text-slate-400"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 dark:hover:bg-slate-800 dark:text-slate-400"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-3xs font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 dark:hover:bg-slate-800 dark:text-slate-400"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-primary-500"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-3 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-50 dark:border-slate-800">
                      <span className="text-xs font-semibold text-gray-800 dark:text-slate-200">Notifications</span>
                      {notifications.length > 0 && (
                        <button onClick={handleMarkNotificationsRead} className="text-3xs font-medium text-primary-500 hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <span className="block text-center py-4 text-xs text-gray-400">No new notifications</span>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                            <h4 className="text-xs font-bold text-gray-800 dark:text-slate-100 leading-snug">{notif.title}</h4>
                            <p className="text-3xs text-gray-500 dark:text-slate-400 leading-tight mt-0.5">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 focus:outline-none"
                >
                  <img
                    src={user?.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
                    alt="avatar"
                    className="h-9 w-9 rounded-full bg-gray-100 object-cover shadow-sm border border-gray-100 dark:border-slate-800"
                  />
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-soft-lg dark:border-slate-800 dark:bg-slate-900">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-800/80 mb-1">
                      <span className="block text-xs font-bold text-gray-800 dark:text-white truncate">{user?.name}</span>
                      <span className="block text-3xs text-gray-400 truncate">{user?.email}</span>
                    </div>

                    {/* Admin Access Panel */}
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-slate-800/50"
                      >
                        <ShieldAlert className="h-4.5 w-4.5" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <User className="h-4.5 w-4.5" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <BookOpen className="h-4.5 w-4.5" />
                      Order History
                    </Link>

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex h-9 items-center justify-center rounded-xl bg-primary-500 px-4.5 text-xs font-semibold text-white shadow-soft transition-colors hover:bg-primary-600"
              >
                Log In
              </Link>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
