'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Send } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState(process.env.NEXT_PUBLIC_WHATSAPP || '918962678915');
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    // Fetch whatsapp number from settings API
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data)) {
          const waSetting = data.find((s: any) => s.key === 'whatsapp_number');
          if (waSetting?.value) setWhatsapp(waSetting.value);
        }
      })
      .catch(() => {});

    // Remove pulse animation after 5 seconds
    const t = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const quickMessages = [
    { label: '📚 Admission Enquiry', text: 'नमस्ते! मैं अपने बच्चे के admission के बारे में जानकारी लेना चाहता/चाहती हूं।' },
    { label: '📞 Request a Callback', text: 'नमस्ते! कृपया मुझे वापस कॉल करें।' },
    { label: '🏫 School Visit', text: 'नमस्ते! मैं Progressive Smart Kids School का दौरा करना चाहता/चाहती हूं।' },
  ];

  const openWhatsApp = (message: string) => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Progressive Smart Kids</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <p className="text-green-100 text-xs">Online — Reply fast!</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="bg-green-50 rounded-xl p-3 mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  🙏 नमस्ते! Progressive Smart Kids School में आपका स्वागत है।<br />
                  हम आपकी किस तरह सहायता कर सकते हैं?
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {quickMessages.map((msg) => (
                  <button
                    key={msg.label}
                    onClick={() => openWhatsApp(msg.text)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 text-sm text-gray-700 transition-colors flex items-center justify-between gap-2 group"
                  >
                    <span>{msg.label}</span>
                    <Send className="w-3.5 h-3.5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Start WhatsApp Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl shadow-green-600/40 flex items-center justify-center transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-7 h-7" fill="white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {pulse && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        )}

        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] flex items-center justify-center font-bold">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
