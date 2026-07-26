'use client';
import { useState, useEffect } from 'react';
import { Loader2, FileText, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/admin/ToastContext';

type AdmissionEnquiry = {
  id: string;
  studentName: string;
  classApplying: string;
  parentName: string;
  phone: string;
  email: string | null;
  address: string | null;
  message: string | null;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
};

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const statusLabels = {
  new: 'New',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export default function AdmissionsPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admissions', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      } else {
        showToast('error', 'Failed to fetch admission enquiries');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error fetching admissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast('success', `Updated enquiry status to ${statusLabels[status as keyof typeof statusLabels] || status}`);
        fetchEnquiries();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Admission Enquiries</h1>
          <p className="text-gray-500 mt-1">Review and process new admission applications from parents.</p>
        </div>
        <div className="bg-orange-50 text-[#FF7A00] font-semibold px-4 py-2 rounded-xl">
          {enquiries.filter(e => e.status === 'new').length} New Enquiries
        </div>
      </div>

      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <div key={enquiry.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#0A1F44]">{enquiry.studentName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[enquiry.status]}`}>
                    {statusLabels[enquiry.status]}
                  </span>
                  <span className="bg-[#0A1F44] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Class: {enquiry.classApplying}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700">Parent:</span> {enquiry.parentName}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${enquiry.phone}`} className="hover:text-[#FF7A00] transition-colors">{enquiry.phone}</a>
                    </div>
                    {enquiry.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${enquiry.email}`} className="hover:text-[#FF7A00] transition-colors">{enquiry.email}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {format(new Date(enquiry.createdAt), 'MMM dd, yyyy h:mm a')}
                    </div>
                  </div>
                  {enquiry.address && (
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>{enquiry.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <select
                  value={enquiry.status}
                  onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                  disabled={updating === enquiry.id}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] disabled:opacity-50 bg-white"
                >
                  <option value="new">Mark as New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                {updating === enquiry.id && <Loader2 className="w-5 h-5 animate-spin text-[#FF7A00] mt-2" />}
              </div>
            </div>

            {enquiry.message && (
              <div className="p-6 bg-gray-50/50">
                <p className="font-semibold text-gray-800 mb-2">Additional Message:</p>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap shadow-sm">
                  {enquiry.message}
                </div>
              </div>
            )}
          </div>
        ))}

        {enquiries.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No admission enquiries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
