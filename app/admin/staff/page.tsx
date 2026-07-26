'use client';
import { useState, useEffect } from 'react';
import { Loader2, Plus, UserCheck, Mail, Phone, Building, Calendar, DollarSign, Edit, Trash2, Upload, X, Save, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/admin/ToastContext';

type Staff = {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string | null;
  email: string | null;
  phone: string;
  basicSalary: string | null;
  joiningDate: string;
  isActive: boolean;
  isPublic: boolean;
  photoUrl: string | null;
  qualification: string | null;
};

const defaultForm = {
  employeeId: '', name: '', designation: '', department: '',
  email: '', phone: '', basicSalary: '', joiningDate: '',
  qualification: '', photoUrl: '', photoPublicId: '', isActive: true, isPublic: true
};

export default function StaffPage() {
  const { showToast, confirm } = useToast();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff', { cache: 'no-store' });
      if (res.ok) setStaff(await res.json());
      else showToast('error', 'Failed to fetch staff members');
    } catch (error) { console.error(error); showToast('error', 'Network error fetching staff'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingStaff(null);
    setFormData({ ...defaultForm });
    setIsModalOpen(true);
  };

  const openEdit = (member: Staff) => {
    setEditingStaff(member);
    setFormData({
      employeeId: member.employeeId,
      name: member.name,
      designation: member.designation,
      department: member.department || '',
      email: member.email || '',
      phone: member.phone,
      basicSalary: member.basicSalary || '',
      joiningDate: member.joiningDate ? member.joiningDate.split('T')[0] : '',
      qualification: member.qualification || '',
      photoUrl: member.photoUrl || '',
      photoPublicId: '',
      isActive: member.isActive,
      isPublic: member.isPublic,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({ ...defaultForm });
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'kl-school/staff');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setFormData(prev => ({ ...prev, photoUrl: data.secure_url, photoPublicId: data.public_id }));
      showToast('success', 'Photo uploaded successfully');
    } catch {
      showToast('error', 'Photo upload failed. Please try again.');
    } finally { setUploadingPhoto(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.name || !formData.designation || !formData.phone) {
      showToast('warning', 'Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast('success', editingStaff ? `Updated ${formData.name}` : `Added ${formData.name}`);
        closeModal();
        fetchStaff();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Failed to save staff member');
      }
    } catch { showToast('error', 'Network error. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'Delete Staff Record?',
      message: `Are you sure you want to remove ${name} from staff records?`,
      confirmText: 'Delete Record',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setStaff(prev => prev.filter(s => s.id !== id));
            showToast('success', `Deleted ${name}`);
          } else {
            showToast('error', 'Failed to delete staff member');
          }
        } catch { showToast('error', 'Network error. Please try again.'); }
      },
    });
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Staff & Payroll</h1>
          <p className="text-gray-500 mt-1">Manage staff details, departments, and records.</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Staff
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-orange-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border-2 border-orange-100">
                      <UserCircle className="w-8 h-8 text-[#FF7A00]" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-[#0A1F44]">{member.name}</h3>
                    <p className="text-[#FF7A00] text-sm font-medium">{member.designation}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full shrink-0 ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-gray-400" /> ID: {member.employeeId}</div>
                {member.department && <div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" /> {member.department}</div>}
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {member.phone}</div>
                {member.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {member.email}</div>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined:</span>
                <span className="font-medium text-gray-700">{format(new Date(member.joiningDate), 'MMM dd, yyyy')}</span>
              </div>
              {member.basicSalary && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Base Pay:</span>
                  <span className="font-medium text-gray-700">₹{member.basicSalary}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => openEdit(member)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {staff.length === 0 && !loading && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No staff members found.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-playfair text-xl font-bold text-[#0A1F44]">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-orange-100 flex items-center justify-center shrink-0">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Staff Photo</p>
                  <label className="cursor-pointer flex items-center gap-2 text-sm text-[#FF7A00] font-medium bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors">
                    {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} disabled={uploadingPhoto} />
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: 'Employee ID *', key: 'employeeId', required: true },
                  { label: 'Full Name *', key: 'name', required: true },
                  { label: 'Designation *', key: 'designation', required: true },
                  { label: 'Department', key: 'department' },
                  { label: 'Phone *', key: 'phone', type: 'tel', required: true },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Basic Salary (₹)', key: 'basicSalary', type: 'number' },
                  { label: 'Joining Date', key: 'joiningDate', type: 'date' },
                  { label: 'Qualification', key: 'qualification' },
                ].map(({ label, key, type = 'text', required = false }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={(formData as any)[key]}
                      onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4 accent-[#FF7A00]" />
                  <span className="text-sm font-medium text-gray-700">Active Employee</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))} className="w-4 h-4 accent-[#FF7A00]" />
                  <span className="text-sm font-medium text-gray-700">Show on Website</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : (editingStaff ? 'Save Changes' : 'Add Staff')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
