import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, ShoppingCart, Users, BookOpen, 
  AlertTriangle, ArrowRight, Loader2, RefreshCw 
} from 'lucide-react';
import api from '../services/api';
import { AnalyticsSkeleton } from '../components/Skeleton';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/analytics');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (!stats) {
    return (
      <div className="text-center py-16 dark:text-slate-400">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="font-outfit text-xl font-bold">Analytics Load Error</h2>
        <p className="text-xs text-gray-500 mt-2">Could not connect to the system database.</p>
        <button onClick={fetchDashboardStats} className="mt-4 inline-flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, desc: 'Completed sales', icon: DollarSign, color: 'bg-green-50 text-green-500 dark:bg-green-950/20' },
    { name: 'Fulfill Orders', value: stats.totalOrders, desc: 'Incoming order queues', icon: ShoppingCart, color: 'bg-primary-50 text-primary-500 dark:bg-primary-950/20' },
    { name: 'Registered Users', value: stats.totalCustomers, desc: 'Customer portfolios', icon: Users, color: 'bg-purple-50 text-purple-500 dark:bg-purple-950/20' },
    { name: 'Total Books Sold', value: stats.totalBooksSold, desc: 'Sales volumes', icon: BookOpen, color: 'bg-amber-50 text-amber-500 dark:bg-amber-950/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Console Overview</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Real-time bookstore transaction details and analytics</p>
        </div>
        <button onClick={fetchDashboardStats} className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-700 dark:border-slate-800 dark:bg-slate-900">
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft hover:-translate-y-0.5 transition-transform dark:border-slate-800 dark:bg-slate-900">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-3xs font-semibold text-gray-400 uppercase tracking-wider block">{c.name}</span>
                  <span className="text-2xl font-extrabold text-gray-800 dark:text-white block">{c.value}</span>
                  <span className="text-4xs text-gray-400 block">{c.desc}</span>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${c.color}`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inner Panels layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Recent Orders table list */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft lg:col-span-2 dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3 dark:border-slate-800">
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Recent Incoming Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-primary-500 hover:underline flex items-center gap-1">
              Fulfillment queue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-3xs font-bold dark:border-slate-800">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3 text-right">Amount</th>
                  <th className="py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {stats.recentOrders?.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/20">
                    <td className="py-3 font-bold text-gray-800 dark:text-slate-200"># {o.id}</td>
                    <td className="py-3 text-gray-600 dark:text-slate-400">{o.customerName}</td>
                    <td className="py-3 text-right font-bold text-gray-800 dark:text-slate-200">${o.finalAmount.toFixed(2)}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-4xs font-bold bg-primary-50 text-primary-500 dark:bg-primary-950/20">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alerts panel */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3 dark:border-slate-800">
            <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Low Stock Alert</h3>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-slate-800/50 space-y-3.5">
            {stats.lowStockBooks?.length === 0 ? (
              <span className="block text-gray-400 text-xs py-4 text-center">All inventory thresholds look healthy!</span>
            ) : (
              stats.lowStockBooks?.map((b) => (
                <div key={b.id} className="flex gap-3 items-center pt-3.5 first:pt-0">
                  <img src={b.coverImage} alt={b.title} className="h-10 w-7.5 object-cover rounded border border-gray-100 dark:border-slate-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-gray-800 dark:text-slate-200 block truncate">{b.title}</span>
                    <span className="text-3xs text-red-500 font-semibold block mt-0.5">Only {b.stock} copies remaining</span>
                  </div>
                  <Link
                    to={`/admin/books?id=${b.id}`}
                    className="rounded-lg bg-gray-50 hover:bg-gray-100 text-3xs font-semibold px-2.5 py-1.5 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                  >
                    Restock
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
