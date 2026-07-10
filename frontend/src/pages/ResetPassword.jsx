import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    if (!token) {
      setErrorMsg('Token parameter is missing in URL.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await resetPassword(token, data.newPassword);
      setSuccessMsg('Your password has been successfully reset! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid or expired reset token. Please request another reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-center">
        <h2 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Reset Password</h2>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          Create a new password below for your BookVerse account
        </p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-600 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!token && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>No reset token detected in address bar. Return to login and try again.</span>
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* New Password */}
        <div className="space-y-1">
          <label className="text-2xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">New Password</label>
          <div className="relative">
            <input
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="Min. 6 characters"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.newPassword && <span className="text-3xs text-red-500">{errors.newPassword.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-2xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">Confirm New Password</label>
          <div className="relative">
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (val) => val === newPassword || 'Passwords do not match'
              })}
              placeholder="Verify password"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-100"
            />
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
          {errors.confirmPassword && <span className="text-3xs text-red-500">{errors.confirmPassword.message}</span>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-semibold text-white shadow-soft transition-all hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          {isSubmitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Update Password'}
        </button>

      </form>

      {/* Return to Login */}
      <div className="text-center pt-2">
        <Link to="/login" className="text-xs font-semibold text-primary-500 hover:underline">Back to Login</Link>
      </div>

    </div>
  );
};

export default ResetPassword;
