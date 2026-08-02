import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, ArcElement, Tooltip, Legend 
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
  BookOpen, Clock, RefreshCw, Loader2, AlertCircle, 
  ArrowLeftRight, Calendar, User, Mail, DollarSign, Award
} from 'lucide-react';
import api from '../services/api';

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend);

const ManageLibrary = () => {
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      const loanRes = await api.get('/admin/library/active-loans');
      const statRes = await api.get('/admin/library/stats');
      setLoans(loanRes.data);
      setStats(statRes.data);
    } catch (err) {
      console.error('Error fetching library management data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBookAdmin = async (rentalId) => {
    if (!window.confirm('Mark this loan as returned? This will free the loan slot for the user.')) return;
    setReturningId(rentalId);
    try {
      await api.post(`/library/return/${rentalId}`);
      alert('Loan returned successfully.');
      fetchLibraryData();
    } catch (err) {
      console.error(err);
      alert('Failed to return loan.');
    } finally {
      setReturningId(null);
    }
  };

  const calculateDaysLeft = (dueDateString) => {
    const due = new Date(dueDateString);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading || !stats) {
    return (
      <div className="flex h-96 flex-col items-center justify-center dark:text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-2" />
        <span className="text-xs font-semibold text-gray-500">Compiling active library stats...</span>
      </div>
    );
  }

  // Active / Overdue loans list for admin
  const activeAndOverdue = loans.filter(l => l.status === 'ACTIVE' || l.status === 'OVERDUE');

  // Chart: Loans by Language
  const doughnutData = {
    labels: stats.loansByLanguage.map(l => l.language),
    datasets: [
      {
        data: stats.loansByLanguage.map(l => l.count),
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
        borderWidth: 1,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Library Loans Management</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Verify active rentals, follow up on overdue checkouts, and view language borrowing spreads</p>
        </div>
        <button
          onClick={fetchLibraryData}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-700 dark:border-slate-800 dark:bg-slate-900"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Active */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xs text-gray-400 uppercase tracking-wider block font-bold">Active Library Loans</span>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalActiveLoans}</span>
          </div>
        </div>

        {/* Total Overdue */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xs text-gray-400 uppercase tracking-wider block font-bold">Overdue Checkouts</span>
            <span className="text-2xl font-extrabold text-red-600">{stats.totalOverdueLoans}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xs text-gray-400 uppercase tracking-wider block font-bold">Accumulated Rentals Fees</span>
            <span className="text-2xl font-extrabold text-green-600">${stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Table & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table List of Active Loans */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider">Active & Overdue Checkouts</h3>
          
          {activeAndOverdue.length === 0 ? (
            <p className="text-3xs text-gray-400 font-medium py-12 text-center">No active loans or rentals in the library database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-3xs font-semibold">
                <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-4xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Book Title</th>
                    <th className="px-4 py-3">User Account</th>
                    <th className="px-4 py-3">Checkout Type</th>
                    <th className="px-4 py-3">Timeline</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {activeAndOverdue.map((loan) => {
                    const daysLeft = calculateDaysLeft(loan.dueDate);
                    const isOverdue = loan.status === 'OVERDUE' || daysLeft < 0;
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-800 dark:text-slate-100 block">{loan.bookTitle}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-700 dark:text-slate-300 block">{loan.userName}</span>
                          <span className="text-5xs text-gray-400 font-bold block">{loan.userEmail}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-5xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            loan.rentalType === 'BORROW' 
                              ? 'bg-green-50 text-green-600 dark:bg-green-950/20' 
                              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20'
                          }`}>
                            {loan.rentalType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-500 block">Due: {new Date(loan.dueDate).toLocaleDateString()}</span>
                          {isOverdue ? (
                            <span className="text-5xs text-red-500 font-bold block uppercase animate-pulse">Overdue! ({Math.abs(daysLeft)}d)</span>
                          ) : (
                            <span className="text-5xs text-primary-500 font-bold block uppercase">{daysLeft} days remaining</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            disabled={returningId === loan.id}
                            onClick={() => handleReturnBookAdmin(loan.id)}
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 px-3.5 text-4xs font-bold transition-all disabled:opacity-40"
                          >
                            {returningId === loan.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <ArrowLeftRight className="h-3.5 w-3.5" />
                            )}
                            Force Return
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Language Spread Doughnut Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-primary-500" />
              Loans by Language
            </h3>
            <div className="h-56">
              {stats.loansByLanguage.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-6 text-xs text-gray-400 font-medium">
                  No active loans to generate stats.
                </div>
              ) : (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ManageLibrary;
