'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageCircle, Calendar, User, Phone, Package, ExternalLink, X, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Barcode from 'react-barcode';
import { useState } from 'react';

const ADMIN_WA = '6283838665398'; // ← Ganti dengan nomor WA admin toko

export default function PaymentPhaseB() {
  const { bookingCode, userData, cart, dateRange, nightCount, products, paymentMethod } = useStore();
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    return sum + product.pricePerNight * item.quantity * nightCount;
  }, 0);

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

  const handleWhatsApp = () => {
    const code = bookingCode ?? '—';
    const receiptLink = `posoutdoor.com/receipt/${code}`;
    const text =
      `Halo Admin Pos Outdoor, saya telah melakukan pembayaran sewa alat gunung via web.%0A%0A` +
      `Nama: ${userData?.fullName ?? '—'}%0A` +
      `Kode Booking: #${code}%0A` +
      `Link Nota Digital: ${receiptLink}%0A%0A` +
      `Sampai jumpa di toko pada hari pengambilan!`;
    window.open(`https://wa.me/${ADMIN_WA}?text=${text}`, '_blank');
  };

  const containerStyle = {
    background: 'linear-gradient(145deg,rgba(255,255,255,0.04),rgba(10,10,12,0.97))',
    backdropFilter: 'blur(60px) saturate(180%)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.07)',
  };

  return (
    <>
      <motion.div
        key="phase-b"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6 max-w-2xl mx-auto"
      >

        {/* ── Success Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative rounded-[1.75rem] p-[1px] overflow-hidden"
          style={{
            background: 'linear-gradient(145deg,rgba(16,185,129,0.3),rgba(16,185,129,0.05))',
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />

          <div
            className="rounded-[1.7rem] p-8 text-center relative"
            style={containerStyle}
          >
            {/* Checkmark Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.08))',
                border: '2px solid rgba(16,185,129,0.4)',
                boxShadow: '0 0 40px rgba(16,185,129,0.2)',
              }}
            >
              <CheckCircle2 size={36} className="text-emerald-400" />
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
              PEMBAYARAN <span className="text-emerald-400">BERHASIL!</span>
            </h1>
            <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
              Terima kasih,{' '}
              <span className="text-white font-bold">{userData?.fullName ?? 'Penyewa'}</span>!{' '}
              Perlengkapan petualanganmu resmi kami amankan. 🏕️
            </p>
          </div>
        </motion.div>

        {/* ── Booking Receipt Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative rounded-[1.75rem] p-[1px]"
          style={{
            background: 'linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02),rgba(16,185,129,0.06))',
          }}
        >
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />

          <div className="rounded-[1.7rem] overflow-hidden" style={containerStyle}>

            {/* Card Header */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg,rgba(16,185,129,0.07),transparent)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Package size={16} className="text-emerald-400" />
              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">
                Bukti Sewa Digital — Pos Outdoor
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">

              {/* Kode Booking + Barcode */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-black mb-1">Kode Booking</p>
                  <p
                    className="text-3xl font-black tracking-tight"
                    style={{
                      background: 'linear-gradient(90deg,#10b981,#34d399)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    #{bookingCode ?? '—'}
                  </p>
                </div>

                {/* Barcode */}
                {bookingCode && (
                  <div
                    className="p-3 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                  >
                    <Barcode
                      value={bookingCode}
                      format="CODE128"
                      width={1.6}
                      height={55}
                      displayValue={false}
                      background="#ffffff"
                      lineColor="#000000"
                      margin={4}
                    />
                    <p className="text-center text-[10px] font-black text-gray-600 mt-2 tracking-widest">
                      SCAN SAAT PENGAMBILAN DI TOKO
                    </p>
                  </div>
                )}
              </div>

              <div className="h-px bg-white/06" style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.08) 0,rgba(255,255,255,0.08) 6px,transparent 6px,transparent 12px)' }} />

              {/* Identitas & Jadwal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <InfoRow icon={<User size={14} className="text-emerald-400" />} label="Nama Penyewa" value={userData?.fullName ?? '—'} />
                  <InfoRow icon={<Phone size={14} className="text-emerald-400" />} label="No. WhatsApp" value={userData?.whatsappNumber ?? '—'} />
                </div>
                <div className="space-y-3">
                  <InfoRow icon={<Calendar size={12} className="text-emerald-400" />} label="Tanggal Ambil" value={`${formattedDateFrom} (mulai 08.00 WIB)`} />
                  <InfoRow icon={<Calendar size={12} className="text-amber-400" />} label="Tanggal Kembali" value={`${formattedDateTo} (maks. 20.00 WIB)`} />
                </div>
              </div>

              <div
                className="flex items-center justify-center gap-2 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-[11px] text-gray-500">Durasi:</span>
                <span className="text-sm font-black text-white">
                  {nightCount + 1} Hari {nightCount} Malam
                </span>
                <span className="text-xs text-gray-500">(Hitungan: {nightCount} malam)</span>
              </div>

              <div className="h-px bg-white/06" style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.08) 0,rgba(255,255,255,0.08) 6px,transparent 6px,transparent 12px)' }} />

              {/* Tabel Inventaris */}
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.15em] mb-3">Detail Inventaris Alat</p>
                <div className="space-y-2">
                  {cart.map((item) => {
                    const product = products.find(p => p.id === item.productId);
                    if (!product) return null;
                    const lineTotal = product.pricePerNight * item.quantity * nightCount;
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                          >
                            {item.quantity}
                          </span>
                          <span className="text-xs text-gray-300 truncate">{product.name}</span>
                        </div>
                        <span className="text-xs font-bold text-white shrink-0">
                          Rp{lineTotal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between px-3">
                    <span className="text-xs text-gray-500 font-semibold">Tipe Pembayaran</span>
                    <span className="text-xs font-black text-emerald-400">{paymentMethod === 'LUNAS' ? 'LUNAS' : 'DP (Uang Muka)'}</span>
                  </div>
                  
                  {paymentMethod === 'DP' && (
                    <div className="flex items-center justify-between px-3">
                      <span className="text-xs text-gray-500 font-semibold">Sisa Pembayaran (Di Toko)</span>
                      <span className="text-xs font-black text-amber-400">
                        Rp{(subtotal - Math.round(subtotal * 0.3)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-3 px-3 py-3 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.04))',
                      border: '1px solid rgba(16,185,129,0.15)',
                    }}
                  >
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      {paymentMethod === 'LUNAS' ? 'Total Dibayar' : 'Total DP Dibayar'}
                    </span>
                    <span className="text-base font-black text-white">
                      Rp{(paymentMethod === 'LUNAS' ? subtotal : Math.round(subtotal * 0.3)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Refund Policy Link */}
                <button
                  onClick={() => setShowRefundPolicy(true)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  Lihat Kebijakan Pembatalan & Refund
                </button>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(37,211,102,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black tracking-tight transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg,#25d366,#128c7e)',
                  boxShadow: '0 8px 28px rgba(37,211,102,0.2),inset 0 1px 0 rgba(255,255,255,0.15)',
                  color: '#fff',
                }}
              >
                <MessageCircle size={18} />
                💬 Kirim Nota ke WhatsApp Admin Pos Outdoor
              </motion.button>
              <p className="text-center text-xs text-gray-500 mt-3 mb-6">
                Klik untuk membuka WA dengan pesan notifikasi otomatis
              </p>

              <button
                onClick={() => {
                  useStore.getState().finishTransaction();
                  window.location.href = '/';
                }}
                className="w-full flex items-center justify-center py-3.5 rounded-xl text-sm font-bold text-gray-400 bg-gray-500/10 hover:bg-gray-500/20 hover:text-white transition-all border border-gray-500/10"
              >
                Selesai & Kembali ke Beranda
              </button>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* ── Refund Policy Modal ── */}
      <AnimatePresence>
        {showRefundPolicy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowRefundPolicy(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm rounded-[1.75rem] p-[1px] overflow-hidden"
              style={{
                background: 'linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-[1.7rem] p-6 space-y-4"
                style={containerStyle}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={15} className="text-amber-400" />
                    <h3 className="text-sm font-black text-white">Kebijakan Pembatalan & Refund</h3>
                  </div>
                  <button
                    onClick={() => setShowRefundPolicy(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/08 transition-colors"
                  >
                    <X size={13} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { timing: 'H-3 atau lebih', refund: '100%', color: 'emerald', desc: 'Pembatalan 3 hari sebelum ambil' },
                    { timing: 'H-1', refund: '50%', color: 'amber', desc: 'Pembatalan 1 hari sebelum ambil' },
                    { timing: 'Hari H', refund: '0%', color: 'red', desc: 'Pembatalan di hari pengambilan — hangus' },
                  ].map((rule) => (
                    <div
                      key={rule.timing}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{
                        background: `rgba(${rule.color === 'emerald' ? '16,185,129' : rule.color === 'amber' ? '245,158,11' : '239,68,68'},0.06)`,
                        border: `1px solid rgba(${rule.color === 'emerald' ? '16,185,129' : rule.color === 'amber' ? '245,158,11' : '239,68,68'},0.15)`,
                      }}
                    >
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-lg shrink-0"
                        style={{
                          background: `rgba(${rule.color === 'emerald' ? '16,185,129' : rule.color === 'amber' ? '245,158,11' : '239,68,68'},0.15)`,
                          color: rule.color === 'emerald' ? '#10b981' : rule.color === 'amber' ? '#f59e0b' : '#ef4444',
                        }}
                      >
                        {rule.timing}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400">{rule.desc}</p>
                      </div>
                      <span
                        className="text-sm font-black shrink-0"
                        style={{ color: rule.color === 'emerald' ? '#10b981' : rule.color === 'amber' ? '#f59e0b' : '#ef4444' }}
                      >
                        {rule.refund}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Hubungi admin toko melalui WhatsApp untuk proses pembatalan.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Reusable info row component
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-xs text-gray-200 font-semibold leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
