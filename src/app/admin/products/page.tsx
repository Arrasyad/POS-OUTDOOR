'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Edit2, Check, X, ShieldAlert, Plus, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  pricePerNight: number;
  stock: number;
  category: string;
  iconName?: string;
  imageUrl?: string;
  isBundle: boolean;
  description?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formCategory, setFormCategory] = useState('tenda');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice(0);
    setFormStock(0);
    setFormCategory('tenda');
    setFormDescription('');
    setFormImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.pricePerNight);
    setFormStock(p.stock);
    setFormCategory(p.category);
    setFormDescription(p.description || '');
    setFormImageUrl(p.imageUrl || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormImageUrl(data.url);
      } else {
        alert('Gagal mengunggah gambar');
      }
    } catch (error) {
      console.error('Upload error', error);
      alert('Gagal mengunggah gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formName || formPrice <= 0 || formStock < 0) {
      alert('Nama, Harga, dan Stok harus diisi dengan benar.');
      return;
    }

    const payload = {
      name: formName,
      pricePerNight: formPrice,
      stock: formStock,
      category: formCategory,
      description: formDescription,
      imageUrl: formImageUrl || undefined,
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchProducts();
          closeModal();
        } else {
          alert('Gagal memperbarui produk');
        }
      } else {
        // Create
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          fetchProducts();
          closeModal();
        } else {
          alert('Gagal menambah produk');
        }
      }
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Gagal menghapus produk, mungkin alat ini bagian dari paket atau pernah dipesan.');
      }
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Manajemen <span className="text-emerald-400">Alat</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Tambah, edit, dan kelola foto serta detail alat sewa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari Alat..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl transition-all w-full sm:w-auto"
          >
            <Plus size={18} />
            Tambah Alat
          </button>
        </div>
      </div>

      <div className="mb-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 p-3 rounded-xl flex items-start gap-3 text-sm">
        <ShieldAlert size={18} className="shrink-0 mt-0.5" />
        <p><strong>Catatan:</strong> Stok paket (Bundle) dihitung otomatis. Saat ini penambahan Paket (Bundle) baru hanya bisa dilakukan melalui kode, namun Anda bisa mengedit nama dan harganya di sini.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#0c0c0e]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Alat</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Harga / Malam</th>
                  <th className="px-6 py-4">Sisa Stok</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0 relative">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div className="font-bold text-white flex flex-col">
                          <span className="flex items-center gap-2">
                            {product.name}
                            {product.isBundle && (
                              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase tracking-widest font-black">Paket</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-400">{product.category}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-300">Rp {product.pricePerNight.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black ${product.stock < 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {product.isBundle ? 'Otomatis' : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-emerald-400 transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        {!product.isBundle && (
                          <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-400 transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8"
            >
              <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-black text-white mb-6">
                {editingProduct ? 'Edit Alat' : 'Tambah Alat Baru'}
              </h2>

              <div className="space-y-6">
                {/* Upload Gambar */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Foto Alat (Opsional)</label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                      {formImageUrl ? (
                        <Image src={formImageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-gray-600" />
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        <UploadCloud size={16} />
                        Pilih Gambar
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Disarankan rasio 1:1 (persegi). Maksimal 2MB.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Alat</label>
                    <input 
                      type="text" 
                      value={formName} onChange={e => setFormName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                    <select 
                      value={formCategory} onChange={e => setFormCategory(e.target.value)}
                      className="w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                      <option value="tenda">Tenda</option>
                      <option value="tas">Tas / Carrier</option>
                      <option value="tidur">Peralatan Tidur</option>
                      <option value="masak">Peralatan Masak</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Harga Sewa / Malam</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                      <input 
                        type="number" 
                        value={formPrice} onChange={e => setFormPrice(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stok Tersedia</label>
                    <input 
                      type="number" 
                      value={formStock} onChange={e => setFormStock(Number(e.target.value))}
                      disabled={editingProduct?.isBundle}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi (Opsional)</label>
                  <textarea 
                    value={formDescription} onChange={e => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                  <button onClick={closeModal} className="px-5 py-2.5 text-gray-400 hover:text-white font-semibold transition-colors">Batal</button>
                  <button 
                    onClick={handleSave} 
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-2.5 rounded-xl transition-all"
                  >
                    <Check size={18} />
                    Simpan Alat
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
