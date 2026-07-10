import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Truck, Calendar, CreditCard, 
  Download, ArrowRight, Loader2, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDownloadInvoice = async (orderId) => {
    setDownloadingId(orderId);
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      // Create blob link to download
      const file = new Blob([response.data], { type: 'text/plain' });
      const fileURL = URL.createObjectURL(file);
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', `invoice-${orderId}.txt`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      case 'PROCESSING': return 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400';
      case 'SHIPPED': return 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400';
      case 'DELIVERED': return 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400';
      case 'CANCELLED': return 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400';
      default: return 'bg-gray-50 text-gray-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getFulfillmentPercent = (status) => {
    switch (status) {
      case 'PENDING': return 'w-1/4';
      case 'PROCESSING': return 'w-1/2';
      case 'SHIPPED': return 'w-3/4';
      case 'DELIVERED': return 'w-full';
      case 'CANCELLED': return 'w-0';
      default: return 'w-0';
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center dark:text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 mb-6 dark:bg-slate-800">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="font-outfit text-xl font-bold text-gray-800 dark:text-white">No Orders Placed Yet</h2>
        <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto leading-relaxed">
          You haven't placed any orders in BookVerse yet. When you complete a purchase, it will appear here.
        </p>
        <Link to="/books" className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary-500 px-6 text-xs font-semibold text-white">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <h1 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Order Tracker</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-gray-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            
            {/* Order Meta Header */}
            <div className="bg-gray-50/50 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:bg-slate-800/30 dark:border-slate-800">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-3xs font-semibold uppercase tracking-wider block">Order Reference</span>
                  <span className="font-bold text-gray-800 dark:text-slate-200"># {order.id}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-3xs font-semibold uppercase tracking-wider block">Placed On</span>
                  <span className="font-medium text-gray-600 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-3xs font-semibold uppercase tracking-wider block">Total Amount</span>
                  <span className="font-bold text-gray-800 dark:text-white">${order.finalAmount.toFixed(2)}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-3xs font-semibold uppercase tracking-wider block">Payment Method</span>
                  <span className="font-medium text-gray-600 dark:text-slate-300 flex items-center gap-1 uppercase">
                    <CreditCard className="h-3.5 w-3.5" />
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-slate-800">
                <span className={`px-3 py-1 rounded-full text-3xs font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                
                <button
                  onClick={() => handleDownloadInvoice(order.id)}
                  disabled={downloadingId === order.id}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  {downloadingId === order.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  Invoice
                </button>
              </div>
            </div>

            {/* Tracking Status bar */}
            {order.status !== 'CANCELLED' && (
              <div className="p-5 border-b border-gray-50 dark:border-slate-800/50 space-y-3">
                <div className="flex justify-between items-center text-3xs text-gray-400 font-semibold uppercase tracking-wider">
                  <span>Pending</span>
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-slate-800">
                  <div className={`h-full bg-primary-500 ${getFulfillmentPercent(order.status)} transition-all duration-500`} />
                </div>
              </div>
            )}

            {/* Order Items list */}
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50 p-5 space-y-4">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="flex gap-4 items-center pt-4 first:pt-0">
                  <img src={item.bookCoverImage} alt={item.bookTitle} className="h-14 w-10 object-cover rounded border border-gray-100 dark:border-slate-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-gray-800 dark:text-slate-100 block truncate">{item.bookTitle}</span>
                    <span className="text-3xs text-gray-400 block mt-0.5">Quantity: {item.quantity} &bull; Sold at: ${item.price.toFixed(2)}</span>
                  </div>
                  <Link
                    to={`/books/${item.bookId}`}
                    className="inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-gray-100 px-2.5 text-3xs font-semibold text-gray-500 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    View book
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Orders;
