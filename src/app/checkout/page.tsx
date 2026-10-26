'use client';

import { useStore } from '@/store/useStore';
import StoreInitializer from '@/components/StoreInitializer';
import Navbar from '@/components/Navbar';
import * as LucideIcons from 'lucide-react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Check, 
  Calendar,
  ChevronRight,
  Shield,
  Zap,
  Package,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cart, 
    dateRange, 
    nightCount, 
    bookingLockExpiresAt, 
    resetBookingState,
    setUserData,
    setBookingStatus,
    formDraft,
    setFormDraft,
    products,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Form state — initialized from persisted draft so navigation doesn't wipe the form
  const [fullName, setFullName] = useState(formDraft.fullName);
  const [whatsappNumber, setWhatsappNumber] = useState(formDraft.whatsappNumber);
  const [notes, setNotes] = useState(formDraft.notes);
  const [agreeTerms, setAgreeTerms] = useState(formDraft.agreeTerms);

  const [nameTouched, setNameTouched] = useState(false);
  const [waTouched, setWaTouched] = useState(false);

  // Persist form draft to store whenever any field changes
  useEffect(() => {
    setFormDraft({ fullName, whatsappNumber, notes, agreeTerms });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, whatsappNumber, notes, agreeTerms]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && cart.length === 0) {
      router.push('/');
    }
  }, [mounted, cart, router]);

  // Countdown timer effect
  useEffect(() => {
    if (!bookingLockExpiresAt || !mounted) return;

    const calculateRemaining = () => {
      const diff = bookingLockExpiresAt - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    const initialRemaining = calculateRemaining();
    setTimeLeft(initialRemaining);

    if (initialRemaining <= 0) return;

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingLockExpiresAt, mounted]);

  // Redirect when time expires
  useEffect(() => {
    if (mounted && timeLeft !== null && timeLeft <= 0) {
      resetBookingState();
      window.location.replace('/?expired=true');
    }
  }, [timeLeft, mounted, resetBookingState]);

  if (!mounted || cart.length === 0) return null;

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '15:00';
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const isTimeCritical = timeLeft !== null && timeLeft < 60;


  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    return sum + (product.pricePerNight * item.quantity * nightCount);
  }, 0);

  const formattedDateFrom = dateRange.from 
    ? new Date(dateRange.from).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const formattedDateTo = dateRange.to 
    ? new Date(dateRange.to).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const isNameValid = fullName.trim().length > 0;
  const isWaValid = /^08[0-9]{8,11}$/.test(whatsappNumber);
  const isFormValid = isNameValid && isWaValid && agreeTerms;

  const handleWaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setWhatsappNumber(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setUserData({ fullName, whatsappNumber });
    setBookingStatus('locked');
    router.push('/payment');
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-[#ededed] relative selection:bg-emerald-500 selection:text-black font-sans overflow-x-hidden">
      <StoreInitializer />
      <Navbar />

      {/* — Background ambience (matches Level 0) — */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(16,185,129,0.06),transparent)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_70%,rgba(16,185,129,0.04),transparent)] pointer-events-none z-0" />

      {/* — Page content — */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-44">

        {/* ── Top Controls Row ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center justify-between mb-10 gap-4 flex-wrap"
        >
          {/* Back button */}
          <button
            onClick={() => router.push('/')}
            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all duration-300"
          >
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/08"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <ArrowLeft size={16} className="text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            Kembali ke Katalog
          </button>

          {/* Countdown Timer */}
          <motion.div
            animate={isTimeCritical ? { scale: [1, 1.02, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{
              background: isTimeCritical
                ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(0,0,0,0.4) 100%)'
                : 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(0,0,0,0.4) 100%)',
              border: isTimeCritical
                ? '1px solid rgba(239,68,68,0.2)'
                : '1px solid rgba(16,185,129,0.15)',
              boxShadow: isTimeCritical
                ? '0 0 16px rgba(239,68,68,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 0 16px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <Clock
              size={15}
              className={isTimeCritical ? 'text-red-400 animate-pulse' : 'text-emerald-400'}
            />
            <span className="text-xs font-black tracking-[0.12em] uppercase text-gray-400">
              Selesai Dalam:
            </span>
            <span
              className={`font-mono font-black text-base tabular-nums ${isTimeCritical ? 'text-red-400' : 'text-emerald-400'}`}
            >
              {formatTime(timeLeft)}
            </span>
          </motion.div>
        </motion.div>

        {/* ── Page Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white mb-2">
            Formulir{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.35)]">
              Kontak
            </span>
          </h1>
          <p className="text-base text-gray-500 font-medium">
            Lengkapi data di bawah untuk mengkonfirmasi pesanan sewa perlengkapanmu.
          </p>
        </motion.div>

        {/* ── Main Bento Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* ═══ LEFT COLUMN — Form + KTP Disclaimer ═══ */}
          <div className="lg:col-span-3 space-y-5">

            {/* — Contact Form Card — */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-[1.75rem] p-[1px]"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, rgba(16,185,129,0.06) 100%)',
              }}
            >
              {/* Top shimmer */}
              <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />

              <div
                className="rounded-[1.7rem] p-6 md:p-8 space-y-7"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(10,10,12,0.97) 65%)',
                  backdropFilter: 'blur(60px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
              >
                {/* Card header */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      boxShadow: '0 0 16px rgba(16,185,129,0.1)',
                    }}
                  >
                    <User size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight mt-0.5">Data Diri Penyewa</h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      Kami tidak menyimpan foto KTP atau data sensitif secara online.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Full Name Input */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-[0.18em] pl-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => setNameTouched(true)}
                        placeholder="Sesuai KTP asli Anda"
                        className="w-full text-white text-base font-semibold rounded-2xl px-5 py-4 focus:outline-none transition-all duration-300 placeholder-gray-600"
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: nameTouched && !isNameValid
                            ? '1px solid rgba(239,68,68,0.35)'
                            : fullName
                            ? '1px solid rgba(16,185,129,0.3)'
                            : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: nameTouched && !isNameValid
                            ? '0 0 0 3px rgba(239,68,68,0.06)'
                            : fullName
                            ? '0 0 0 3px rgba(16,185,129,0.06)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}
                      />
                      <AnimatePresence>
                        {nameTouched && !isNameValid && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs font-bold text-red-400 mt-2 pl-1 tracking-wide"
                          >
                            ✕ Nama wajib diisi sesuai KTP
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* WhatsApp Number Input */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-[0.18em] pl-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                      Nomor WhatsApp Aktif
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={whatsappNumber}
                        onChange={handleWaChange}
                        onBlur={() => setWaTouched(true)}
                        placeholder="Contoh: 081234567890"
                        className="w-full text-white text-base font-semibold rounded-2xl px-5 py-4 focus:outline-none transition-all duration-300 placeholder-gray-600"
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: waTouched && !isWaValid
                            ? '1px solid rgba(239,68,68,0.35)'
                            : whatsappNumber && isWaValid
                            ? '1px solid rgba(16,185,129,0.3)'
                            : '1px solid rgba(255,255,255,0.07)',
                          boxShadow: waTouched && !isWaValid
                            ? '0 0 0 3px rgba(239,68,68,0.06)'
                            : whatsappNumber && isWaValid
                            ? '0 0 0 3px rgba(16,185,129,0.06)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                        }}
                      />
                      <AnimatePresence>
                        {waTouched && !isWaValid && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs font-bold text-red-400 mt-2 pl-1 tracking-wide"
                          >
                            ✕ Format: 10–13 digit, diawali 08 (cth: 08123456789)
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-1.5 text-xs font-black text-gray-500 uppercase tracking-[0.18em] pl-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                      Catatan Tambahan
                      <span className="text-gray-500 normal-case tracking-normal font-medium ml-1">(Opsional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Misal: tenda warna apa saja, jam pengambilan, dll."
                      rows={3}
                      className="w-full text-white text-base font-semibold rounded-2xl px-5 py-4 focus:outline-none transition-all duration-300 placeholder-gray-600 resize-none"
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: notes ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                      }}
                    />
                  </div>

                </form>
              </div>

              {/* Bottom shimmer */}
              <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/08 to-transparent rounded-full" />
            </motion.div>

            {/* — KTP Disclaimer Card — */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="relative rounded-[1.75rem] p-[1px]"
              style={{
                background: 'linear-gradient(145deg, rgba(245,158,11,0.15) 0%, rgba(255,255,255,0.02) 60%, rgba(245,158,11,0.04) 100%)',
              }}
            >
              <div
                className="rounded-[1.7rem] p-6 md:p-8"
                style={{
                  background: 'linear-gradient(145deg, rgba(245,158,11,0.04) 0%, rgba(10,10,12,0.97) 65%)',
                  backdropFilter: 'blur(60px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      boxShadow: '0 0 14px rgba(245,158,11,0.12)',
                    }}
                  >
                    <Shield size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white tracking-tight mt-0.5">Syarat Jaminan Fisik</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      Verifikasi dilakukan langsung di toko, bukan online.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/05 mb-6" />

                <ul className="space-y-5">
                  {[
                    { icon: '📋', text: 'Wajib membawa KTP Fisik Asli yang namanya sesuai dengan nama di formulir ini.' },
                    { icon: '🔐', text: 'KTP Fisik Asli ditinggal di toko sebagai jaminan sah selama masa peminjaman, dan dikembalikan utuh saat alat pulang.' },
                    { icon: '⚠️', text: 'Alat tidak akan diserahkan jika KTP tidak dibawa atau nama berbeda dengan data pemesanan.' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </div>

          {/* ═══ RIGHT COLUMN — Order Summary ═══ */}
          <div className="lg:col-span-2 space-y-5">

            {/* — Date Info Card — */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-[1.75rem] p-[1px]"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 60%, rgba(16,185,129,0.06) 100%)',
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
                  <Calendar size={15} />
                  Jadwal Sewa
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">Berangkat</span>
                    <span className="text-sm font-black text-emerald-400 text-right">{formattedDateFrom}</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">Pulang</span>
                    <span className="text-sm font-black text-emerald-400 text-right">{formattedDateTo}</span>
                  </div>
                  <div className="h-px bg-white/05" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Durasi</span>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.06) 100%)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}
                    >
                      <span className="text-sm font-black text-emerald-400 tabular-nums">
                        {nightCount + 1} Hari {nightCount} Malam
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/06 to-transparent" />
            </motion.div>

            {/* — Cart Items Card — */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.27 }}
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
                  Keranjang ({totalItemsCount} item)
                </h3>

                {/* Cart items list */}
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
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0.2) 100%)',
                            border: '1px solid rgba(16,185,129,0.15)',
                          }}
                        >
                          <Icon size={18} strokeWidth={1.5} className="text-emerald-400/80" />
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

                {/* Totals */}
                <div className="h-px bg-white/05" />
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                    <span className="text-white font-black text-base font-mono">
                      Rp {subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Min. DP (30%)</span>
                    <span className="text-emerald-400 font-black text-sm font-mono">
                      Rp {(subtotal * 0.3).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/06 to-transparent" />
            </motion.div>

          </div>

        </div>
      </div>

      {/* ══ Sticky Bottom CTA Panel ══ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-5 border-t border-white/06"
        style={{
          background: 'linear-gradient(0deg, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.90) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-5">

          {/* Pricing summary (left side) */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              Total Biaya ({totalItemsCount} Alat · {nightCount} Malam)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white tracking-tighter tabular-nums">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              DP Minimal: Rp {(subtotal * 0.3).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Right side: checkbox + CTA */}
          <div className="flex flex-col gap-4 md:w-[460px]">

            {/* Terms checkbox */}
            <label className="flex items-start gap-4 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  agreeTerms
                    ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'border-white/10 bg-black/40 group-hover:border-white/20'
                }`}
              >
                {agreeTerms && <Check size={16} className="text-black stroke-[3]" />}
              </div>
              <span className="text-sm text-gray-500 group-hover:text-gray-400 font-medium leading-relaxed transition-colors">
                Saya mengerti dan setuju dengan{' '}
                <span className="text-gray-300 font-bold">Syarat Jaminan KTP Fisik</span> &{' '}
                <span className="text-gray-300 font-bold">Kebijakan Pembatalan</span> Pos Outdoor.
              </span>
            </label>

            {/* CTA Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-300 active:scale-95 disabled:cursor-not-allowed ${
                isFormValid
                  ? 'text-white border border-white/10 hover:border-emerald-500/60 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'text-white/30 border border-white/5 shadow-none'
              }`}
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              Bayar
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
