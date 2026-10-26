'use client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import StoreInitializer from '@/components/StoreInitializer';
import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showExpiredAlert, setShowExpiredAlert] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('expired') === 'true') {
        setShowExpiredAlert(true);
        // Remove the query parameter from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    }
  }, []);

  // Separate robust auto-dismiss effect keyed on alert state
  useEffect(() => {
    if (showExpiredAlert) {
      const timer = setTimeout(() => {
        setShowExpiredAlert(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showExpiredAlert]);

  return (
    <main className="min-h-screen pb-24 relative selection:bg-emerald-500 selection:text-black bg-[#09090b]">
      <StoreInitializer />
      
      {/* Expiration Alert Banner - Bottom Right Glass Toast */}
      <AnimatePresence>
        {showExpiredAlert && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, y: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-28 right-4 left-4 md:left-auto md:right-8 md:w-[400px] z-[60] rounded-2xl border border-red-500/20 bg-[#0c0c0e]/95 backdrop-blur-xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(239,68,68,0.06),inset_0_1px_0_rgba(255,255,255,0.05)] flex gap-4"
          >
            <div className="text-red-400 shrink-0 bg-red-500/10 border border-red-500/20 p-2.5 h-10 w-10 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.15)]">
              <AlertTriangle size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-red-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                Waktu Sewa Habis
              </h4>
              <p className="text-gray-300 text-xs font-semibold leading-relaxed">
                Waktu pengisian formulir habis. Silakan periksa kembali ketersediaan stok perlengkapan Anda.
              </p>
            </div>
            <button
              onClick={() => setShowExpiredAlert(false)}
              className="text-gray-500 hover:text-white shrink-0 self-start p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <Hero />
      <Catalog />
      <Footer />
      <FloatingCart />
    </main>
  );
}

