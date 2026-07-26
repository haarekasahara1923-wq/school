'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import {
  GraduationCap, Users, Award, BookOpen, Star, ArrowRight,
  Phone, MessageCircle, ChevronDown, Sparkles, Trophy, Heart,
  Building, ShieldCheck, Cpu, Library, Activity, Bus, Utensils, Stethoscope
} from 'lucide-react';
import Mascot from '@/components/public/Mascot';

const stats = [
  { icon: Users, value: '1500+', label: 'Happy Students' },
  { icon: GraduationCap, value: '90+', label: 'Qualified Teachers' },
  { icon: Award, value: '25+', label: 'Years of Trust' },
  { icon: Trophy, value: '100%', label: 'Board Pass Rate' },
];

const highlights = [
  { icon: BookOpen, title: 'Class 1st to 12th CBSE', desc: 'Complete educational journey from primary to senior secondary with modern CBSE curriculum.' },
  { icon: Cpu, title: 'Smart Classrooms', desc: 'Interactive digital learning boards and audio-visual tools in every classroom.' },
  { icon: Activity, title: 'Sports & Wellness', desc: 'Spacious playground, indoor/outdoor sports, yoga, and physical education programs.' },
  { icon: ShieldCheck, title: 'Safe & Secure Campus', desc: '24x7 CCTV surveillance, safe transport facility, and dedicated security staff.' },
];

const facilitiesList = [
  { icon: Cpu, name: 'Smart Classes', color: 'bg-blue-50 text-blue-600' },
  { icon: Library, name: 'Digital Library', color: 'bg-orange-50 text-[#FF7A00]' },
  { icon: Building, name: 'Science Labs', color: 'bg-purple-50 text-purple-600' },
  { icon: Activity, name: 'Sports Complex', color: 'bg-green-50 text-green-600' },
  { icon: Bus, name: 'Safe Transport', color: 'bg-amber-50 text-amber-600' },
  { icon: Utensils, name: 'Hygienic Canteen', color: 'bg-rose-50 text-rose-600' },
  { icon: Stethoscope, name: 'First Aid Care', color: 'bg-teal-50 text-teal-600' },
  { icon: Sparkles, name: 'Co-Curriculars', color: 'bg-indigo-50 text-indigo-600' },
];

const newsItems = [
  '🎓 Admissions Open for Session 2025-26 (Nursery to Class XII)',
  '🏆 Students Secur Top Positions in CBSE Board Examination',
  '⚽ Annual Sports Meet & Cultural Fest Announcement',
  '🔬 New Advanced Robotics & Computer Lab Inaugurated',
];

function NewsTicker() {
  return (
    <div className="bg-[#FF7A00] text-white py-2.5 overflow-hidden shadow-sm">
      <div className="flex items-center gap-4 px-4 max-w-7xl mx-auto">
        <span className="shrink-0 font-bold text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
          Announcements
        </span>
        <div className="overflow-hidden flex-1">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 whitespace-nowrap text-sm font-medium"
          >
            {[...newsItems, ...newsItems].map((item, i) => (
              <span key={i} className="shrink-0">{item}</span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [whatsapp, setWhatsapp] = useState('918962678915');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          const wa = data.find((s: any) => s.key === 'whatsapp_number');
          if (wa?.value) setWhatsapp(wa.value);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="mt-16 lg:mt-20">
        <NewsTicker />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0A1F44]">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44] via-[#0A1F44]/90 to-transparent z-10" />

        {/* Hero Background Image */}
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img
            src="/school_hero_bg_1785047643008.jpg"
            alt="Progressive Smart Kids School"
            className="w-full h-full object-cover opacity-35"
          />
        </motion.div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              ✨ Admissions Open 2025-26 (Class 1st to 12th)
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Welcome to <br />
              <span className="text-[#FF7A00]">Progressive Smart Kids</span> School
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl">
              Nurturing values, academic excellence, and modern skills in Gwalior. Preparing students from 1st to 12th grade for a bright future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Enquire Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I want to inquire about admissions at Progressive Smart Kids School.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </a>
            </div>

            <div className="flex items-center gap-6 mt-8 text-white/70 text-sm">
              <span className="flex items-center gap-2">📍 Prani Chhavani, Gwalior (MP)</span>
              <a href="tel:8962678915" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#FF7A00]" /> 8962678915
              </a>
            </div>
          </motion.div>

          {/* Featured Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <img
                src="/school_classroom_1785047662462.jpg"
                alt="Smart Classroom"
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="bg-[#FF7A00] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  State-of-the-Art
                </span>
                <h3 className="text-white font-bold text-xl mt-2">Interactive Smart Classrooms</h3>
                <p className="text-white/70 text-sm">Modern technology integrated learning for every student.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 z-20"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Facilities Strip */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="section-subtitle">World Class Infrastructure</span>
            <h2 className="text-2xl font-bold text-[#0A1F44] mt-1">Our Core Facilities</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {facilitiesList.map((fac, i) => (
              <motion.div
                key={fac.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white p-4 rounded-2xl border border-gray-100 text-center hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-2"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${fac.color}`}>
                  <fac.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#0A1F44]">{fac.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF7A00]/10 rounded-2xl mb-4">
                  <stat.icon className="w-7 h-7 text-[#FF7A00]" />
                </div>
                <p className="font-playfair text-3xl font-bold text-[#0A1F44]">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="section-subtitle">Why Choose Us</span>
            <h2 className="section-title mt-2">Excellence in Every Dimension</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Providing holistic CBSE education from Class 1st to 12th in Prani Chhavani, Gwalior.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-orange-100 border border-gray-100 hover:border-[#FF7A00]/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-orange-500/20">
                  <h.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{h.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[#0A1F44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF7A00] to-[#E06500] p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="relative z-10">
              <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-white mb-3">
                Admissions Open for Session 2025-26
              </h2>
              <p className="text-white/90 text-lg max-w-xl">
                Classes 1st to 12th. Give your child the best foundation for future success at Progressive Smart Kids School.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/contact"
                className="bg-white text-[#FF7A00] font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                Enquire Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I want to inquire about admissions.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
