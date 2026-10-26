'use client';

import { useStore } from '@/store/useStore';
import * as LucideIcons from 'lucide-react';
import {
  ShoppingBag, X, ChevronRight, Zap, Trash2, Plus, Minus,
  Calendar, Clock, Package,
} from 'lucide-react';
import { getAvailableStock } from '@/lib/stockCalculator';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FloatingCart() {
  const {
    cart, nightCount, dateRange,
    removeFromCart, clearCart, updateQuantity, startBookingLock, products
  } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    return sum + product.pricePerNight * item.quantity * nightCount;
  }, 0);
  const minimumDP = subtotal * 0.3;

  const formattedFrom = dateRange.from
    ? new Date(dateRange.from).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : null;
  const formattedTo = dateRange.to
    ? new Date(dateRange.to).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : null;

  return (
    <>
      {/* ── FAB Trigger Button ── */}
      <AnimatePresence>
        {totalItems > 0 && !isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center group"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(56px) saturate(220%)',
              WebkitBackdropFilter: 'blur(56px) saturate(220%)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            <div className="relative">
              <ShoppingBag
                size={22}
                className="text-white group-hover:text-emerald-400 transition-colors duration-300"
              />
              <motion.span
                key={totalItems}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 text-black text-[10px] font-black rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 0 10px rgba(16,185,129,0.7)',
                }}
              >
                {totalItems}
              </motion.span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] z-50 flex flex-col"
              style={{
                background: 'linear-gradient(160deg, rgba(16,16,18,0.97) 0%, rgba(9,9,11,0.99) 60%)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '-20px 0 80px rgba(0,0,0,0.8), inset 1px 0 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Ambient glow inside drawer */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
              />

              {/* ── Header ── */}
              <div
                className="relative px-6 pt-6 pb-5 flex flex-col gap-4 shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                {/* Top row: title + actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 100%)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        boxShadow: '0 0 12px rgba(16,185,129,0.12)',
                      }}
                    >
                      <ShoppingBag size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white tracking-tight leading-none">Keranjang Sewa</h2>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mt-0.5">
                        {totalItems} item dipilih
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="text-[9px] uppercase tracking-[0.15em] font-black text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-xl"
                        style={{
                          background: 'rgba(239,68,68,0.06)',
                          border: '1px solid rgba(239,68,68,0.15)',
                        }}
                      >
                        Kosongkan
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-white transition-colors rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Date pill */}
                {formattedFrom && formattedTo && (
                  <div className="flex items-center gap-2">
                    <div
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.04) 100%)',
                        border: '1px solid rgba(16,185,129,0.18)',
                      }}
                    >
                      <Calendar size={11} className="text-emerald-400 shrink-0" />
                      <span className="text-[10px] font-black text-emerald-400 tracking-wide">
                        {formattedFrom} → {formattedTo}
                      </span>
                      <div className="w-px h-3 bg-white/10" />
                      <Clock size={11} className="text-cyan-400 shrink-0" />
                      <span className="text-[10px] font-black text-cyan-400 tabular-nums">
                        {nightCount} Malam
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Item List ── */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Package size={32} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-600">Keranjang kosong</p>
                      <p className="text-xs text-gray-700 mt-1 font-medium">Tambahkan alat dari katalog</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {cart.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      const stockLimit = getAvailableStock(product.id, dateRange.from, dateRange.to, products);
                      const Icon = (LucideIcons as any)[product.iconName] || LucideIcons.HelpCircle;
                      const itemTotal = product.pricePerNight * item.quantity * nightCount;
                      const atStockLimit = item.quantity >= stockLimit;

                      return (
                        <motion.div
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, x: 24, scale: 0.97 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -24, scale: 0.95 }}
                          transition={{ duration: 0.22, delay: idx * 0.03 }}
                          className="relative rounded-[1.4rem] p-[1px]"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 60%, rgba(16,185,129,0.05) 100%)',
                          }}
                        >
                          {/* Top shimmer */}
                          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full" />

                          <div
                            className="rounded-[1.35rem] p-4 flex items-center gap-4"
                            style={{
                              background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(10,10,12,0.97) 65%)',
                              backdropFilter: 'blur(40px) saturate(180%)',
                              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                            }}
                          >
                            {/* Product icon */}
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                              style={{
                                background: 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(0,0,0,0.2) 100%)',
                                border: '1px solid rgba(16,185,129,0.18)',
                                boxShadow: '0 0 12px rgba(16,185,129,0.08)',
                              }}
                            >
                              <Icon size={22} strokeWidth={1.25} className="text-emerald-400/80" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-white font-bold text-[13px] leading-tight mb-1"
                                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                              >
                                {product.name}
                              </h4>
                              <p className="text-[10px] text-gray-600 font-mono">
                                Rp {product.pricePerNight.toLocaleString('id-ID')}/mlm
                              </p>
                              <p className="text-xs font-black text-emerald-400 font-mono mt-1 tabular-nums">
                                Rp {itemTotal.toLocaleString('id-ID')}
                              </p>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col items-end gap-2.5 shrink-0">
                              {/* Qty stepper */}
                              <div
                                className="flex items-center gap-1 rounded-xl p-1"
                                style={{
                                  background: 'rgba(0,0,0,0.4)',
                                  border: '1px solid rgba(255,255,255,0.07)',
                                }}
                              >
                                <button
                                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-90"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="text-white font-black text-sm w-5 text-center tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.productId, Math.min(stockLimit, item.quantity + 1))}
                                  disabled={atStockLimit}
                                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-90 ${
                                    atStockLimit
                                      ? 'text-gray-700 cursor-not-allowed'
                                      : 'text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300'
                                  }`}
                                >
                                  <Plus size={13} />
                                </button>
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                                title="Hapus"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* ── Footer: Summary + CTA ── */}
              {cart.length > 0 && (
                <div
                  className="px-5 pb-6 pt-4 shrink-0"
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: 'linear-gradient(0deg, rgba(9,9,11,0.98) 0%, transparent 100%)',
                  }}
                >
                  {/* Summary card */}
                  <div
                    className="rounded-2xl p-4 mb-4 space-y-2.5"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                        Total Biaya Sewa
                      </span>
                      <span className="text-xl font-black text-white tabular-nums tracking-tight">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="h-px bg-white/05" />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Min. DP (30%)
                      </span>
                      <span className="text-sm font-black text-emerald-400 font-mono tabular-nums">
                        Rp {minimumDP.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    disabled={cart.length === 0 || nightCount <= 0}
                    onClick={() => {
                      startBookingLock();
                      router.push('/checkout');
                    }}
                    className={`w-full flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 active:scale-95 disabled:cursor-not-allowed ${
                      cart.length > 0 && nightCount > 0
                        ? 'text-white border border-white/10 hover:border-emerald-500/60 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                        : 'text-white/30 border border-white/5 shadow-none'
                    }`}
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    Data Sewa
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
