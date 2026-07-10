import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, Lock, MapPin, Plus, Trash2, Camera, 
  Loader2, AlertCircle, CheckCircle2, ChevronRight, Edit3 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);

  // Forms
  const { register: registerProfile, handleSubmit: handleSubmitProfile } = useForm({
    defaultValues: { name: user?.name }
  });
  const { register: registerPass, handleSubmit: handleSubmitPass, reset: resetPass, watch: watchPass } = useForm();
  
  // Addresses CRUD states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const { register: registerAddr, handleSubmit: handleSubmitAddr, reset: resetAddr, setValue: setValueAddr } = useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses');
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      const res = await api.put('/users/profile', { name: data.name, profilePicture: user.profilePicture });
      updateProfileState({ name: res.data.name });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
      await api.put('/users/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      setSuccessMsg('Password updated successfully!');
      resetPass();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Current password input is incorrect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingPic(true);
    setErrorMsg('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = uploadRes.data.url;
      
      // Update profile picture
      const profileRes = await api.put('/users/profile', { name: user.name, profilePicture: fileUrl });
      updateProfileState({ profilePicture: profileRes.data.profilePicture });
      setSuccessMsg('Avatar updated successfully!');
    } catch (err) {
      setErrorMsg('Error uploading avatar picture.');
    } finally {
      setUploadingPic(false);
    }
  };

  const handleCreateOrUpdateAddress = async (data) => {
    setSavingAddress(true);
    try {
      if (editingAddress) {
        // Update Address
        const res = await api.put(`/users/addresses/${editingAddress.id}`, { ...data, isDefault: editingAddress.isDefault });
        setAddresses(addresses.map(a => a.id === editingAddress.id ? res.data : a));
      } else {
        // Add Address
        const res = await api.post('/users/addresses', { ...data, isDefault: addresses.length === 0 });
        setAddresses([...addresses, res.data]);
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddr();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddress(addr);
    setValueAddr('street', addr.street);
    setValueAddr('city', addr.city);
    setValueAddr('state', addr.state);
    setValueAddr('country', addr.country);
    setValueAddr('zipCode', addr.zipCode);
    setValueAddr('phone', addr.phone);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addrId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/users/addresses/${addrId}`);
      setAddresses(addresses.filter(a => a.id !== addrId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <h1 className="font-outfit text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h1>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-600 dark:bg-green-950/20 dark:text-green-400">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card & Passwords */}
        <div className="md:col-span-1 space-y-6">
          {/* Avatar details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="relative mx-auto h-24 w-24">
              <img
                src={user?.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
                alt="avatar"
                className="h-full w-full rounded-full object-cover border-4 border-gray-50 shadow-sm"
              />
              <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow hover:bg-primary-600 transition-colors">
                <Camera className="h-4 w-4" />
                <input type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" disabled={uploadingPic} />
              </label>
              {uploadingPic && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-base mt-4">{user?.name}</h3>
            <span className="text-3xs text-gray-400 block">{user?.email}</span>
            <span className="inline-block mt-3 text-3xs font-semibold bg-primary-550/10 text-primary-500 px-2.5 py-0.5 rounded-full dark:bg-primary-950/20">
              Role: {user?.role}
            </span>
          </div>

          {/* Change Info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h4 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">Personal Info</h4>
            <form onSubmit={handleSubmitProfile(handleUpdateProfile)} className="space-y-3">
              <div className="space-y-1">
                <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  {...registerProfile('name', { required: true })}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full flex h-9 items-center justify-center rounded-xl bg-gray-900 text-xs font-bold text-white hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700">
                Update Profile
              </button>
            </form>
          </div>
        </div>

        {/* Addresses & Passwords */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Address Book panel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-50 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-primary-500" />
                <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm">My Address Book</h3>
              </div>
              <button 
                onClick={() => { setEditingAddress(null); resetAddr(); setShowAddressForm(!showAddressForm); }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                New Address
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <form onSubmit={handleSubmitAddr(handleCreateOrUpdateAddress)} className="p-4.5 rounded-2xl bg-gray-50 border border-gray-100 dark:bg-slate-800/40 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Street Address</label>
                  <input
                    type="text"
                    {...registerAddr('street', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    {...registerAddr('city', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    {...registerAddr('state', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Country</label>
                  <input
                    type="text"
                    {...registerAddr('country', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Zip Code</label>
                  <input
                    type="text"
                    {...registerAddr('zipCode', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
                  <input
                    type="text"
                    {...registerAddr('phone', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={savingAddress} className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white hover:bg-primary-600">
                    {savingAddress ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            {/* List addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map(addr => (
                <div key={addr.id} className="relative flex flex-col p-4 rounded-xl border border-gray-100 shadow-soft dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs text-gray-800 dark:text-white">
                      {addr.isDefault && <span className="bg-primary-50 text-primary-500 px-2 py-0.5 rounded-full text-3xs mr-2 dark:bg-primary-950/20">Default</span>}
                      Address
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditAddressClick(addr)} className="text-gray-400 hover:text-primary-500">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-3xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
                    {addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.zipCode}
                  </span>
                  <span className="text-3xs text-gray-400 mt-2">Phone: {addr.phone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password panel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="font-outfit font-bold text-gray-800 dark:text-white text-sm border-b border-gray-50 pb-3 dark:border-slate-800">
              Update Security Password
            </h3>
            
            <form onSubmit={handleSubmitPass(handleChangePassword)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    {...registerPass('oldPassword', { required: true })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    {...registerPass('newPassword', { required: true, minLength: 6 })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-semibold text-gray-400 uppercase tracking-wider">Verify New Password</label>
                  <input
                    type="password"
                    {...registerPass('confirmPassword', { 
                      required: true,
                      validate: (v) => v === watchPass('newPassword') || 'Passwords do not match'
                    })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-primary-500 dark:border-slate-800 dark:bg-slate-800"
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="flex h-10 items-center justify-center rounded-xl bg-gray-900 text-xs font-bold text-white hover:bg-black px-6 dark:bg-slate-800 dark:hover:bg-slate-700">
                Change Password
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
