'use client';
import { useState } from 'react';
import { Plus, Search, Trash2, Edit, UserPlus, Phone, X, Save, Loader2, Filter } from 'lucide-react';
import { CLASS_OPTIONS, formatDate } from '@/lib/utils';
import { useToast } from '@/components/admin/ToastContext';

const defaultForm = {
  admissionNo: '',
  name: '',
  class: 'Class 1',
  section: 'A',
  rollNo: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
};

export default function StudentsClient({ students: initialStudents }: { students: any[] }) {
  const { showToast, confirm } = useToast();
  const [studentsList, setStudentsList] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [formData, setFormData] = useState({ ...defaultForm });
  const [saving, setSaving] = useState(false);

  const filtered = studentsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass ? s.class === selectedClass : true;
    return matchesSearch && matchesClass;
  });

  const openAdd = () => {
    setEditingStudent(null);
    setFormData({ ...defaultForm });
    setIsModalOpen(true);
  };

  const openEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      admissionNo: student.admissionNo || '',
      name: student.name || '',
      class: student.class || 'Class 1',
      section: student.section || '',
      rollNo: student.rollNo || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      parentEmail: student.parentEmail || '',
      address: student.address || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      bloodGroup: student.bloodGroup || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ ...defaultForm });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStudent) {
        // EDIT student
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setStudentsList(prev => prev.map(s => s.id === editingStudent.id ? { ...s, ...data } : s));
          showToast('success', `Updated student record for ${formData.name}`);
          closeModal();
        } else {
          showToast('error', data.error || 'Failed to update student');
        }
      } else {
        // CREATE student
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
          setStudentsList(prev => [data, ...prev]);
          showToast('success', `Added new student ${formData.name}`);
          closeModal();
        } else {
          showToast('error', data.error || 'Failed to add student');
        }
      }
    } catch {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'Delete Student Record?',
      message: `Are you sure you want to delete ${name}'s record? This action cannot be undone.`,
      confirmText: 'Delete Record',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setStudentsList(prev => prev.filter(s => s.id !== id));
            showToast('success', `Deleted ${name}'s record`);
          } else {
            const data = await res.json();
            showToast('error', data.error || 'Failed to delete student');
          }
        } catch {
          showToast('error', 'Network error. Please try again.');
        }
      },
    });
  };

  const field = (label: string, key: keyof typeof formData, type = 'text', required = false) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        required={required}
        value={formData[key]}
        onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-[#0A1F44]">Student Management</h1>
          <p className="text-gray-500 text-sm">Manage student records, admissions, and details.</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or admission no..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] outline-none"
          />
        </div>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] outline-none bg-white"
        >
          <option value="">All Classes</option>
          {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CLASS_OPTIONS.slice(0, 4).map(cls => {
          const count = studentsList.filter(s => s.class === cls).length;
          return (
            <div key={cls} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
              <p className="text-xl font-bold text-[#0A1F44]">{count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cls}</p>
            </div>
          );
        })}
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Class & Section</th>
                <th className="px-6 py-4">Parent Details</th>
                <th className="px-6 py-4">Admission Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No student records found.</td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#0A1F44]">{s.admissionNo}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-100 text-[#FF7A00] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {s.class} {s.section ? `- ${s.section}` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{s.parentName}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {s.parentPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(s.admissionDate)}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit student"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
          Showing {filtered.length} of {studentsList.length} students
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-playfair text-xl font-bold text-[#0A1F44]">
                {editingStudent ? 'Edit Student Record' : 'Add New Student'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {field('Admission No', 'admissionNo', 'text', true)}
                {field('Student Full Name', 'name', 'text', true)}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Class *</label>
                  <select
                    value={formData.class}
                    onChange={e => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#FF7A00] outline-none bg-white"
                  >
                    {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {field('Section', 'section')}
                {field('Roll No', 'rollNo')}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {field('Gender', 'gender')}
                {field('Blood Group', 'bloodGroup')}
                {field('Date of Birth', 'dateOfBirth', 'date')}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Parent / Guardian Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {field('Parent Name', 'parentName', 'text', true)}
                  {field('Parent Phone', 'parentPhone', 'tel', true)}
                </div>
                {field('Parent Email', 'parentEmail', 'email')}
              </div>
              {field('Address', 'address')}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : (editingStudent ? 'Save Changes' : 'Add Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
