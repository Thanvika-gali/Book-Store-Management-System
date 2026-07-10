import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      const response = await forgotPassword(data.email);
      setSuccessMsg(response.message || 'Reset link logged to Spring Boot console. Verify logs!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'We could not find an account linked to this email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="text-center">
        <h2 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Recover Password</h2>
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
          Enter your email address below. A simulated password recovery url will be printed to the Spring Boot console log.
        </p>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-start gap-2.5 rounded-xl bg-green-50 p-4.5 text-xs text-green-600 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div className="flex-1 space-y-1">
            <span className="font-semibold block">Simulated Link Generated</span>
            <span className="text-3xs leading-relaxed text-green-500/90 block">
              Look inside the IDE Spring Boot server console outputs for a reset link starting with: 
              <code>http://localhost:5173/reset-password?token=...</code>
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Forgot Form */}
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

        {/* Submit action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 text-xs font-semibold text-white shadow-soft transition-all hover:bg-primary-600 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          {isSubmitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : 'Request Link'}
        </button>

      </form>

      {/* Navigation Return */}
      <div className="text-center pt-2">
        <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-500 hover:underline">
          <ChevronLeft className="h-4 w-4" />
          Return to Sign In
        </Link>
      </div>

    </div>
  );
};

export default ForgotPassword;
