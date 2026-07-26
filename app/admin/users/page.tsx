'use client';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Shield, User, Mail, ShieldAlert, Key, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/admin/ToastContext';

type UserData = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

const defaultForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'operations',
};

export default function UsersPage() {
  const { showToast, confirm } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        showToast('error', 'Failed to fetch user list');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setFormData({ ...defaultForm });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ ...defaultForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('success', `Created user account for ${formData.name}`);
        closeModal();
        fetchUsers();
      } else {
        showToast('error', data.error || 'Failed to add user');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error creating user');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !user.isActive } : u));
        showToast('info', `User ${user.name} is now ${!user.isActive ? 'Active' : 'Inactive'}`);
      } else {
        showToast('error', data.error || 'Failed to update user status');
      }
    } catch {
      showToast('error', 'Network error updating user status');
    }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'Deactivate User Account?',
      message: `Are you sure you want to deactivate ${name}'s access to the admin portal?`,
      confirmText: 'Deactivate',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok) {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: false } : u));
            showToast('success', `Deactivated ${name}`);
          } else {
            showToast('error', data.error || 'Failed to delete user');
          }
        } catch {
          showToast('error', 'Network error deactivating user');
        }
      },
    });
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">User Management</h1>
          <p className="text-gray-500 mt-1">Manage admin panel access, roles, and credentials.</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">User Details</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0A1F44]">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {user.username}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize border border-gray-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max transition-colors ${
                        user.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id, user.name)} 
                      disabled={!user.isActive}
                      className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Deactivate User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p>No users found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold text-[#0A1F44]">Add New User</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password * (Min 6 chars)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" required minLength={6} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] bg-white" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="accountant">Accountant</option>
                  <option value="operations">Operations</option>
                  <option value="inventory">Inventory</option>
                </select>
              </div>
              
              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
