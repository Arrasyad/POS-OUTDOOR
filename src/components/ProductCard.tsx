'use client';
import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/productsMock';
import { useStore } from '@/store/useStore';
import { getAvailableStock } from '@/lib/stockCalculator';
import { lockNavbar, unlockNavbar } from '@/lib/scrollLock';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Props {
  product: Product;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  styleOrder?: number;
}

export default function ProductCard({ product, isExpanded, onToggleExpand, styleOrder }: Props) {
  const { cart, addToCart, updateQuantity, isDateLocked, dateRange, products } = useStore();
  
  const cartItem = cart.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;
  
  const dynamicStock = getAvailableStock(product.id, dateRange.from, dateRange.to, products);
  const availableStock = dynamicStock - quantity;
  const isOutOfStock = dynamicStock <= 0 || availableStock <= 0;

  const Icon = (LucideIcons as any)[product.iconName] || LucideIcons.HelpCircle;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const MOCK_IMAGES = [0, 1, 2];
  const cardRef = useRef<HTMLDivElement>(null);
  
  const layoutTransition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const };

  useEffect(() => {
    if (!isExpanded) {
      setIsImageFullscreen(false);
      setCurrentImageIndex(0);
    } else {
      lockNavbar();
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(unlockNavbar, 900);
      }, 420);
    }
  }, [isExpanded]);

  return (
    <motion.div
      ref={cardRef}
      layout
      transition={{ layout: layoutTransition }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        if (isExpanded) {
           setIsImageFullscreen(false);
           if (onToggleExpand) onToggleExpand();
        } else {
           if (onToggleExpand) onToggleExpand();
        }
      }}
      className={`relative rounded-[1.4rem] p-[1px] flex flex-col group/card cursor-pointer ${
        dynamicStock <= 0 ? 'opacity-40 grayscale' : ''
      } ${isExpanded ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 min-h-[560px] max-h-[560px] md:min-h-[560px] md:max-h-[560px]' : 'col-span-1'}`}
      style={{
        order: styleOrder,
        background: dynamicStock > 0
          ? 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, rgba(16,185,129,0.06) 100%)'
          : 'rgba(255,255,255,0.04)',
      }}
    >
      {/* Inner card */}
      <motion.div
        layout
        transition={{ layout: layoutTransition }}
        className={`flex-1 flex overflow-hidden ${
          isExpanded ? 'flex-col md:flex-row rounded-[1.35rem]' : 'flex-col rounded-[1.35rem]'
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(12,12,14,0.95) 60%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: dynamicStock > 0
            ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Left Side (Original Card Content) */}
        <motion.div layout transition={{ layout: layoutTransition }} className={`flex flex-col ${isExpanded ? (isImageFullscreen ? 'w-full h-full' : 'md:w-64 shrink-0') : 'w-full h-full'}`}>
        {/* Image area */}
        <motion.div
          layout
          transition={{ layout: layoutTransition }}
          onClick={(e) => {
             if (isExpanded) {
               e.stopPropagation();
               setIsImageFullscreen(!isImageFullscreen);
             }
          }}
          className={`relative flex items-center justify-center w-full ${isExpanded ? 'flex-1 min-h-[220px] cursor-pointer' : 'h-28'} overflow-hidden`}
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.2) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover/card:from-emerald-500/8 group-hover/card:to-cyan-500/5 transition-all duration-700" />
          {/* Top shimmer */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          
          <motion.div
            layout
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ layout: layoutTransition, opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
            className={`absolute flex items-center justify-center ${
              product.imageUrl
                ? 'inset-0 w-full h-full'
                : isExpanded
                  ? (isImageFullscreen ? 'w-64 h-64 sm:w-80 sm:h-80' : 'w-24 h-24')
                  : 'w-11 h-11'
            }`}
          >
            {product.imageUrl ? (
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover/card:scale-110" 
                sizes="(max-width: 768px) 100vw, 300px" 
              />
            ) : (
              <Icon
                strokeWidth={1.5}
                className="w-full h-full text-emerald-400/80 group-hover/card:text-emerald-400 group-hover/card:scale-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all duration-500"
              />
            )}
          </motion.div>

          {/* Left/Right Arrows for Expanded State */}
          <AnimatePresence>
            {isExpanded && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentImageIndex(prev => prev === 0 ? MOCK_IMAGES.length - 1 : prev - 1); 
                  }}
                  className={`absolute left-3 p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all ${isImageFullscreen ? 'scale-125 left-6' : ''}`}
                >
                  <ChevronLeft size={16} />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentImageIndex(prev => (prev + 1) % MOCK_IMAGES.length); 
                  }}
                  className={`absolute right-3 p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all ${isImageFullscreen ? 'scale-125 right-6' : ''}`}
                >
                  <ChevronRight size={16} />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Carousel Indicators */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10"
              >
                {MOCK_IMAGES.map((idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'bg-emerald-400 w-4 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-white/30 w-1.5 hover:bg-white/50'}`}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {/* In-cart badge */}
          {quantity > 0 && (
            <div
              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-black"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 10px rgba(16,185,129,0.6)',
              }}
            >
              {quantity}
            </div>
          )}
        </motion.div>

        {/* Info */}
        {(!isExpanded || !isImageFullscreen) && (
          <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ layout: layoutTransition }}
            className="p-3.5 flex flex-col flex-1"
          >
            <h3
                className={`font-bold leading-tight mb-1 ${isExpanded ? 'text-base' : 'text-[13px]'} ${dynamicStock <= 0 ? 'text-red-400/70' : 'text-white'}`}
                title={product.name}
                style={{ display: '-webkit-box', WebkitLineClamp: isExpanded ? 3 : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {product.name}
              </h3>
              <p className={`text-emerald-400 font-bold tracking-tight mb-1 ${isExpanded ? 'text-sm' : 'text-xs'}`}>
                Rp {product.pricePerNight.toLocaleString('id-ID')}
                <span className="text-[9px] text-gray-500 font-medium ml-1">/ mlm</span>
              </p>
              <div className="text-[9px] font-black tracking-widest uppercase mb-3 min-h-[14px]">
                {isDateLocked && (
                  <span className={
                    dynamicStock <= 0 ? 'text-red-400/80' :
                    availableStock <= 0 ? 'text-red-400/80' :
                    'text-emerald-500/60'
                  }>
                    {dynamicStock <= 0 ? '✕ Stok Habis' : availableStock <= 0 ? 'TERSEDIA: 0' : `Tersedia: ${availableStock}`}
                  </span>
                )}
              </div>

          {/* CTA button area */}
          <div className="mt-auto relative h-9">
            <AnimatePresence initial={false} mode="wait">
              {quantity > 0 ? (
                <motion.div
                  key="counter"
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-between rounded-xl px-1"
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    boxShadow: '0 0 12px rgba(16,185,129,0.1), inset 0 1px 0 rgba(16,185,129,0.1)',
                  }}
                >
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/15 rounded-lg transition-all active:scale-90"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-black text-white text-sm w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={isOutOfStock || !isDateLocked}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all active:scale-90 ${
                      isOutOfStock || !isDateLocked ? 'text-gray-600 cursor-not-allowed' : 'text-emerald-400 hover:bg-emerald-500/15'
                    }`}
                  >
                    <Plus size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="add"
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.25 }}
                  onClick={() => addToCart(product.id)}
                  disabled={dynamicStock <= 0 || !isDateLocked}
                  className="absolute inset-0 w-full rounded-xl font-bold text-[11px] tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95"
                  style={
                    dynamicStock <= 0 || !isDateLocked
                      ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.7)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                        }
                  }
                  title={!isDateLocked ? 'Pilih & kunci tanggal terlebih dahulu' : ''}
                  onMouseEnter={e => {
                    if (!(dynamicStock <= 0 || !isDateLocked)) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg,#10b981,#059669)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#000';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
                      (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(16,185,129,0.5)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!(dynamicStock <= 0 || !isDateLocked)) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06)';
                      (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,255,255,0.08)';
                    }
                  }}
                >
                  <ShoppingCart size={13} />
                  {!isDateLocked ? 'Kunci Tanggal' : dynamicStock <= 0 ? 'Habis' : 'Sewa Alat'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        )}
      </motion.div>

        {/* Right Side (Expanded Details) */}
        {(isExpanded && !isImageFullscreen) && (
          <motion.div
            layout
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ layout: layoutTransition, opacity: { duration: 0.4, delay: 0.15 }, filter: { duration: 0.4, delay: 0.15 } }}
            className="flex-1 flex flex-col p-4 md:p-6 border-t md:border-t-0 md:border-l border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-bold text-white">Detail Produk</h4>
              </div>
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                {product.description || 'Peralatan standar tinggi yang dirawat secara berkala untuk memastikan keamanan dan kenyamanan Anda saat berkegiatan di alam bebas.'}
              </p>
              
              <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                {product.bundleItems ? 'Isi Paket' : 'Keunggulan'}
              </h5>
              <ul className="space-y-2">
                {product.bundleItems ? (
                  product.bundleItems.map((item, idx) => {
                    const itemStock = isDateLocked ? getAvailableStock(item.productId, dateRange.from, dateRange.to, products) : 999;
                    const isItemEmpty = isDateLocked && itemStock <= 0;
                    return (
                      <li key={idx} className={`flex items-start gap-2 text-xs capitalize ${isItemEmpty ? 'text-red-400/80 line-through' : 'text-gray-300'}`}>
                        <span className={`${isItemEmpty ? 'text-red-500/70' : 'text-emerald-500/70'} mt-0.5`}>•</span>
                        {item.quantity}x {item.productId.replace(/-/g, ' ')}
                        {isItemEmpty && <span className="ml-auto text-[9px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded no-underline">HABIS</span>}
                      </li>
                    );
                  })
                ) : (
                  <>
                    <li className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-emerald-500/70 mt-0.5">•</span>
                      Kualitas material standar pendakian
                    </li>
                    <li className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-emerald-500/70 mt-0.5">•</span>
                      Selalu dicek keamanannya
                    </li>
                    <li className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="text-emerald-500/70 mt-0.5">•</span>
                      Disewakan dalam kondisi bersih
                    </li>
                  </>
                )}
              </ul>
            </div>
            </motion.div>
          )}
      </motion.div>
    </motion.div>
  );
}
