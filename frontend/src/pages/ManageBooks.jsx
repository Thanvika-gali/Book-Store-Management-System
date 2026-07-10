import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, Edit, Trash2, Search, X, Loader2, 
  Upload, AlertCircle, Sparkles, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import api from '../services/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Dropdown Metadata lists
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // Modal Control
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [modalError, setModalError] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchKeyword]);

  const fetchMetadata = async () => {
    try {
      const catRes = await api.get('/categories');
      const authRes = await api.get('/authors');
      const pubRes = await api.get('/publishers');
      setCategories(catRes.data);
      setAuthors(authRes.data);
      setPublishers(pubRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/books?page=${currentPage}&size=6&keyword=${searchKeyword}`);
      setBooks(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book from the catalog?')) return;
    try {
      await api.delete(`/admin/books/${bookId}`);
      setBooks(books.filter((b) => b.id !== bookId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting book.');
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
    setModalError('');
    setValue('title', book.title);
    setValue('subtitle', book.subtitle || '');
    setValue('isbn', book.isbn);
    setValue('authorId', book.author?.id);
    setValue('publisherId', book.publisher?.id);
    setValue('categoryId', book.category?.id);
    setValue('language', book.language);
    setValue('price', book.price);
    setValue('discountPrice', book.discountPrice || 0);
    setValue('discountPercentage', book.discountPercentage || 0);
    setValue('stock', book.stock);
    setValue('pages', book.pages);
    setValue('publicationDate', book.publicationDate);
    setValue('coverImage', book.coverImage);
    setValue('description', book.description || '');
    setShowModal(true);
  };

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setModalError('');
    reset({
      title: '', subtitle: '', isbn: '', authorId: '', publisherId: '',
      categoryId: '', language: 'English', price: '', discountPrice: 0,
      discountPercentage: 0, stock: '', pages: '', publicationDate: '',
      coverImage: '', description: ''
    });
    setShowModal(true);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCover(true);
    setModalError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setValue('coverImage', response.data.url);
    } catch (err) {
      setModalError('Could not upload cover image.');
    } finally {
      setUploadingCover(false);
    }
  };

  const onFormSubmit = async (data) => {
    setModalError('');
    
    // Ensure discount price logic is consistent
    if (parseFloat(data.discountPrice) > parseFloat(data.price)) {
      setModalError('Discount price cannot exceed the original price.');
      return;
    }

    try {
      if (editingBook) {
        // Edit Book API
        await api.put(`/admin/books/${editingBook.id}`, data);
      } else {
        // Add Book API
        await api.post('/admin/books', data);
      }
      setShowModal(false);
      reset();
      fetchBooks();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error processing book details.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Books Catalogue</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Create, update, and manage products inside catalog database</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary-500 px-5 text-xs font-bold text-white shadow-soft hover:bg-primary-600 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Catalog Entry
        </button>
      </div>

      {/* Searching filters */}
      <div className="flex items-center gap-3 max-w-md rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4.5 w-4.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search catalog by title, isbn, author..."
          value={searchKeyword}
          onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(0); }}
          className="w-full text-xs outline-none bg-transparent text-gray-800 dark:text-slate-100"
        />
      </div>

      {/* Database Catalog Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : books.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-soft dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
          No books found matching search terms.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-3xs font-bold dark:border-slate-800">
                  <th className="py-4 px-6">Book Details</th>
                  <th className="py-4 px-6">ISBN Code</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-center">Stock</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={b.coverImage} alt={b.title} className="h-12 w-9 object-cover rounded border border-gray-100 dark:border-slate-800" />
                        <div className="min-w-0">
                          <span className="font-bold text-gray-850 dark:text-slate-100 truncate block max-w-xs">{b.title}</span>
                          <span className="text-3xs text-gray-400 block mt-0.5">by {b.author?.name} &bull; {b.category?.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-600 dark:text-slate-400">{b.isbn}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">${(b.discountPrice > 0 ? b.discountPrice : b.price).toFixed(2)}</span>
                        {b.discountPrice > 0 && <span className="text-4xs text-gray-400 line-through">${b.price.toFixed(2)}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-gray-700 dark:text-slate-350">{b.stock} copies</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEditClick(b)} className="text-gray-400 hover:text-primary-500">
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button onClick={() => handleDeleteBook(b.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paged Footers */}
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

      {/* Edit/Add Overlay Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-soft-lg dark:bg-slate-900 max-h-[90vh] overflow-y-auto animate-zoom-in border dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-base">
                {editingBook ? 'Edit Book Details' : 'Add New Book'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400 mb-4">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form Details */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Title */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Book Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
                {errors.title && <span className="text-3xs text-red-500">{errors.title.message}</span>}
              </div>

              {/* Subtitle */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Subtitle</label>
                <input
                  type="text"
                  {...register('subtitle')}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* ISBN */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">ISBN Code</label>
                <input
                  type="text"
                  {...register('isbn', { required: 'ISBN code is required' })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
                {errors.isbn && <span className="text-3xs text-red-500">{errors.isbn.message}</span>}
              </div>

              {/* Author Dropdown */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Author Name</label>
                <select
                  {...register('authorId', { required: 'Please select an author' })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                >
                  <option value="">Select Author</option>
                  {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {errors.authorId && <span className="text-3xs text-red-500">{errors.authorId.message}</span>}
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Book Category</label>
                <select
                  {...register('categoryId', { required: 'Category is required' })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <span className="text-3xs text-red-500">{errors.categoryId.message}</span>}
              </div>

              {/* Publisher Dropdown */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Publisher</label>
                <select
                  {...register('publisherId', { required: 'Publisher is required' })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                >
                  <option value="">Select Publisher</option>
                  {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {errors.publisherId && <span className="text-3xs text-red-500">{errors.publisherId.message}</span>}
              </div>

              {/* Language */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Language</label>
                <input
                  type="text"
                  {...register('language')}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* Pricing */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Original Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { required: 'Price is required', min: 0.01 })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
                {errors.price && <span className="text-3xs text-red-500">Please provide a valid price</span>}
              </div>

              {/* Discount price */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Discount Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('discountPrice', { min: 0 })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* Discount percentage */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Discount Percentage (%)</label>
                <input
                  type="number"
                  {...register('discountPercentage', { min: 0, max: 100 })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Stock Copies</label>
                <input
                  type="number"
                  {...register('stock', { required: 'Stock is required', min: 0 })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* Pages */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Total Pages</label>
                <input
                  type="number"
                  {...register('pages', { required: 'Pages is required', min: 1 })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* Publication Date */}
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Publication Date</label>
                <input
                  type="date"
                  {...register('publicationDate')}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* File upload coverImage */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    {...register('coverImage')}
                    placeholder="http://example.com/cover.jpg"
                    className="flex-1 rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                  <label className="flex h-10 px-4 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 text-xs font-semibold hover:bg-gray-50 text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350">
                    <Upload className="h-4 w-4" />
                    Upload file
                    <input type="file" onChange={handleCoverUpload} className="hidden" accept="image/*" disabled={uploadingCover} />
                  </label>
                </div>
                {uploadingCover && <span className="text-3xs text-primary-500 animate-pulse">Uploading file to server...</span>}
              </div>

              {/* Description */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Book Description</label>
                <textarea
                  {...register('description')}
                  rows="4"
                  className="w-full rounded-xl border border-gray-200 p-3 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>

              {/* Modal Actions */}
              <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex justify-end gap-2.5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold hover:bg-gray-55 shadow-sm dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-500 px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-primary-600"
                >
                  Save Book
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageBooks;
