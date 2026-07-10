import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Download, Calendar, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import api from '../services/api';

// Register ChartJS modules
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend
);

const Analytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [mostSold, setMostSold] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingReport, setExportingReport] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const revRes = await api.get('/admin/monthly-revenue');
      const soldRes = await api.get('/admin/most-sold');
      setRevenueData(revRes.data);
      setMostSold(soldRes.data);
    } catch (err) {
      console.error('Error fetching analytics charts data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExportingReport(true);
    try {
      const response = await api.get('/admin/sales-report', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Error exporting CSV sales report.');
    } finally {
      setExportingReport(false);
    }
  };

  // 1. Line Chart Data (Monthly Revenue)
  const lineChartData = {
    labels: revenueData.map((r) => r.month),
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: revenueData.map((r) => r.revenue),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#4f46e5',
      },
    ],
  };

  // 2. Bar Chart Data (Top Sellers Volume)
  const barChartData = {
    labels: mostSold.slice(0, 5).map((b) => b.title.substring(0, 15) + '...'),
    datasets: [
      {
        label: 'Copies Sold',
        data: mostSold.slice(0, 5).map((b) => b.quantitySold),
        backgroundColor: '#f59e0b',
        borderRadius: 8,
      },
    ],
  };

  // 3. Doughnut Chart (Sales Distribution share)
  const doughnutChartData = {
    labels: mostSold.slice(0, 3).map((b) => b.title.substring(0, 12) + '...'),
    datasets: [
      {
        label: 'Revenue Generated ($)',
        data: mostSold.slice(0, 3).map((b) => b.revenueGenerated),
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Sales & Revenue Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Verify sales records and download detailed transaction worksheets</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={fetchAnalyticsData} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-700 dark:border-slate-800 dark:bg-slate-900">
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={exportingReport}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-5 text-xs font-bold text-white hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {exportingReport ? (
              <Loader2 className="h-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV Worksheet
          </button>
        </div>
      </div>

      {/* Graphical Dashboard Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm mb-4">Monthly Income Aggregates</h3>
          <div className="h-72">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm mb-4">Top Sellers Income Share ($)</h3>
          <div className="h-72 flex justify-center">
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm mb-4">Most Popular Releases by Sales Volume</h3>
          <div className="h-80">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
