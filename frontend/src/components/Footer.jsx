import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white pt-16 pb-8 transition-colors dark:border-slate-800/80 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
          
          {/* Logo Brand section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-primary-500">
              <BookOpen className="h-6 w-6 stroke-[2.5]" />
              <span className="font-outfit text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Book<span className="text-primary-500">Verse</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              BookVerse is a premium online bookstore management system featuring catalog browsing, smart search recommendations, and order fullfilment tracking.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 dark:text-slate-400">
              <li><Link to="/books" className="hover:text-primary-500">All Books</Link></li>
              <li><Link to="/books?discount=true" className="hover:text-primary-500">Promo Discount Deals</Link></li>
              <li><Link to="/books?sort=newest" className="hover:text-primary-500">New Arrivals</Link></li>
              <li><Link to="/books?sort=rating" className="hover:text-primary-500">Customer Favorites</Link></li>
            </ul>
          </div>

          {/* User Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider mb-4">Customer Account</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 dark:text-slate-400">
              <li><Link to="/profile" className="hover:text-primary-500">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-primary-500">Order Tracker</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-500">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-primary-500">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3.5 text-xs text-gray-500 dark:text-slate-400">
            <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider mb-4">Get In Touch</h4>
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
              <span>1745 Broadway, New York, NY 10019</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-primary-500 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-primary-500 shrink-0" />
              <span>support@bookverse.com</span>
            </div>
          </div>

        </div>

        {/* Copyright and GitHub Link */}
        <div className="pt-8 border-t border-gray-50 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-2xs text-gray-400">&copy; {new Date().getFullYear()} BookVerse. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
