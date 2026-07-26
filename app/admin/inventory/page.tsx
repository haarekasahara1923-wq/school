'use client';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Package, AlertCircle, CheckCircle, Search, Edit2, Trash2, X, Save } from 'lucide-react';
import { useToast } from '@/components/admin/ToastContext';

type InventoryItem = {
  id: string;
  itemName: string;
  category: string | null;
  quantity: number;
  unit: string | null;
  location: string | null;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  minQuantity: number;
  lastRestocked: string | null;
  remarks: string | null;
};

const statusColors = {
  in_stock: 'bg-green-100 text-green-700',
  low_stock: 'bg-orange-100 text-orange-700',
  out_of_stock: 'bg-red-100 text-red-700',
};

const statusLabels = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

const defaultItem = {
  itemName: '', category: '', quantity: 0, unit: 'pcs', location: '', minQuantity: 10, remarks: ''
};

export default function InventoryPage() {
  const { showToast, confirm } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({ ...defaultItem });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        showToast('error', 'Failed to fetch inventory items');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error loading inventory');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ ...defaultItem });
    setIsModalOpen(true);
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      category: item.category || '',
      quantity: item.quantity,
      unit: item.unit || 'pcs',
      location: item.location || '',
      minQuantity: item.minQuantity,
      remarks: item.remarks || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ ...defaultItem });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName) return;
    
    setSaving(true);
    
    let status = 'in_stock';
    if (formData.quantity === 0) status = 'out_of_stock';
    else if (formData.quantity <= formData.minQuantity) status = 'low_stock';

    try {
      if (editingItem) {
        const res = await fetch(`/api/inventory/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status }),
        });

        if (res.ok) {
          showToast('success', `Updated inventory item ${formData.itemName}`);
          closeModal();
          fetchInventory();
        } else {
          const err = await res.json();
          showToast('error', err.error || 'Failed to update item');
        }
      } else {
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status }),
        });

        if (res.ok) {
          showToast('success', `Added new item ${formData.itemName}`);
          closeModal();
          fetchInventory();
        } else {
          const err = await res.json();
          showToast('error', err.error || 'Failed to add item');
        }
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Network error while saving item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: 'Delete Inventory Item?',
      message: `Are you sure you want to remove "${name}" from inventory?`,
      confirmText: 'Delete Item',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setItems(prev => prev.filter(i => i.id !== id));
            showToast('success', `Deleted "${name}"`);
          } else {
            showToast('error', 'Failed to delete item');
          }
        } catch {
          showToast('error', 'Network error');
        }
      },
    });
  };

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track school supplies, assets, and reorder levels.</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search items by name or category..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full">{items.filter(i => i.status === 'out_of_stock').length} Out of Stock</span>
            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full">{items.filter(i => i.status === 'low_stock').length} Low Stock</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Item Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">In Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-[#0A1F44]">{item.itemName}</div>
                    <div className="text-xs text-gray-400">ID: {item.id.slice(0,8)}</div>
                  </td>
                  <td className="p-4 text-gray-600">{item.category || '-'}</td>
                  <td className="p-4 text-gray-600">{item.location || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${item.quantity <= item.minQuantity ? 'text-red-500' : 'text-gray-800'}`}>
                        {item.quantity}
                      </span>
                      <span className="text-gray-500 text-sm">{item.unit}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max ${statusColors[item.status]}`}>
                      {item.status === 'in_stock' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 transition-colors rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.itemName)} className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredItems.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p>No inventory items found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-4xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-playfair text-xl font-bold text-[#0A1F44]">
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 max-w-4xl">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input type="text" required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input type="text" placeholder="e.g. Stationery, Electronics" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input type="number" required min="0" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input type="text" placeholder="e.g. pcs, boxes, kgs" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min. Alert Quantity</label>
                <input type="number" min="0" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.minQuantity} onChange={(e) => setFormData({...formData, minQuantity: parseInt(e.target.value) || 0})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location</label>
                <input type="text" placeholder="e.g. Store Room 1, Shelf B" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="md:col-span-3 pt-2 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-5 py-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : (editingItem ? 'Save Changes' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
