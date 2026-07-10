import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Eye, Loader2, ArrowUpDown, 
  ChevronLeft, ChevronRight, Edit3, Download 
} from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import api from '../services/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Status modification state
  const [updatingId, setUpdatingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders page
      const response = await api.get(`/admin/orders?page=${currentPage}&size=8`);
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status?status=${newStatus}`);
      // Update local state list
      setOrders(orders.map(o => o.id === orderId ? response.data : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    setDownloadingId(orderId);
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'text/plain' });
      const fileURL = URL.createObjectURL(file);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', `invoice-${orderId}.txt`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      case 'PROCESSING': return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400';
      case 'SHIPPED': return 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400';
      case 'DELIVERED': return 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400';
      case 'CANCELLED': return 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400';
      default: return 'bg-gray-50 text-gray-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Fulfillment Queue</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">Verify customer transactions and update order delivery progress</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl shadow-soft dark:bg-slate-900 dark:border-slate-800">
          No orders have been placed in the bookstore.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-3xs font-bold dark:border-slate-800">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Transaction Date</th>
                  <th className="py-4 px-6 text-right">Price Charged</th>
                  <th className="py-4 px-6 text-center">Fulfillment Status</th>
                  <th className="py-4 px-6 text-center">Receipt Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-6 font-bold text-gray-800 dark:text-slate-200"># {o.id}</td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-gray-850 dark:text-slate-350">{o.customerName}</span>
                        <span className="text-4xs text-gray-400 block">{o.customerEmail}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900 dark:text-white">${o.finalAmount.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {updatingId === o.id ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin text-primary-500" />
                        ) : (
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`rounded-full px-3 py-1 font-bold text-3xs outline-none border-none cursor-pointer transition-colors ${getStatusStyle(o.status)}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDownloadInvoice(o.id)}
                        disabled={downloadingId === o.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                      >
                        {downloadingId === o.id ? (
                          <Loader2 className="h-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paging footer */}
          {totalPages > 1 && (
            <div className="bg-gray-50/50 p-4 border-t border-gray-150 flex items-center justify-between dark:bg-slate-800/30 dark:border-slate-800">
              <span className="text-3xs text-gray-400">Showing page {currentPage + 1} of {totalPages}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ManageOrders;
