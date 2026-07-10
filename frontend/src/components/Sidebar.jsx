import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, ShoppingBag, 
  Users, BarChart3, ChevronLeft, LogOut, Home 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Books', path: '/admin/books', icon: BookOpen },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders Queue', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-900 shrink-0">
      
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-gray-50 dark:border-slate-800/80">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-500 text-white">
          <BookOpen className="h-4.5 w-4.5" />
        </div>
        <span className="font-outfit font-bold text-gray-900 dark:text-white text-base">BookVerse Console</span>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-soft shadow-primary-500/20'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer Exit actions */}
      <div className="p-4 border-t border-gray-50 dark:border-slate-800/80 space-y-1.5">
        <Link
          to="/"
          className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Home className="h-4.5 w-4.5" />
          Customer Store
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-4.5 w-4.5" />
          Exit Session
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
