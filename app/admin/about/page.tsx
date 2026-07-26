'use client';
import { useState, useEffect } from 'react';
import { Loader2, Upload, UserCircle, Save } from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

type AboutContent = {
  id: string;
  section: 'director' | 'principal';
  name: string;
  designation: string;
  photoUrl: string | null;
  message: string;
  qualifications: string | null;
};

export default function AboutContentPage() {
  const { showToast } = useToast();
  const [content, setContent] = useState<Record<string, AboutContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);
  
  const [editData, setEditData] = useState<Record<string, Partial<AboutContent>>>({
    director: { section: 'director', name: '', designation: 'Director', message: '', qualifications: '', photoUrl: null },
    principal: { section: 'principal', name: '', designation: 'Principal', message: '', qualifications: '', photoUrl: null }
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/about', { cache: 'no-store' });
      if (res.ok) {
        const data: AboutContent[] = await res.json();
        const contentMap: Record<string, AboutContent> = {};
        const editMap = { ...editData };
        
        data.forEach(item => {
          contentMap[item.section] = item;
          editMap[item.section] = { ...item };
        });
        
        setContent(contentMap);
        setEditData(editMap);
      } else {
        showToast('error', 'Failed to fetch about content');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error fetching about content');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (section: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSection(section);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'kl-school/staff');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();

      setEditData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          photoUrl: uploadData.secure_url,
          photoPublicId: uploadData.public_id,
        }
      }));
      showToast('success', 'Image uploaded successfully');
    } catch (error) {
      console.error(error);
      showToast('error', 'File upload failed');
    } finally {
      setUploadingSection(null);
    }
  };

  const handleSave = async (section: string) => {
    const dataToSave = editData[section];
    if (!dataToSave.name || !dataToSave.message) {
      showToast('warning', 'Name and Message fields are required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        showToast('success', `${section.charAt(0).toUpperCase() + section.slice(1)}'s content saved successfully!`);
        fetchContent();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
    } catch (error: any) {
      console.error(error);
      showToast('error', error.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const renderSectionForm = (section: 'director' | 'principal') => {
    const data = editData[section];
    const isUploading = uploadingSection === section;
    
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#0A1F44] capitalize">{section}'s Message</h2>
          <button 
            onClick={() => handleSave(section)} 
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-20 h-20 text-gray-300" />
                )}
              </div>
              
              <label className="cursor-pointer text-[#FF7A00] hover:text-orange-700 font-medium text-sm flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full transition-colors">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Uploading...' : 'Change Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUploadImage(section, e)} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                  value={data.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, [section]: { ...prev[section], name: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                  value={data.designation || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, [section]: { ...prev[section], designation: e.target.value } }))}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                value={data.qualifications || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, [section]: { ...prev[section], qualifications: e.target.value } }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Body *</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] resize-y"
                value={data.message || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, [section]: { ...prev[section], message: e.target.value } }))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">About Content</h1>
        <p className="text-gray-500 mt-1">Manage the Director's and Principal's messages displayed on the website.</p>
      </div>

      {renderSectionForm('director')}
      {renderSectionForm('principal')}
      
    </div>
  );
}
