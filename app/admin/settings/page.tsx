'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Settings as SettingsIcon, Save, RotateCcw, ShieldCheck, Phone, Mail, MapPin,
  MessageCircle, School, UserCircle, Upload, Award, FileText, CheckCircle2
} from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

type AboutContent = {
  id?: string;
  section: 'director' | 'principal';
  name: string;
  designation: string;
  photoUrl: string | null;
  message: string;
  qualifications: string | null;
};

export default function SettingsPage() {
  const { showToast, confirm } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  // General School Settings
  const [schoolSettings, setSchoolSettings] = useState<Record<string, string>>({
    school_name: 'Progressive Smart Kids School',
    academic_year: '2025-2026',
    school_address: 'Prani Chhavani, Gwalior (MP)',
    contact_phone: '8962678915',
    contact_email: 'info@progressivesmartkids.in',
    whatsapp_number: '918962678915',
  });

  // Director & Principal Content
  const [directorData, setDirectorData] = useState<AboutContent>({
    section: 'director',
    name: 'Director',
    designation: 'Director',
    qualifications: 'Educational Leadership',
    photoUrl: null,
    message: 'Welcome to Progressive Smart Kids School. Our endeavor is to empower students with values and knowledge to succeed in life from Class 1st to 12th.',
  });

  const [principalData, setPrincipalData] = useState<AboutContent>({
    section: 'principal',
    name: 'Principal',
    designation: 'Principal',
    qualifications: 'M.Sc., M.Ed.',
    photoUrl: null,
    message: 'At Progressive Smart Kids School, every child is unique. We nurture their talent and foster holistic growth in Prani Chhavani, Gwalior.',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Key/Value Settings
      const settingsRes = await fetch('/api/settings', { cache: 'no-store' });
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (Array.isArray(data)) {
          const map: Record<string, string> = { ...schoolSettings };
          data.forEach((item: any) => {
            if (item.value != null) map[item.key] = item.value;
          });
          setSchoolSettings(map);
        }
      }

      // 2. Fetch Director & Principal Content
      const aboutRes = await fetch('/api/about', { cache: 'no-store' });
      if (aboutRes.ok) {
        const aboutItems: AboutContent[] = await aboutRes.json();
        const d = aboutItems.find(i => i.section === 'director');
        const p = aboutItems.find(i => i.section === 'principal');
        if (d) setDirectorData(prev => ({ ...prev, ...d }));
        if (p) setPrincipalData(prev => ({ ...prev, ...p }));
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error loading settings data');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUploadPhoto = async (section: 'director' | 'principal', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSection(section);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'progressive-smart-kids/leadership');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Photo upload failed');
      const data = await res.json();

      if (section === 'director') {
        setDirectorData(prev => ({ ...prev, photoUrl: data.secure_url }));
      } else {
        setPrincipalData(prev => ({ ...prev, photoUrl: data.secure_url }));
      }
      showToast('success', `${section === 'director' ? 'Director' : 'Principal'} photo uploaded successfully`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to upload photo');
    } finally {
      setUploadingSection(null);
      e.target.value = '';
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // 1. Save Settings
      const settingsPayload = Object.entries(schoolSettings).map(([key, value]) => ({ key, value }));
      const sRes = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsPayload }),
      });
      if (!sRes.ok) throw new Error('Failed to save school info settings');

      // 2. Save Director
      const dRes = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(directorData),
      });
      if (!dRes.ok) throw new Error('Failed to save Director information');

      // 3. Save Principal
      const pRes = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(principalData),
      });
      if (!pRes.ok) throw new Error('Failed to save Principal information');

      showToast('success', 'All Settings & Leadership messages saved! Website updated in real-time.');
      await fetchData();
    } catch (err: any) {
      showToast('error', err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
        <p className="text-sm text-gray-500 font-medium">Loading school settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF7A00]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1F44]">School Settings & Content</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage school info, address, contact numbers, and Director/Principal messages.</p>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary px-6 py-3 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving All...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save All Settings
            </>
          )}
        </button>
      </div>

      {/* 1. School Information Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
          <School className="w-4 h-4 text-[#FF7A00]" />
          1. School General Details & Contact Info
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5 flex items-center gap-2">
              <School className="w-4 h-4 text-[#FF7A00]" /> School Name
            </label>
            <input
              type="text"
              className="input-field"
              value={schoolSettings.school_name || ''}
              onChange={e => setSchoolSettings(prev => ({ ...prev, school_name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF7A00]" /> Academic Session / Year
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 2025-2026"
              value={schoolSettings.academic_year || ''}
              onChange={e => setSchoolSettings(prev => ({ ...prev, academic_year: e.target.value }))}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF7A00]" /> Full School Address
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Prani Chhavani, Gwalior (MP)"
              value={schoolSettings.school_address || ''}
              onChange={e => setSchoolSettings(prev => ({ ...prev, school_address: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF7A00]" /> Primary Contact Phone
            </label>
            <input
              type="text"
              className="input-field"
              value={schoolSettings.contact_phone || ''}
              onChange={e => setSchoolSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF7A00]" /> Primary Contact Email
            </label>
            <input
              type="email"
              className="input-field"
              value={schoolSettings.contact_email || ''}
              onChange={e => setSchoolSettings(prev => ({ ...prev, contact_email: e.target.value }))}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" /> Admin WhatsApp Number (for enquiry alerts)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 918962678915"
              value={schoolSettings.whatsapp_number || ''}
              onChange={e => setSchoolSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
            />
            <p className="text-xs text-gray-400 mt-1">📱 Include country code without plus sign (e.g. 918962678915 for India +91)</p>
          </div>
        </div>
      </div>

      {/* 2. Director's Message & Photo */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
            <UserCircle className="w-4 h-4 text-[#FF7A00]" />
            2. Director's Profile & Message
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
            <div className="w-36 h-36 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-orange-200 flex items-center justify-center relative">
              {directorData.photoUrl ? (
                <img src={directorData.photoUrl} alt={directorData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <UserCircle className="w-16 h-16 text-gray-300 mx-auto" />
                  <span className="text-xs text-gray-400">No Photo</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-[#FF7A00] hover:bg-[#E06500] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2">
              {uploadingSection === 'director' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingSection === 'director' ? 'Uploading...' : 'Upload Director Photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingSection === 'director'}
                onChange={e => handleUploadPhoto('director', e)}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Director Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={directorData.name}
                  onChange={e => setDirectorData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Designation</label>
                <input
                  type="text"
                  className="input-field"
                  value={directorData.designation}
                  onChange={e => setDirectorData(prev => ({ ...prev, designation: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qualifications / Degrees</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. M.Ed., Ph.D. in Education"
                value={directorData.qualifications || ''}
                onChange={e => setDirectorData(prev => ({ ...prev, qualifications: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Message Body</label>
              <textarea
                rows={5}
                className="input-field resize-y"
                placeholder="Director message for parents and students..."
                value={directorData.message}
                onChange={e => setDirectorData(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Principal's Message & Photo */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
            <UserCircle className="w-4 h-4 text-[#0A1F44]" />
            3. Principal's Profile & Message
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <div className="w-36 h-36 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-blue-200 flex items-center justify-center relative">
              {principalData.photoUrl ? (
                <img src={principalData.photoUrl} alt={principalData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <UserCircle className="w-16 h-16 text-gray-300 mx-auto" />
                  <span className="text-xs text-gray-400">No Photo</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-[#0A1F44] hover:bg-[#1a3a6b] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2">
              {uploadingSection === 'principal' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingSection === 'principal' ? 'Uploading...' : 'Upload Principal Photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingSection === 'principal'}
                onChange={e => handleUploadPhoto('principal', e)}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Principal Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={principalData.name}
                  onChange={e => setPrincipalData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Designation</label>
                <input
                  type="text"
                  className="input-field"
                  value={principalData.designation}
                  onChange={e => setPrincipalData(prev => ({ ...prev, designation: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Qualifications / Degrees</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. M.Sc., M.Ed."
                value={principalData.qualifications || ''}
                onChange={e => setPrincipalData(prev => ({ ...prev, qualifications: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Message Body</label>
              <textarea
                rows={5}
                className="input-field resize-y"
                placeholder="Principal message for parents and students..."
                value={principalData.message}
                onChange={e => setPrincipalData(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="sticky bottom-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 flex justify-between items-center z-30">
        <p className="text-xs text-gray-500 font-medium hidden sm:block">
          ✨ Saving updates school info & leadership messages on the live website immediately.
        </p>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary ml-auto px-8 py-3.5 flex items-center gap-2 shadow-lg shadow-orange-500/30 text-base"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save All Settings & Messages
            </>
          )}
        </button>
      </div>
    </div>
  );
}
