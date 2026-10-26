'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

interface Metrics {
  totalRevenue: number;
  activeTransactions: number;
  totalCustomers: number;
}

export default function AdminDashboardOverview() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch('/api/admin/metrics');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">
          Ringkasan <span className="text-emerald-400">Bisnis</span>
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Pantau performa penyewaan secara real-time.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0c0c0e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet size={80} className="text-emerald-400" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Wallet size={20} />
              </div>
              <h3 className="font-bold text-gray-400">Total Pendapatan</h3>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              Rp {metrics?.totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <TrendingUp size={12} /> Sedang berlangsung
            </div>
          </motion.div>

          {/* Active Bookings Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0c0c0e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package size={80} className="text-blue-400" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-gray-400">Transaksi Aktif</h3>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics?.activeTransactions} Pesanan
            </div>
            <Link href="/admin/bookings" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block font-semibold underline-offset-4 hover:underline">
              Kelola Pesanan &rarr;
            </Link>
          </motion.div>

          {/* Customers Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0c0c0e]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={80} className="text-purple-400" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-gray-400">Total Pelanggan</h3>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {metrics?.totalCustomers} Orang
            </div>
            <Link href="/admin/users" className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block font-semibold underline-offset-4 hover:underline">
              Lihat Database &rarr;
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
