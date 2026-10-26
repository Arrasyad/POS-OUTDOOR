'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Calendar, ChevronDown, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  nightCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: {
    fullName: string;
    whatsappNumber: string;
  };
  items: {
    productId: string;
    quantity: number;
    product: {
      name: string;
    };
  }[];
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'DP_PAID': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'PAID': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">
              Admin <span className="text-emerald-400">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Kelola pesanan dan pantau stok barang.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Cari Kode atau Nama..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Kode Booking</th>
                    <th className="px-6 py-4">Penyewa</th>
                    <th className="px-6 py-4">Jadwal Sewa</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total Harga</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        Tidak ada transaksi ditemukan.
                      </td>
                    </tr>
                  ) : filteredBookings.map((booking) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={booking.id} 
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-emerald-400">{booking.id}</span>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white">{booking.user.fullName}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{booking.user.whatsappNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Calendar size={13} className="text-gray-500" />
                          <span className="font-medium">
                            {new Date(booking.startDate).toLocaleDateString('id-ID', { day:'numeric', month:'short' })} 
                            {' - '}
                            {new Date(booking.endDate).toLocaleDateString('id-ID', { day:'numeric', month:'short' })}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">{booking.nightCount} Malam</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {booking.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-gray-400 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[9px] font-bold text-white">
                                {item.quantity}
                              </span>
                              <span className="capitalize">{item.product?.name || item.productId}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-white">
                        Rp {booking.totalPrice.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer ${getStatusColor(booking.status)}`}
                          style={{ backgroundImage: 'none' }}
                        >
                          <option value="PENDING" className="bg-[#09090b] text-white">PENDING (Tunggu DP)</option>
                          <option value="DP_PAID" className="bg-[#09090b] text-white">DP PAID (Uang Muka)</option>
                          <option value="PAID" className="bg-[#09090b] text-white">PAID (Lunas)</option>
                          <option value="COMPLETED" className="bg-[#09090b] text-white">COMPLETED (Barang Dikembalikan)</option>
                          <option value="CANCELLED" className="bg-[#09090b] text-white">CANCELLED (Batal / Expired)</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
