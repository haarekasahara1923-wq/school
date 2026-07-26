'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Settings as SettingsIcon, Save, RotateCcw, ShieldCheck, Phone, Mail, MapPin, MessageCircle, School } from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

type AppSetting = {
  id: string;
  key: string;
  value: string;
  description: string | null;
};

const defaultSettings = [
  { key: 'school_name', label: 'School Name', defaultValue: 'Progressive Smart Kids School', icon: School, group: 'School Info' },
  { key: 'school_tagline', label: 'School Tagline', defaultValue: 'Shaping Tomorrow\'s Leaders Today', icon: School, group: 'School Info' },
  { key: 'academic_year', label: 'Current Academic Year', defaultValue: '2025-2026', icon: School, group: 'School Info' },
  { key: 'admission_open', label: 'Admissions Open (true/false)', defaultValue: 'true', icon: School, group: 'School Info' },
  { key: 'school_address', label: 'School Address', defaultValue: 'Prani Chhavani, Gwalior (MP)', icon: MapPin, group: 'Contact' },
  { key: 'contact_phone', label: 'Primary Contact Phone', defaultValue: '8962678915', icon: Phone, group: 'Contact' },
  { key: 'contact_email', label: 'Primary Contact Email', defaultValue: 'info@progressivesmartkids.in', icon: Mail, group: 'Contact' },
  { key: 'whatsapp_number', label: 'Admin WhatsApp Number (with country code)', defaultValue: '918962678915', icon: MessageCircle, group: 'Contact' },
];

const groups = ['School Info', 'Contact'];

export default function SettingsPage() {
  const { showToast, confirm } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data: AppSetting[] = await res.json();
        const settingsMap: Record<string, string> = {};

        data.forEach((item) => {
          if (item.value != null) {
            settingsMap[item.key] = item.value;
          }
        });

        defaultSettings.forEach((ds) => {
          if (settingsMap[ds.key] == null) {
            settingsMap[ds.key] = ds.defaultValue;
          }
        });

        setSettings(settingsMap);
      } else {
        showToast('error', 'Failed to load system settings');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error while fetching settings');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = defaultSettings.map((ds) => ({
        key: ds.key,
        value: settings[ds.key] ?? ds.defaultValue,
      }));

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
        cache: 'no-store',
      });

      let responseData: any = null;
      try {
        const text = await res.text();
        if (text) responseData = JSON.parse(text);
      } catch (_e) {}

      if (res.ok && responseData?.success) {
        await fetchSettings();
        showToast('success', 'Settings saved successfully!');
      } else {
        showToast('error', responseData?.error || `Failed to save settings (${res.status})`);
      }
    } catch (error: any) {
      showToast('error', error?.message || 'Error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    confirm({
      title: 'Reset to Default Settings?',
      message: 'This will reset all field values to system defaults on your form.',
      confirmText: 'Reset Defaults',
      variant: 'primary',
      onConfirm: () => {
        const resetMap: Record<string, string> = {};
        defaultSettings.forEach((ds) => {
          resetMap[ds.key] = ds.defaultValue;
        });
        setSettings(resetMap);
        showToast('info', 'Fields reset to defaults. Click "Save All Settings" to apply.');
      },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
        <p className="text-sm text-gray-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF7A00]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0A1F44]">System Settings</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage global configuration for the school portal.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={saving}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>
        </div>
      </div>

      {/* Settings Groups */}
      {groups.map((group) => {
        const groupSettings = defaultSettings.filter((s) => s.group === group);
        return (
          <div key={group} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {group} Settings
            </div>

            <div className="grid gap-6">
              {groupSettings.map((ds) => {
                const Icon = ds.icon;
                return (
                  <div key={ds.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-semibold text-[#0A1F44]">
                        <Icon className="w-4 h-4 text-[#FF7A00]" />
                        {ds.label}
                      </label>
                      <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded-md">
                        {ds.key}
                      </span>
                    </div>
                    <input
                      type="text"
                      disabled={saving}
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-colors"
                      value={settings[ds.key] || ''}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, [ds.key]: e.target.value }))
                      }
                    />
                    {ds.key === 'whatsapp_number' && (
                      <p className="text-xs text-gray-400">
                        📱 Enter number with country code (e.g., 918962678915 for India +91)
                      </p>
                    )}
                    {ds.key === 'admission_open' && (
                      <p className="text-xs text-gray-400">
                        Enter "true" to show admission open banner, "false" to hide it.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {group === 'Contact' && (
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary px-6 py-3 flex items-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save All Settings
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
