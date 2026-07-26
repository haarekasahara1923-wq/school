'use client';
import { useState, useEffect } from 'react';
import { Loader2, MessageSquare, Mail, Phone, Calendar, MapPin, MessageCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/admin/ToastContext';

type Enquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
};

const statusColors = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  in_progress: 'bg-orange-100 text-orange-700 border-orange-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusLabels = {
  new: '🔵 New',
  in_progress: '🟡 In Progress',
  resolved: '🟢 Resolved',
  closed: '⚫ Closed',
};

export default function ContactEnquiriesPage() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/contact', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      } else {
        showToast('error', 'Failed to fetch contact enquiries');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error fetching enquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast('success', `Status updated`);
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

  const openWhatsApp = (phone: string, name: string, message: string, address?: string | null) => {
    const waNumber = phone.replace(/\D/g, '');
    const formattedPhone = waNumber.startsWith('91') ? waNumber : `91${waNumber}`;
    const text = encodeURIComponent(
      `नमस्ते ${name},\n\nProgressive Smart Kids School की तरफ से आपसे संपर्क किया जा रहा है।\n\nआपका संदेश: ${message}\n\nधन्यवाद।`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  const newCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Contact Enquiries</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage messages from the website contact form.</p>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-xl text-sm">
              {newCount} New
            </span>
          )}
          <button
            onClick={fetchEnquiries}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Address</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Message</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-[#0A1F44]">{enquiry.name}</p>
                      {enquiry.email && (
                        <a href={`mailto:${enquiry.email}`} className="text-xs text-gray-400 hover:text-[#FF7A00] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {enquiry.email}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 text-gray-700 hover:text-[#FF7A00] font-medium transition-colors">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> {enquiry.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {enquiry.address ? (
                      <div className="flex items-start gap-1 text-gray-600 max-w-[150px]">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-xs leading-tight">{enquiry.address}</span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-[200px]">
                      {enquiry.subject && (
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">{enquiry.subject}</p>
                      )}
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{enquiry.message}</p>
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="text-[#FF7A00] text-xs hover:underline mt-0.5"
                      >
                        View full
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(enquiry.createdAt), 'dd MMM yy')}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(enquiry.createdAt), 'h:mm a')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusColors[enquiry.status]}`}>
                      {statusLabels[enquiry.status]}
                    </span>
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                      disabled={updating === enquiry.id}
                      className="mt-1 w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF7A00] disabled:opacity-50 bg-white"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => openWhatsApp(enquiry.phone, enquiry.name, enquiry.message, enquiry.address)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </button>
                      {enquiry.email && (
                        <a
                          href={`mailto:${enquiry.email}?subject=Re: ${enquiry.subject || 'Your Enquiry'}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                        >
                          <Mail className="w-3.5 h-3.5" /> Email
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {enquiries.length === 0 && !loading && (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No contact enquiries found.</p>
            <p className="text-gray-400 text-sm mt-1">Messages from the website contact form will appear here.</p>
          </div>
        )}
      </div>

      {/* Full message modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-[#0A1F44] text-lg">{selectedEnquiry.name}</h3>
                <p className="text-sm text-gray-500">{format(new Date(selectedEnquiry.createdAt), 'dd MMM yyyy, h:mm a')}</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >×</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-[#FF7A00]" /> {selectedEnquiry.phone}
              </div>
              {selectedEnquiry.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-[#FF7A00]" /> {selectedEnquiry.email}
                </div>
              )}
              {selectedEnquiry.address && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" /> {selectedEnquiry.address}
                </div>
              )}
              {selectedEnquiry.subject && (
                <p className="font-semibold text-gray-700">Subject: {selectedEnquiry.subject}</p>
              )}
              <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap border border-gray-100">
                {selectedEnquiry.message}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => openWhatsApp(selectedEnquiry.phone, selectedEnquiry.name, selectedEnquiry.message, selectedEnquiry.address)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Reply on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
