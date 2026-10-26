'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, CheckCircle2, Info, Package } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useStore } from '@/store/useStore';
import Image from 'next/image';

interface PaymentPhaseAProps {
  timeLeft: number | null;
  isTimeCritical: boolean;
  formatTime: (s: number | null) => string;
}

export default function PaymentPhaseA({ timeLeft, isTimeCritical, formatTime }: PaymentPhaseAProps) {
  const { cart, nightCount, dateRange, userData, confirmPayment, products, paymentMethod, setPaymentMethod } = useStore();

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    return sum + product.pricePerNight * item.quantity * nightCount;
  }, 0);

  const dpMinimal = Math.round(subtotal * 0.3);

  const formattedDateFrom = dateRange.from
    ? new Date(dateRange.from).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—';

  const formattedDateTo = dateRange.to
    ? new Date(dateRange.to).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—';

  return (
    <motion.div
      key="phase-a"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >



      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* ═══ LEFT — QRIS Widget ═══ */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">

          {/* QRIS Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative rounded-[1.75rem] p-[1px]"
            style={{
              background: 'linear-gradient(145deg,rgba(16,185,129,0.15),rgba(255,255,255,0.03),rgba(16,185,129,0.05))',
            }}
          >
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent rounded-full" />

            <div
              className="rounded-[1.7rem] p-6 md:p-8"
              style={{
                background: 'linear-gradient(145deg,rgba(255,255,255,0.04),rgba(10,10,12,0.97))',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))',
                    border: '1px solid rgba(16,185,129,0.25)',
                    boxShadow: '0 0 14px rgba(16,185,129,0.1)',
                  }}
                >
                  <Zap size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Pembayaran QRIS</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Scan menggunakan E-Wallet atau Mobile Banking</p>
                </div>
              </div>

              {/* QR Display */}
              <div className="flex flex-col items-center gap-5">
                <div
                  className="relative p-4 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* QRIS Placeholder — ganti dengan gambar QRIS asli */}
                  <div className="w-52 h-52 flex flex-col items-center justify-center gap-2 bg-white">
                    <svg viewBox="0 0 100 100" className="w-44 h-44">
                      {/* QR border squares */}
                      <rect x="5" y="5" width="25" height="25" rx="2" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="10" y="10" width="15" height="15" rx="1" fill="#000"/>
                      <rect x="70" y="5" width="25" height="25" rx="2" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="75" y="10" width="15" height="15" rx="1" fill="#000"/>
                      <rect x="5" y="70" width="25" height="25" rx="2" fill="none" stroke="#000" strokeWidth="3"/>
                      <rect x="10" y="75" width="15" height="15" rx="1" fill="#000"/>
                      {/* QR data modules (simplified) */}
                      {[35,40,45,50,55,60,65].map((x, i) =>
                        [35,40,45,50,55,60,65].map((y, j) =>
                          (i + j) % 2 === 0 ? (
                            <rect key={`${i}-${j}`} x={x} y={y} width="4" height="4" fill="#000"/>
                          ) : null
                        )
                      )}
                      <rect x="35" y="5" width="4" height="4" fill="#000"/>
                      <rect x="42" y="5" width="4" height="4" fill="#000"/>
                      <rect x="49" y="5" width="4" height="4" fill="#000"/>
                      <rect x="56" y="5" width="4" height="4" fill="#000"/>
                      <rect x="5" y="35" width="4" height="4" fill="#000"/>
                      <rect x="5" y="42" width="4" height="4" fill="#000"/>
                      <rect x="5" y="49" width="4" height="4" fill="#000"/>
                      <rect x="91" y="35" width="4" height="4" fill="#000"/>
                      <rect x="91" y="42" width="4" height="4" fill="#000"/>
                      {/* QRIS label */}
                      <text x="50" y="97" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#000">QRIS</text>
                    </svg>
                  </div>
                  <p className="text-center text-xs font-black text-gray-700 mt-1 tracking-widest uppercase">
                    Pos Outdoor
                  </p>
                </div>

                <p className="text-sm text-gray-400 text-center max-w-xs">
                  Scan QRIS di atas menggunakan aplikasi <span className="text-white font-semibold">GoPay, OVO, Dana, LinkAja</span> atau Mobile Banking Anda.
                </p>

                {/* Loading Spinner */}
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl w-full justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">Menunggu pembayaran Anda terdeteksi...</span>
                </div>

                {/* --- Simulasi Button (PROTOTYPE ONLY) --- */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmPayment}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg,rgba(16,185,129,0.9),rgba(5,150,105,0.9))',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.25),inset 0 1px 0 rgba(255,255,255,0.15)',
                    color: '#fff',
                  }}
                >
                  <CheckCircle2 size={15} />
                  Simulasi: Pembayaran Berhasil ✓
                </motion.button>
                <p className="text-[10px] text-gray-600 text-center -mt-2">
                  Tombol ini hanya untuk demonstrasi prototipe
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══ RIGHT — Cost Breakdown ═══ */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">

          {/* Rincian Biaya */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative rounded-[1.75rem] p-[1px]"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 60%, rgba(16,185,129,0.04) 100%)',
            }}
          >
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            <div
              className="rounded-[1.7rem] p-6 space-y-5"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(10,10,12,0.97) 65%)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
            >
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                <Package size={15} />
                Rincian Pembayaran
              </h3>

              {/* Alat summary */}
              <div className="space-y-3 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/03 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full pr-1.5">
                {cart.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  const Icon = (LucideIcons as any)[product.iconName] || LucideIcons.HelpCircle;
                  const itemTotal = product.pricePerNight * item.quantity * nightCount;
                  return (
                    <motion.div 
                      key={item.productId} 
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.04 }}
                      className="flex items-center gap-3.5 rounded-2xl p-3.5"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Product icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0.2) 100%)',
                          border: '1px solid rgba(16,185,129,0.15)',
                        }}
                      >
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                        ) : (
                          <Icon size={18} strokeWidth={1.5} className="text-emerald-400/80" />
                        )}
                      </div>

                      {/* Name + qty */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-white font-bold text-sm leading-tight"
                          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          {item.quantity}× · Rp {product.pricePerNight.toLocaleString('id-ID')}/mlm
                        </p>
                      </div>

                      {/* Subtotal */}
                      <span className="font-mono font-black text-emerald-400 text-sm shrink-0">
                        Rp {itemTotal.toLocaleString('id-ID')}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="h-px bg-white/05" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Sewa</span>
                  <span className="text-base font-black text-white tabular-nums font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <div className="h-px bg-white/05" />

                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Pilih Metode Pembayaran:</p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Opsi Lunas */}
                  <button
                    onClick={() => setPaymentMethod('LUNAS')}
                    className="p-3.5 rounded-xl border text-center transition-colors text-left w-full h-full"
                    style={{
                      background: paymentMethod === 'LUNAS' ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
                      border: paymentMethod === 'LUNAS' ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <p className={`text-xs font-black uppercase tracking-wider mb-1 ${paymentMethod === 'LUNAS' ? 'text-emerald-400' : 'text-gray-400'}`}>Lunas</p>
                    <p className="text-sm font-black text-white tabular-nums font-mono">Rp {subtotal.toLocaleString('id-ID')}</p>
                  </button>
                  {/* Opsi DP */}
                  <button
                    onClick={() => setPaymentMethod('DP')}
                    className="p-3.5 rounded-xl border text-center transition-colors text-left w-full h-full"
                    style={{
                      background: paymentMethod === 'DP' ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
                      border: paymentMethod === 'DP' ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <p className={`text-xs font-black uppercase tracking-wider mb-1 ${paymentMethod === 'DP' ? 'text-emerald-400' : 'text-gray-400'}`}>DP Minimal</p>
                    <p className="text-sm font-black text-white tabular-nums font-mono">Rp {dpMinimal.toLocaleString('id-ID')}</p>
                  </button>
                </div>
              </div>

              {/* Jadwal */}
              <div className="h-px bg-white/05" />
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">Ambil</span>
                  <span className="text-sm font-black text-emerald-400 text-right">{formattedDateFrom}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">Kembali</span>
                  <span className="text-sm font-black text-emerald-400 text-right">{formattedDateTo}</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/06 to-transparent" />
          </motion.div>

          {/* Jaminan KTP Disclaimer */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <Shield size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-400 leading-relaxed">
              Pembayaran ini adalah <span className="text-white font-semibold">pengunci stok sah</span>. Pengambilan alat tetap wajib meninggalkan{' '}
              <span className="text-white font-semibold">KTP Asli</span> di toko.
            </p>
          </motion.div>

          {/* Penyewa Info */}
          {userData && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
              style={{
                background: 'rgba(16,185,129,0.05)',
                border: '1px solid rgba(16,185,129,0.12)',
              }}
            >
              <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Penyewa</p>
                <p className="text-sm text-white font-bold">{userData.fullName}</p>
                <p className="text-xs text-gray-400">{userData.whatsappNumber}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
