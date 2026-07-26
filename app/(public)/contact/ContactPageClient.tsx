'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactEnquirySchema, type ContactEnquiryInput } from '@/lib/validations';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState('918962678915');
  const [contactAddress, setContactAddress] = useState('Prani Chhavani, Gwalior (MP)');
  const [contactPhone, setContactPhone] = useState('8962678915');
  const [contactEmail, setContactEmail] = useState('info@progressivesmartkids.in');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const wa = data.find((s: any) => s.key === 'whatsapp_number');
          const addr = data.find((s: any) => s.key === 'school_address');
          const ph = data.find((s: any) => s.key === 'contact_phone');
          const em = data.find((s: any) => s.key === 'contact_email');

          if (wa?.value) setWhatsapp(wa.value);
          if (addr?.value) setContactAddress(addr.value);
          if (ph?.value) setContactPhone(ph.value);
          if (em?.value) setContactEmail(em.value);
        }
      })
      .catch(() => {});
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactEnquiryInput>({
    resolver: zodResolver(contactEnquirySchema),
  });

  const onSubmit = async (data: ContactEnquiryInput) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let adminWa = whatsapp;
      if (res.ok) {
        const responseData = await res.json();
        if (responseData.whatsappNumber) adminWa = responseData.whatsappNumber;
        setSubmitted(true);
        reset();

        // Real-time WhatsApp trigger to admin
        const formattedWa = adminWa.replace(/\D/g, '');
        const targetWa = formattedWa.startsWith('91') ? formattedWa : `91${formattedWa}`;
        const text = encodeURIComponent(
          `📩 *New Website Enquiry - Progressive Smart Kids School*\n\n` +
          `👤 *Name:* ${data.name}\n` +
          `📞 *Phone:* ${data.phone}\n` +
          `${data.address ? `📍 *Address:* ${data.address}\n` : ''}` +
          `${data.email ? `✉️ *Email:* ${data.email}\n` : ''}` +
          `💬 *Message:* ${data.message}`
        );

        window.open(`https://wa.me/${targetWa}?text=${text}`, '_blank');
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="pt-16">
      {/* Hero Header */}
      <section className="bg-[#0A1F44] py-20 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Get In Touch
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Progressive Smart Kids School — Prani Chhavani, Gwalior (MP). We are here to answer your queries!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-playfair text-3xl font-bold text-[#0A1F44] mb-6">School Contact Info</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-orange-50 border border-orange-100">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1F44]">Address</p>
                    <p className="text-gray-700 text-sm mt-0.5">{contactAddress}</p>
                  </div>
                </div>

                <a href={`tel:${contactPhone}`} className="flex items-start gap-4 p-5 rounded-2xl bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1F44]">Phone Number</p>
                    <p className="text-gray-700 text-sm mt-0.5">{contactPhone}</p>
                  </div>
                </a>

                <a href={`mailto:${contactEmail}`} className="flex items-start gap-4 p-5 rounded-2xl bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="w-12 h-12 bg-[#FF7A00] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A1F44]">Email Address</p>
                    <p className="text-gray-700 text-sm mt-0.5">{contactEmail}</p>
                  </div>
                </a>
              </div>

              <div className="bg-[#0A1F44] p-6 rounded-3xl text-white">
                <h3 className="font-bold text-lg text-[#FF7A00] mb-2">Direct WhatsApp Connect</h3>
                <p className="text-white/80 text-sm mb-4">Have quick questions about admissions or school timings? Chat with us directly on WhatsApp.</p>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi Progressive Smart Kids School, I have an enquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  <MessageCircle className="w-5 h-5" /> Open WhatsApp Chat
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                  </motion.div>
                  <h3 className="font-semibold text-[#0A1F44] text-2xl mb-2">Enquiry Sent Successfully!</h3>
                  <p className="text-gray-600 mb-4">Your message has been saved in our database and forwarded to our admin WhatsApp.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary text-sm px-6 py-2.5">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-4">
                  <h3 className="font-playfair text-2xl font-bold text-[#0A1F44]">Admission & General Enquiry</h3>
                  <p className="text-gray-500 text-sm mb-4">Fill out the details below. Submitting will save your query and notify our Admin on WhatsApp.</p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-name">Full Name *</label>
                      <input id="contact-name" {...register('name')} placeholder="Enter your full name" className="input-field" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-phone">Phone Number *</label>
                      <input id="contact-phone" {...register('phone')} placeholder="Enter 10-digit mobile no." className="input-field" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-address">Address / Location *</label>
                    <input id="contact-address" {...register('address')} placeholder="Enter your address (e.g. Prani Chhavani, Gwalior)" className="input-field" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-email">Email Address</label>
                      <input id="contact-email" {...register('email')} placeholder="your@email.com (optional)" className="input-field" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-subject">Subject</label>
                      <input id="contact-subject" {...register('subject')} placeholder="e.g. Class 5th Admission" className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contact-message">Explanation / Message *</label>
                    <textarea id="contact-message" {...register('message')} placeholder="Explain your query in detail..." rows={4} className="input-field resize-none" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    id="contact-submit"
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting & Opening WhatsApp...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Submit & Send to Admin WhatsApp
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Embed for Prani Chhavani Gwalior */}
      <section className="h-80 w-full">
        <iframe
          title="Progressive Smart Kids School Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.509748684618!2d78.1750!3d26.2150!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5d000000001%3A0x0!2zMjLCsDEyJzU0LjAiTiA3OMKwMTAnMzAuMCJF!5e0!3m2!1sen!2sin!4v1680000000000"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </section>
    </div>
  );
}
