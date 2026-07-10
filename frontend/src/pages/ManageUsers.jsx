import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, Loader2, Edit, CheckCircle } from 'lucide-react';
import { TableSkeleton } from '../components/Skeleton';
import api from '../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    setUpdatingId(userId);
    try {
      const response = await api.patch(`/admin/users/${userId}/status?status=${newStatus}`);
      setUsers(users.map(u => u.id === userId ? response.data : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="font-outfit text-2xl font-extrabold text-gray-800 dark:text-white">Customer Registry</h1>
        <p className="text-xs text-gray-400 mt-0.5 font-medium">Verify system user accounts and manage active login authorization statuses</p>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl shadow-soft dark:bg-slate-900 dark:border-slate-800">
          No registered customer accounts found.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-3xs font-bold dark:border-slate-800">
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6 text-center">System Role</th>
                  <th className="py-4 px-6 text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/20 dark:hover:bg-slate-800/20">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.profilePicture || 'https://api.dicebear.com/7.x/adventurer/svg'}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover shadow-sm bg-gray-50"
                        />
                        <span className="font-bold text-gray-850 dark:text-slate-100">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-600 dark:text-slate-400">{u.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-4xs font-bold bg-primary-50 text-primary-500 dark:bg-primary-950/20">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {updatingId === u.id ? (
                          <Loader2 className="h-4.5 w-4.5 animate-spin text-primary-500" />
                        ) : (
                          <select
                            value={u.status}
                            onChange={(e) => handleStatusChange(u.id, e.target.value)}
                            className={`rounded-full px-3 py-1 font-bold text-3xs border-none cursor-pointer outline-none ${
                              u.status === 'ACTIVE' 
                                ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' 
                                : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                            }`}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="BLOCKED">BLOCKED</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
