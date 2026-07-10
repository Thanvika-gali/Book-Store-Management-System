import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to homepage
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-slate-950">
      
      {/* Brand Logo header */}
      <div className="flex items-center gap-2 text-primary-500 mb-8 select-none">
        <BookOpen className="h-8 w-8 stroke-[2.5]" />
        <span className="font-outfit text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Book<span className="text-primary-500">Verse</span>
        </span>
      </div>

      {/* Auth outlets */}
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-soft-lg dark:border-slate-800/80 dark:bg-slate-900">
        <Outlet />
      </div>

    </div>
  );
};

export default AuthLayout;
