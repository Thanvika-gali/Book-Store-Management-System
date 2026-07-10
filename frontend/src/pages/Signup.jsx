import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setAuthError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Email is already in use or registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength checks
  const getPasswordStrength = () => {
    if (!password) return { text: '', color: 'bg-gray-200', percent: 'w-0' };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { text: 'Weak', color: 'bg-red-500', percent: 'w-1/4' };
      case 2:
        return { text: 'Fair', color: 'bg-orange-500', percent: 'w-1/2' };
      case 3:
        return { text: 'Good', color: 'bg-amber-500', percent: 'w-3/4' };
      case 4:
        return { text: 'Strong', color: 'bg-green-500', percent: 'w-full' };
      default:
        return { text: 'Weak', color: 'bg-red-500', percent: 'w-1/4' };
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      
      {/* Header Title */}
      <div className="text-center">
        <h2 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Create Account</h2>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">Join BookVerse to get reading goals and wishlists</p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-600 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {authError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-2xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">Full Name</label>
          <div className="relative">
            <input
              type="text"
              {...register('name', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.name && <span className="text-3xs text-red-500">{errors.name.message}</span>}
        </div>

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
              placeholder="john@example.com"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && <span className="text-3xs text-red-500">{errors.email.message}</span>}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <label className="text-2xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">Password</label>
          <div className="relative">
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="Min. 6 characters"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.password && <span className="text-3xs text-red-500">{errors.password.message}</span>}

          {/* Password strength indicators */}
          {password && (
            <div className="pt-2">
              <div className="flex justify-between items-center text-3xs text-gray-400 mb-1">
                <span>Password Strength:</span>
                <span className="font-semibold">{strength.text}</span>
              </div>
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-slate-800">
                <div className={`h-full ${strength.color} ${strength.percent} transition-all duration-300`} />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-semibold text-white shadow-soft transition-all hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          {isSubmitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Register'}
        </button>

      </form>

      {/* Redirection */}
      <div className="text-center pt-2">
        <span className="text-xs text-gray-400">Already registered? </span>
        <Link to="/login" className="text-xs font-semibold text-primary-500 hover:underline">Sign In</Link>
      </div>

    </div>
  );
};

export default Signup;
