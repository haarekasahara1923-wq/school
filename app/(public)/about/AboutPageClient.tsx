'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Quote, Target, Eye, Heart, Star, BookOpen, Building, Cpu, Library,
  Activity, Bus, Utensils, Stethoscope, Sparkles, CheckCircle2, ShieldCheck
} from 'lucide-react';

const facilities = [
  { icon: Cpu, title: 'Smart Classrooms', desc: 'Digital interactive whiteboards and audio-visual e-learning content for all classes.' },
  { icon: Library, title: 'Well-Stocked Library', desc: 'Thousands of academic, reference, fiction, and educational books for all age groups.' },
  { icon: Building, title: 'Science & Computer Labs', desc: 'Modern Physics, Chemistry, Biology, and Computer Science laboratories.' },
  { icon: Activity, title: 'Sports & Playground', desc: 'Facilities for Cricket, Football, Basketball, Volleyball, Badminton & Indoor games.' },
  { icon: Bus, title: 'Transport Facility', desc: 'Fleet of safe school buses covering all major routes across Gwalior city.' },
  { icon: Utensils, title: 'Hygienic Canteen', desc: 'Fresh, nutritious snacks and meals served in a clean, hygienic environment.' },
  { icon: Stethoscope, title: 'Medical First-Aid', desc: 'On-campus first aid facility with regular health check-ups for all students.' },
  { icon: Sparkles, title: 'Co-Curricular Activities', desc: 'Music, Dance, Art & Craft, Drama, Debate, and Robotics clubs.' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To provide quality CBSE education that empowers students from 1st to 12th class to become innovative, moral, and responsible global citizens.' },
  { icon: Eye, title: 'Our Vision', desc: 'To be a premier institution in Gwalior known for academic excellence, character building, and smart technological integration in learning.' },
  { icon: Heart, title: 'Core Values', desc: 'Integrity, Discipline, Inclusivity, Continuous Innovation, and Respect — forming the foundation of our institution.' },
  { icon: Star, title: 'Our Commitment', desc: 'Creating a safe, inspiring environment where every child discovers their unique talents and achieves holistic growth.' },
];

export default function AboutPageClient({ director, principal }: { director: any; principal: any }) {
  return (
    <div className="pt-16">
      {/* Hero Header */}
      <section className="relative bg-[#0A1F44] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/school_campus_1785047794142.jpg" alt="School Campus" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              About Progressive Smart Kids School
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Empowering Minds, Shaping Futures
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              CBSE Affiliated School in Prani Chhavani, Gwalior — Providing world-class education from Class 1st to 12th.
            </p>
          </motion.div>
        </div>
      </section>

      {/* School Introduction Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
              <span className="section-subtitle">School Introduction</span>
              <h2 className="section-title mt-2 mb-6">A Center of Educational Excellence in Gwalior</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-base">
                <p>
                  <strong className="text-[#0A1F44]">Progressive Smart Kids School</strong>, located at Prani Chhavani, Gwalior (MP), is a premier educational institution committed to providing quality education from <strong className="text-[#FF7A00]">Class 1st to 12th</strong>.
                </p>
                <p>
                  Our school follows the CBSE curriculum, offering a balanced mix of rigorous academics, modern technology, and co-curricular development. We focus on conceptual learning, critical thinking, and character formation.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[
                    'Classes 1st to 12th (All Streams)',
                    'CBSE Curriculum & Pedagogy',
                    'Interactive Smart Learning',
                    'Experienced & Caring Faculty',
                    'Focus on Moral Values',
                    'Safe & Green Campus'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#0A1F44]">
                      <CheckCircle2 className="w-4 h-4 text-[#FF7A00] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-100">
                <img src="/school_campus_1785047794142.jpg" alt="School Campus" className="w-full h-80 object-cover" />
                <div className="p-6 bg-[#0A1F44] text-white">
                  <p className="font-bold text-lg text-[#FF7A00]">Progressive Smart Kids School</p>
                  <p className="text-sm text-white/70">Prani Chhavani, Gwalior (MP)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-subtitle">Facilities & Infrastructure</span>
            <h2 className="section-title mt-2">What We Offer Our Students</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Modern facilities designed to ensure safety, comfort, and interactive learning for every child.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, i) => (
              <motion.div
                key={fac.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#FF7A00]/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF7A00] to-[#E06500] rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-orange-500/20">
                  <fac.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{fac.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{fac.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-subtitle">Our Foundation</span>
            <h2 className="section-title mt-2">Vision, Mission & Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-orange-50/50 to-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#0A1F44] rounded-2xl flex items-center justify-center mb-4 text-[#FF7A00]">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Director Message */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 flex justify-center">
              <div className="relative">
                {director?.photoUrl ? (
                  <img src={director.photoUrl} alt={director.name} className="w-72 h-80 rounded-3xl object-cover shadow-2xl border-4 border-white" />
                ) : (
                  <div className="w-72 h-80 rounded-3xl bg-gradient-to-br from-[#FF7A00] to-[#0A1F44] flex flex-col items-center justify-center text-white shadow-2xl p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">👨‍💼</div>
                    <p className="font-bold text-xl">{director?.name || 'Director'}</p>
                    <p className="text-xs text-orange-200 mt-1">Director's Desk</p>
                  </div>
                )}
                <div className="absolute -bottom-4 right-2 bg-[#FF7A00] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                  {director?.designation || 'Director'}
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
              <span className="section-subtitle">Leadership Message</span>
              <h2 className="section-title mt-2 mb-2">{director?.name || "Director's Message"}</h2>
              {director?.qualifications && <p className="text-[#FF7A00] font-medium text-sm mb-4">{director.qualifications}</p>}
              <div className="relative">
                <Quote className="absolute -top-3 -left-3 w-10 h-10 text-[#FF7A00]/20" />
                <p className="text-gray-600 leading-relaxed pl-6 italic text-base">
                  {director?.message ||
                    'Welcome to Progressive Smart Kids School. Our objective is to provide education that empowers children to become confident, competent, and ethical individuals. We integrate modern smart learning with traditional values to build a solid foundation from Class 1st to 12th.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
              <span className="section-subtitle">Academic Guidance</span>
              <h2 className="section-title mt-2 mb-2">{principal?.name || "Principal's Message"}</h2>
              {principal?.qualifications && <p className="text-[#FF7A00] font-medium text-sm mb-4">{principal.qualifications}</p>}
              <div className="relative">
                <Quote className="absolute -top-3 -left-3 w-10 h-10 text-[#FF7A00]/20" />
                <p className="text-gray-600 leading-relaxed pl-6 italic text-base">
                  {principal?.message ||
                    'Education is not merely loading student minds with information; it is nurturing creativity, discipline, and critical thinking. At Progressive Smart Kids School, our dedicated team of educators strives to create a supportive environment where every student thrives academically and personally.'}
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 flex justify-center">
              <div className="relative">
                {principal?.photoUrl ? (
                  <img src={principal.photoUrl} alt={principal.name} className="w-72 h-80 rounded-3xl object-cover shadow-2xl border-4 border-white" />
                ) : (
                  <div className="w-72 h-80 rounded-3xl bg-gradient-to-br from-[#0A1F44] to-[#FF7A00] flex flex-col items-center justify-center text-white shadow-2xl p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl mb-4">👩‍💼</div>
                    <p className="font-bold text-xl">{principal?.name || 'Principal'}</p>
                    <p className="text-xs text-orange-200 mt-1">Principal's Desk</p>
                  </div>
                )}
                <div className="absolute -bottom-4 left-2 bg-[#0A1F44] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                  {principal?.designation || 'Principal'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
