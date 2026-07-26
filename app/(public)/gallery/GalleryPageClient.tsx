'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ImageIcon, Video, Filter } from 'lucide-react';
import Mascot from '@/components/public/Mascot';

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  type: 'image' | 'video';
  publicId: string;
};

export default function GalleryPageClient({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="pt-16">
      {/* Hero Header */}
      <section className="bg-[#0A1F44] py-20 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF9A3C] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Our Campus Life
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              School Gallery
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Real-time glimpse into events, celebrations, smart learning, and activities at Progressive Smart Kids School.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Buttons */}
          <div className="flex justify-center items-center gap-3 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[#FF7A00] text-white shadow-md shadow-orange-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Media ({items.length})
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                filter === 'image'
                  ? 'bg-[#FF7A00] text-white shadow-md shadow-orange-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Photos ({items.filter(i => i.type === 'image').length})
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                filter === 'video'
                  ? 'bg-[#FF7A00] text-white shadow-md shadow-orange-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Video className="w-4 h-4" /> Videos ({items.filter(i => i.type === 'video').length})
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <Mascot size="md" />
              <p className="text-gray-500 mt-4 text-lg font-medium">No media uploaded in this category yet.</p>
              <p className="text-gray-400 text-sm mt-1">Admin will upload photos and videos soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  viewport={{ once: true }}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 bg-gray-100 border border-gray-100 aspect-square"
                  onClick={() => setLightbox(item)}
                >
                  {item.type === 'video' ? (
                    <div className="relative w-full h-full bg-black">
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-[#0A1F44] ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={item.url}
                        alt={item.caption || 'School photo'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}

                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-sm font-medium line-clamp-2">{item.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              {lightbox.type === 'video' ? (
                <video
                  src={lightbox.url}
                  controls
                  autoPlay
                  className="w-full max-h-[80vh] rounded-2xl shadow-2xl"
                />
              ) : (
                <img
                  src={lightbox.url}
                  alt={lightbox.caption || ''}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
              {lightbox.caption && (
                <p className="text-white/90 text-base text-center mt-4 bg-white/10 px-6 py-2 rounded-full">
                  {lightbox.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
