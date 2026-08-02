import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, RefreshCw, Loader2, AlertCircle, 
  ArrowLeftRight, Calendar, Bookmark, CheckCircle, Info
} from 'lucide-react';
import api from '../services/api';
import BookExcerptReaderModal from '../components/BookExcerptReaderModal';

const Library = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  // E-book reader state
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    fetchLibraryBooks();
  }, []);

  const fetchLibraryBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/library/my-books');
      setRentals(response.data);
    } catch (err) {
      console.error('Error fetching library checkouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (rentalId) => {
    if (!window.confirm('Are you sure you want to return this book to the library?')) return;
    setReturningId(rentalId);
    try {
      await api.post(`/library/return/${rentalId}`);
      alert('Book returned successfully! Thank you.');
      fetchLibraryBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to return book.');
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

  const getDaysLeftTag = (days) => {
    if (days < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-extrabold uppercase tracking-wide text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">
          Overdue
        </span>
      );
    } else if (days === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-extrabold uppercase tracking-wide text-orange-500 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-full animate-pulse">
          Expires Today
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-3xs font-extrabold uppercase tracking-wide text-primary-500 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-full">
          {days} {days === 1 ? 'day' : 'days'} left
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center dark:text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-2" />
        <span className="text-xs font-semibold text-gray-500">Syncing borrowed books database...</span>
      </div>
    );
  }

  // Filter only active or overdue checkouts to show prominently
  const activeLoans = rentals.filter(r => r.status === 'ACTIVE' || r.status === 'OVERDUE');
  const pastLoans = rentals.filter(r => r.status === 'RETURNED');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">My Digital Library</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Read borrowed items, renew subscriptions, and inspect rental timelines</p>
        </div>
        <button
          onClick={fetchLibraryBooks}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-700 dark:border-slate-800 dark:bg-slate-900"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Active Borrowed Books Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <BookOpen className="h-4.5 w-4.5 text-primary-500" />
          Active Checkouts & Rentals
        </h2>

        {activeLoans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-slate-800 p-12 text-center text-gray-400 space-y-3">
            <Info className="h-10 w-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-gray-600 dark:text-slate-300">No Active Library Books</h3>
            <p className="text-4xs max-w-sm mx-auto font-medium">
              You haven't borrowed or rented any books yet. Browse the catalog to borrow or rent literature!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeLoans.map((loan) => {
              const daysLeft = calculateDaysLeft(loan.dueDate);
              return (
                <div 
                  key={loan.id} 
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img 
                      src={loan.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=150'} 
                      alt={loan.bookTitle} 
                      className="h-24 w-18 object-cover rounded-lg border dark:border-slate-800 shrink-0" 
                    />
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <span className={`text-4xs font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                            loan.rentalType === 'BORROW' 
                              ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' 
                              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                          }`}>
                            {loan.rentalType}
                          </span>
                          {getDaysLeftTag(daysLeft)}
                        </div>

                        <h3 className="text-xs font-extrabold text-gray-800 dark:text-slate-100 leading-snug line-clamp-2 truncate">
                          {loan.bookTitle}
                        </h3>
                        <span className="text-4xs text-gray-400 font-bold block mt-0.5">by {loan.authorName}</span>
                      </div>

                      <div className="text-5xs text-gray-400 font-semibold space-y-0.5 pt-2">
                        <span className="block flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary-500" />
                          Due: {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-50 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedBook(loan);
                        setShowReader(true);
                      }}
                      className="flex h-8.5 items-center justify-center gap-1.5 rounded-xl bg-primary-500 text-3xs font-bold text-white shadow-soft hover:bg-primary-600 cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Read Book
                    </button>
                    
                    <button
                      disabled={returningId === loan.id}
                      onClick={() => handleReturnBook(loan.id)}
                      className="flex h-8.5 items-center justify-center gap-1.5 rounded-xl border border-gray-200 text-3xs font-bold text-gray-600 hover:bg-gray-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                    >
                      {returningId === loan.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                      )}
                      Return Loan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Borrowing History */}
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Clock className="h-4.5 w-4.5 text-primary-500" />
          Borrowing History
        </h2>

        {pastLoans.length === 0 ? (
          <p className="text-4xs text-gray-400 font-medium py-4 text-center">No completed borrowing records.</p>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-3xs font-semibold">
                <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-4xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Book Title</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Borrowed On</th>
                    <th className="px-5 py-3">Returned On</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {pastLoans.map((history) => (
                    <tr key={history.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-3 font-bold text-gray-800 dark:text-slate-200">{history.bookTitle}</td>
                      <td className="px-5 py-3">
                        <span className="text-4xs font-bold text-gray-400 uppercase">{history.rentalType}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(history.startedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {history.returnedAt ? new Date(history.returnedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 text-4xs font-bold text-green-500">
                          <CheckCircle className="h-3 w-3" />
                          Returned
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Bound Preview Reader Modal */}
      {selectedBook && (
        <BookExcerptReaderModal
          isOpen={showReader}
          onClose={() => {
            setShowReader(false);
            setSelectedBook(null);
          }}
          bookId={selectedBook.bookId}
          bookTitle={selectedBook.bookTitle}
        />
      )}

    </div>
  );
};

export default Library;
