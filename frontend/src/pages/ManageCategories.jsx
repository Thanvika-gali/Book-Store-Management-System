import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalError, setModalError] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setModalError('');
    reset({ name: '' });
    setShowModal(true);
  };

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setModalError('');
    setValue('name', cat.name);
    setShowModal(true);
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to delete this category? All catalog items in this category will become uncategorized.')) return;
    try {
      await api.delete(`/admin/categories/${catId}`);
      setCategories(categories.filter((c) => c.id !== catId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category.');
    }
  };

  const onFormSubmit = async (data) => {
    setModalError('');
    try {
      if (editingCategory) {
        // Edit category
        const response = await api.put(`/admin/categories/${editingCategory.id}`, data);
        setCategories(categories.map(c => c.id === editingCategory.id ? response.data : c));
      } else {
        // Add category
        const response = await api.post('/admin/categories', data);
        setCategories([...categories, response.data]);
      }
      setShowModal(false);
      reset();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error processing category action.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Categories Directory</h1>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">Manage book genres and thematic catalog groups</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-primary-500 px-4 text-xs font-bold text-white shadow-soft hover:bg-primary-600 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl shadow-soft dark:bg-slate-900 dark:border-slate-800">
          No categories found.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-3xs font-bold dark:border-slate-800">
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/20">
                  <td className="py-4 px-6 font-bold text-gray-800 dark:text-slate-200">{c.name}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleEditClick(c)} className="text-gray-400 hover:text-primary-500">
                        <Edit className="h-4.5 w-4.5" />
                      </button>
                      <button onClick={() => handleDeleteCategory(c.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Overlay Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-soft-lg dark:bg-slate-900 animate-zoom-in border dark:border-slate-800">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
              <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-650">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-3xs text-red-650 mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Science Fiction, Classics"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
                {errors.name && <span className="text-3xs text-red-500">{errors.name.message}</span>}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600">Save</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCategories;
