'use client';
import { useState, useEffect } from 'react';
import { Plus, Award, Loader2, Upload, ExternalLink, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/admin/ToastContext';

type Certification = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  issuedBy: string | null;
  issuedDate: string | null;
  isPublished: boolean;
};

export default function CertificationsPage() {
  const { showToast, confirm } = useToast();
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    description: '',
    issuedBy: '',
    issuedDate: '',
    fileUrl: '',
    publicId: '',
  });

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/certifications', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setCerts(data);
      } else {
        showToast('error', 'Failed to load certifications');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error loading certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'kl-school/certifications');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();

      setNewCert((prev) => ({
        ...prev,
        fileUrl: uploadData.secure_url,
        publicId: uploadData.public_id,
      }));
      showToast('success', 'Document uploaded successfully');
    } catch (error) {
      console.error(error);
      showToast('error', 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.fileUrl) {
      showToast('warning', 'Title and Document are required');
      return;
    }

    try {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert),
      });

      if (res.ok) {
        setNewCert({ title: '', description: '', issuedBy: '', issuedDate: '', fileUrl: '', publicId: '' });
        setIsCreating(false);
        showToast('success', 'Certification created successfully');
        fetchCerts();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to save certification');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to save certification');
    }
  };

  const handleDelete = (id: string, title: string) => {
    confirm({
      title: 'Delete Certification?',
      message: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      confirmText: 'Delete Certificate',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setCerts(prev => prev.filter(c => c.id !== id));
            showToast('success', `Deleted "${title}"`);
          } else {
            showToast('error', 'Failed to delete certification');
          }
        } catch {
          showToast('error', 'Network error. Please try again.');
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
          <h1 className="text-2xl font-bold text-[#0A1F44]">Certifications</h1>
          <p className="text-gray-500 mt-1">Manage school awards and certifications.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> {isCreating ? 'Cancel' : 'Add Certification'}
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Certification</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                  value={newCert.issuedBy}
                  onChange={(e) => setNewCert({ ...newCert, issuedBy: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                  value={newCert.issuedDate}
                  onChange={(e) => setNewCert({ ...newCert, issuedDate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                  value={newCert.description}
                  onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document/Image *</label>
                {newCert.fileUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    <span>File uploaded successfully</span>
                    <a href={newCert.fileUrl} target="_blank" rel="noreferrer" className="text-sm underline ml-auto flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <label className="cursor-pointer flex items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                    {uploading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="w-5 h-5" /> Click to upload certificate file (Image or PDF)</>
                    )}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleUploadFile} disabled={uploading} />
                  </label>
                )}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={!newCert.fileUrl}>
              Save Certification
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
               {cert.fileUrl.endsWith('.pdf') ? (
                 <div className="text-center">
                   <Award className="w-16 h-16 text-[#FF7A00] mx-auto mb-2 opacity-80" />
                   <span className="text-gray-500 font-medium">PDF Document</span>
                 </div>
               ) : (
                 <img src={cert.fileUrl} alt={cert.title} className="max-w-full max-h-full object-contain" />
               )}
               <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                 <span className="flex items-center gap-2 bg-[#FF7A00] px-4 py-2 rounded-full font-medium">
                   <ExternalLink className="w-4 h-4" /> View Document
                 </span>
               </a>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#0A1F44] text-lg mb-1">{cert.title}</h3>
              {cert.issuedBy && <p className="text-sm text-gray-500">Issued by: {cert.issuedBy}</p>}
              {cert.issuedDate && <p className="text-sm text-gray-400 mt-1">Date: {format(new Date(cert.issuedDate), 'MMM dd, yyyy')}</p>}
              {cert.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{cert.description}</p>}
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => handleDelete(cert.id, cert.title)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {certs.length === 0 && !loading && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No certifications added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
