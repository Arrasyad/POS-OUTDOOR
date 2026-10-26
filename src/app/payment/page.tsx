'use client';

import { useStore } from '@/store/useStore';
import StoreInitializer from '@/components/StoreInitializer';
import Navbar from '@/components/Navbar';
import PaymentPhaseA from '@/components/PaymentPhaseA';
import PaymentPhaseB from '@/components/PaymentPhaseB';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const {
    cart,
    bookingLockExpiresAt,
    bookingStatus,
    paymentPhase,
    resetBookingState,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Guard: redirect se cart kosong atau status bukan locked/paid
  useEffect(() => {
    if (!mounted) return;
    if (cart.length === 0 || (bookingStatus !== 'locked' && bookingStatus !== 'paid')) {
      router.replace('/checkout');
    }
  }, [mounted, cart, bookingStatus, router]);

  // Countdown timer — melanjutkan sisa waktu dari store
  useEffect(() => {
    if (!bookingLockExpiresAt || !mounted || bookingStatus === 'paid') return;

    const calculateRemaining = () => {
      const diff = bookingLockExpiresAt - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    const initial = calculateRemaining();
    setTimeLeft(initial);
    if (initial <= 0) return;

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingLockExpiresAt, mounted, bookingStatus]);

  // Timer habis → redirect ke home
  useEffect(() => {
    if (mounted && timeLeft !== null && timeLeft <= 0 && bookingStatus !== 'paid') {
      resetBookingState();
      window.location.replace('/?expired=true');
    }
  }, [timeLeft, mounted, bookingStatus, resetBookingState]);

  if (!mounted || cart.length === 0) return null;

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '15:00';
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeLeft !== null && timeLeft < 60;
  const isReceipt = paymentPhase === 'receipt' || bookingStatus === 'paid';

  return (
    <main className="min-h-screen bg-[#09090b] text-[#ededed] relative selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      <StoreInitializer />
      <Navbar />

      {/* Background ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(16,185,129,0.07),transparent)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_70%,rgba(16,185,129,0.04),transparent)] pointer-events-none z-0" />
      {isReceipt && (
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(16,185,129,0.06),transparent)] pointer-events-none z-0" />
      )}

      {/* Page content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">

        {/* Top Controls Row — Back Button & Timer */}
        {!isReceipt && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-between mb-10 gap-4 flex-wrap"
          >
            {/* Back button */}
            <button
              onClick={() => router.push('/checkout')}
              className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all duration-300"
            >
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/08"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <ArrowLeft size={16} className="text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              </span>
              Kembali ke Form Data
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
        )}

        {/* Dynamic Phase */}
        <AnimatePresence mode="wait">
          {isReceipt ? (
            <PaymentPhaseB key="phase-b" />
          ) : (
            <PaymentPhaseA
              key="phase-a"
              timeLeft={timeLeft}
              isTimeCritical={isTimeCritical}
              formatTime={formatTime}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
