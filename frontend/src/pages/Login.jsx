import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const isExpired = searchParams.get('expired') === 'true';
  const redirect = searchParams.get('redirect') || '/';

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);
    try {
      const loggedUser = await login(data.email, data.password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title Header */}
      <div className="text-center">
        <h2 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
        <p className="text-xs text-gray-400 mt-1.5">Sign in to continue to your BookVerse account</p>
      </div>

      {/* Alerts */}
      {isExpired && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Your session has expired. Please log in again.</span>
        </div>
      )}

      {authError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400 animate-shake">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-2xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">Email Address</label>
          <div className="relative">
            <input
              type="email"
              {...register('email', { 
                required: 'Email address is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && <span className="text-3xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-2xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">Password</label>
            <Link to="/forgot-password" className="text-3xs text-primary-500 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-11 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <span className="text-3xs text-red-500">{errors.password.message}</span>}
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-semibold text-white shadow-soft transition-all hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          {isSubmitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Sign In'}
        </button>

      </form>

      {/* Redirection Links */}
      <div className="text-center pt-2">
        <span className="text-xs text-gray-400">New to BookVerse? </span>
        <Link to="/signup" className="text-xs font-semibold text-primary-500 hover:underline">Create an Account</Link>
      </div>

    </div>
  );
};

export default Login;
