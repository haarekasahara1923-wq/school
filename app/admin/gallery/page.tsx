'use client';
import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Loader2, Trash2, Video, X, Pencil, Check, FileText } from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  type: 'image' | 'video';
  publicId: string;
  createdAt: string;
};

export default function GalleryPage() {
  const { showToast, confirm } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionValue, setCaptionValue] = useState('');
  const [savingCaption, setSavingCaption] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery/items', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } else {
        showToast('error', 'Failed to fetch gallery items');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Network error fetching gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        showToast('error', `${file.name} exceeds 50MB limit. Skipping.`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'progressive-smart-kids/gallery');

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          showToast('error', `Upload failed for ${file.name}: ${err.error || 'Unknown error'}`);
          continue;
        }
        const uploadData = await uploadRes.json();

        const dbRes = await fetch('/api/gallery/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: uploadData.secure_url,
            publicId: uploadData.public_id,
            type,
          }),
        });

        if (!dbRes.ok) {
          const err = await dbRes.json();
          showToast('error', `Failed to save: ${err.error || 'Unknown error'}`);
          continue;
        }
        successCount++;
      } catch (err) {
        console.error(err);
        showToast('error', `Upload failed for ${file.name}`);
      }
    }

    if (successCount > 0) {
      showToast('success', `Uploaded ${successCount} ${type}${successCount > 1 ? 's' : ''} successfully`);
      await fetchItems();
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = (item: GalleryItem) => {
    confirm({
      title: 'Remove Media Item?',
      message: 'Are you sure you want to remove this item from the public gallery?',
      confirmText: 'Delete Item',
      variant: 'danger',
      onConfirm: async () => {
        setDeletingId(item.id);
        try {
          const res = await fetch(`/api/gallery/items/${item.id}`, { method: 'DELETE' });
          if (res.ok) {
            setItems(prev => prev.filter(i => i.id !== item.id));
            if (lightbox?.id === item.id) setLightbox(null);
            showToast('success', 'Gallery item deleted');
          } else {
            showToast('error', 'Failed to delete item');
          }
        } catch {
          showToast('error', 'Network error deleting item');
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const startEditCaption = (item: GalleryItem) => {
    setEditingCaption(item.id);
    setCaptionValue(item.caption || '');
  };

  const saveCaption = async (itemId: string) => {
    setSavingCaption(true);
    try {
      const res = await fetch(`/api/gallery/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: captionValue }),
      });
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, caption: captionValue } : i));
        if (lightbox?.id === itemId) setLightbox(prev => prev ? { ...prev, caption: captionValue } : null);
        showToast('success', 'Caption updated');
        setEditingCaption(null);
      } else {
        showToast('error', 'Failed to update caption');
      }
    } catch {
      showToast('error', 'Network error updating caption');
    } finally {
      setSavingCaption(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Gallery</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload photos, videos & PDFs — they appear on the website <span className="text-green-600 font-medium">instantly</span>.{' '}
            <span className="text-[#FF7A00] font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${uploading ? 'opacity-50 cursor-not-allowed bg-blue-400 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            Add Photos
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={e => handleUpload(e, 'image')}
            />
          </label>

          <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${uploading ? 'opacity-50 cursor-not-allowed bg-purple-400 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
            Add Video
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              disabled={uploading}
              onChange={e => handleUpload(e, 'video')}
            />
          </label>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-700 text-sm font-medium">
          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
          Uploading to Cloudinary... Please wait. Files up to 50MB are supported.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No media yet</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Photos" or "Add Video" above to upload from your device or phone gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map(item => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Thumbnail */}
              <div
                className="aspect-square cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={item.url} alt={item.caption || 'Gallery item'} className="w-full h-full object-cover" loading="lazy" />
                )}

                {item.type === 'video' && (
                  <div className="absolute bottom-8 left-1.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Video className="w-2.5 h-2.5" /> Video
                  </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(item); }}
                    disabled={deletingId === item.id}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); startEditCaption(item); }}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    title="Edit Caption"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Caption edit inline */}
              {editingCaption === item.id ? (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex gap-1">
                  <input
                    autoFocus
                    value={captionValue}
                    onChange={e => setCaptionValue(e.target.value)}
                    placeholder="Add caption..."
                    className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF7A00]"
                    onKeyDown={e => e.key === 'Enter' && saveCaption(item.id)}
                  />
                  <button
                    onClick={() => saveCaption(item.id)}
                    disabled={savingCaption}
                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {savingCaption ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setEditingCaption(null)}
                    className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="px-2 py-1 bg-white">
                  <p className="text-xs text-gray-500 truncate">
                    {item.caption || <span className="text-gray-300 italic">No caption</span>}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <video src={lightbox.url} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img src={lightbox.url} alt={lightbox.caption || ''} className="w-full max-h-[80vh] object-contain rounded-xl" />
            )}
            <div className="flex justify-between items-center mt-3 px-1 gap-3">
              <div className="flex-1">
                {editingCaption === lightbox.id ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={captionValue}
                      onChange={e => setCaptionValue(e.target.value)}
                      placeholder="Add caption..."
                      className="flex-1 text-sm px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none"
                      onKeyDown={e => e.key === 'Enter' && saveCaption(lightbox.id)}
                    />
                    <button
                      onClick={() => saveCaption(lightbox.id)}
                      disabled={savingCaption}
                      className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {savingCaption ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </button>
                    <button onClick={() => setEditingCaption(null)} className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-white/70 text-sm">{lightbox.caption || 'No caption'}</p>
                    <button
                      onClick={() => startEditCaption(lightbox)}
                      className="p-1 text-white/50 hover:text-white transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(lightbox)}
                disabled={deletingId === lightbox.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingId === lightbox.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
