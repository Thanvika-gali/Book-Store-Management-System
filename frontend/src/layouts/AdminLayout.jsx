import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Route security: Check auth state and admin authority
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 mb-5 dark:bg-red-950/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white mb-2">Access Denied</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
            You do not have administrative credentials to view this panel.
          </p>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-semibold text-white shadow-soft hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5"
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-slate-950 transition-colors duration-200 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Pane Navbar */}
        <header className="flex h-16 items-center justify-between px-8 bg-white border-b border-gray-100 shrink-0 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <span>Control Center</span>
            <span>/</span>
            <span className="text-gray-700 font-bold dark:text-slate-200 capitalize">
              {window.location.pathname.split('/').pop() || 'overview'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xs font-semibold bg-primary-50 text-primary-500 px-2.5 py-1 rounded-full dark:bg-primary-950/20">
              System Admin
            </span>
            <img
              src={user?.profilePicture}
              alt="admin-avatar"
              className="h-8.5 w-8.5 rounded-full object-cover shadow-sm"
            />
          </div>
        </header>

        {/* Scrollable Admin Content area */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
