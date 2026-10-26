'use client';
import { Mountain, Menu, MapPin, Phone, ShieldCheck, Check, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { isNavbarLocked } from '@/lib/scrollLock';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const { cart, dateRange, isDateLocked } = useStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavbarLocked()) return;
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasDates = !!dateRange.from && !!dateRange.to;
  const hasItems = cart.length > 0;

  const step1Done = hasDates && hasItems && pathname !== '/';
  const step1Active = pathname === '/';
  const step2Active = pathname === '/checkout';
  const step2Done = pathname === '/payment';
  const step3Active = pathname === '/payment';

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 w-full z-50 flex justify-center px-4 pointer-events-none">
      <nav
        ref={navRef}
        className="relative w-full max-w-6xl flex flex-col pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top rounded-[30px]"
        style={{
          boxShadow: isScrolling 
            ? '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' 
            : '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)',
        }}
      >
        {/* Isolated Glass Layer to prevent GPU composite bugs */}
        <div 
          className={`absolute inset-0 pointer-events-none -z-10 rounded-[30px] transition-all duration-700 ${
            isScrolling
              ? 'bg-[#09090b]/60 backdrop-blur-[16px] saturate-150 border border-white/5'
              : 'bg-white/[0.04] backdrop-blur-[24px] saturate-[180%] border border-white/10'
          }`}
        />
        {/* TOP BAR */}
        <div className={`flex items-center justify-between w-full transition-all duration-500 ease-in-out shrink-0 ${
          isScrolling ? 'h-12 px-4 md:px-5' : 'h-[60px] px-5 md:px-8'
        }`}>
          {/* LEFT: Logo + Menu Links */}
          <div className="flex items-center gap-5 md:gap-7">
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 text-white cursor-pointer group shrink-0"
              onClick={() => window.location.reload()}
            >
              <div
                className={`bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_18px_rgba(16,185,129,0.55)] group-hover:shadow-[0_0_28px_rgba(16,185,129,0.8)] group-hover:scale-105 ${
                  isScrolling ? 'w-7 h-7' : 'w-9 h-9'
                }`}
              >
                <Mountain size={isScrolling ? 14 : 17} className="text-black transition-all duration-500" />
              </div>
              <span
                className={`font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 hidden sm:block transition-all duration-500 ${
                  isScrolling ? 'text-sm' : 'text-lg'
                }`}
              >
                Pos Outdoor
              </span>
            </div>

            {/* Divider */}
            <div className={`hidden md:block w-px bg-white/10 transition-all duration-500 ${isScrolling ? 'h-4' : 'h-5'}`} />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-5 relative">
              {[
                { icon: ShieldCheck, id: 'sk', label: 'S&K Jaminan' },
                { icon: MapPin, id: 'lokasi', label: 'Lokasi' },
                { icon: Phone, id: 'admin', label: 'Hubungi Admin' },
              ].map(({ icon: Icon, id, label }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(isActive ? null : id)}
                    className={`flex items-center gap-1.5 font-semibold transition-all duration-300 group pointer-events-auto ${
                      isScrolling ? 'text-[11px]' : 'text-xs'
                    } ${isActive ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'}`}
                  >
                    <Icon
                      size={isScrolling ? 12 : 14}
                      className={`transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'}`}
                    />
                    {label}
                  </button>
                );
              })}

            </div>
          </div>

          {/* RIGHT: Timeline Stepper */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            {/* Step 1 */}
            <div className={`flex items-center gap-1.5 transition-all duration-500 ${step1Active ? 'text-emerald-400' : step1Done ? 'text-emerald-500/70' : 'text-gray-600'}`}>
              <div
                className={`rounded-full flex items-center justify-center font-black transition-all duration-500 ${
                  isScrolling ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
                } ${
                  step1Active
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-[0_0_14px_rgba(16,185,129,0.7)] scale-110'
                    : step1Done
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
                    : 'bg-white/5 border border-white/10 text-gray-500'
                }`}
              >
                {step1Done ? <Check size={10} /> : '1'}
              </div>
              <span className={`font-black uppercase tracking-widest transition-all duration-500 hidden lg:block ${isScrolling ? 'text-[8px]' : 'text-[9px]'}`}>
                Pilih Alat
              </span>
            </div>

            <div className={`h-px rounded-full transition-all duration-500 ${isScrolling ? 'w-3 md:w-5' : 'w-4 md:w-7'} ${step1Done ? 'bg-emerald-500/40' : 'bg-white/8'}`} />

            {/* Step 2 */}
            <div className={`flex items-center gap-1.5 transition-all duration-500 ${step2Active ? 'text-emerald-400' : step2Done ? 'text-emerald-500/70' : 'text-gray-600'}`}>
              <div
                className={`rounded-full flex items-center justify-center font-black transition-all duration-500 ${
                  isScrolling ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
                } ${
                  step2Active
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-[0_0_14px_rgba(16,185,129,0.7)] scale-110'
                    : step2Done
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
                    : 'bg-white/5 border border-white/10 text-gray-500'
                }`}
              >
                {step2Done ? <Check size={10} /> : '2'}
              </div>
              <span className={`font-black uppercase tracking-widest transition-all duration-500 hidden lg:block ${isScrolling ? 'text-[8px]' : 'text-[9px]'}`}>
                Isi Data
              </span>
            </div>

            <div className={`h-px rounded-full transition-all duration-500 ${isScrolling ? 'w-3 md:w-5' : 'w-4 md:w-7'} ${step2Done ? 'bg-emerald-500/40' : 'bg-white/8'}`} />

            {/* Step 3 */}
            <div className={`flex items-center gap-1.5 transition-all duration-500 ${step3Active ? 'text-emerald-400' : 'text-gray-600'}`}>
              <div
                className={`rounded-full flex items-center justify-center font-black transition-all duration-500 ${
                  isScrolling ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
                } ${
                  step3Active
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-black shadow-[0_0_14px_rgba(16,185,129,0.7)] scale-110'
                    : 'bg-white/5 border border-white/10 text-gray-500'
                }`}
              >
                3
              </div>
              <span className={`font-black uppercase tracking-widest transition-all duration-500 hidden lg:block ${isScrolling ? 'text-[8px]' : 'text-[9px]'}`}>
                Pembayaran
              </span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1.5 hover:bg-white/10 rounded-xl transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* LIQUID DROPDOWN CONTAINER */}
        <div 
          className="grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full"
          style={{ gridTemplateRows: activeTab ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden w-full">
            <div className="grid w-full">
              
              {/* S&K Content */}
              <div className={`col-start-1 row-start-1 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeTab === 'sk' ? 'opacity-100 translate-y-0 pointer-events-auto z-10 duration-500 delay-150' : 'opacity-0 -translate-y-4 pointer-events-none z-0 duration-200'
              }`}>
                <div className={`border-t border-white/10 mx-2 md:mx-4 mt-1 ${isScrolling ? 'px-4 md:px-5 pb-4 pt-2' : 'px-6 md:px-8 pb-6 pt-3'}`}>
                  <h3 className={`font-bold flex items-center gap-2 transition-all duration-500 ${isScrolling ? 'text-xs mb-2' : 'text-sm mb-3'} text-emerald-400`}>
                    <ShieldCheck size={isScrolling ? 14 : 18} /> Syarat & Ketentuan Jaminan
                  </h3>
                  <ul className={`text-gray-300 space-y-1.5 list-disc list-inside transition-all duration-500 ${isScrolling ? 'text-[10px]' : 'text-sm'}`}>
                    <li>Wajib menitipkan E-KTP atau identitas asli lainnya yang masih berlaku.</li>
                    <li>Alat yang disewa harus dikembalikan dalam keadaan kering dan bersih.</li>
                    <li>Kerusakan atau kehilangan alat menjadi tanggung jawab penyewa sepenuhnya.</li>
                    <li>Keterlambatan pengembalian akan dikenakan denda sesuai tarif harian.</li>
                  </ul>
                </div>
              </div>

              {/* Lokasi Content */}
              <div className={`col-start-1 row-start-1 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeTab === 'lokasi' ? 'opacity-100 translate-y-0 pointer-events-auto z-10 duration-500 delay-150' : 'opacity-0 -translate-y-4 pointer-events-none z-0 duration-200'
              }`}>
                <div className={`border-t border-white/10 mx-2 md:mx-4 mt-1 ${isScrolling ? 'px-4 md:px-5 pb-4 pt-2' : 'px-6 md:px-8 pb-6 pt-3'}`}>
                  <h3 className={`font-bold flex items-center gap-2 transition-all duration-500 ${isScrolling ? 'text-xs mb-2' : 'text-sm mb-3'} text-emerald-400`}>
                    <MapPin size={isScrolling ? 14 : 18} /> Lokasi Pos Outdoor
                  </h3>
                  <div className={`text-gray-300 space-y-1.5 transition-all duration-500 ${isScrolling ? 'text-[10px]' : 'text-sm'}`}>
                    <p>Jl. Raya Pendakian No. 123, Desa Sembalun Bumbung, Lombok Timur, NTB.</p>
                    <p className="text-gray-500">Patokan: 100m setelah gerbang pendakian utama Gunung Rinjani.</p>
                    <button className={`mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium transition-colors flex items-center gap-2 rounded-xl border border-emerald-500/20 ${isScrolling ? 'px-3 py-1.5 text-[10px]' : 'px-4 py-2 text-xs mt-3'}`}>
                      <MapPin size={14} /> Buka di Google Maps
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Content */}
              <div className={`col-start-1 row-start-1 transition-all ease-[cubic-bezier(0.16,1,0.3,1)] ${
                activeTab === 'admin' ? 'opacity-100 translate-y-0 pointer-events-auto z-10 duration-500 delay-150' : 'opacity-0 -translate-y-4 pointer-events-none z-0 duration-200'
              }`}>
                <div className={`border-t border-white/10 mx-2 md:mx-4 mt-1 ${isScrolling ? 'px-4 md:px-5 pb-4 pt-2' : 'px-6 md:px-8 pb-6 pt-3'}`}>
                  <h3 className={`font-bold flex items-center gap-2 transition-all duration-500 ${isScrolling ? 'text-xs mb-2' : 'text-sm mb-3'} text-emerald-400`}>
                    <Phone size={isScrolling ? 14 : 18} /> Hubungi Admin
                  </h3>
                  <div className={`text-gray-300 space-y-1.5 transition-all duration-500 ${isScrolling ? 'text-[10px]' : 'text-sm'}`}>
                    <p>Ada pertanyaan atau butuh bantuan mendadak? Admin kami siap membantu Anda.</p>
                    <p className="text-gray-400">Jam Operasional: 07.00 - 22.00 WITA</p>
                    <button className={`mt-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium transition-colors flex items-center gap-2 rounded-xl border border-emerald-500/20 ${isScrolling ? 'px-3 py-1.5 text-[10px]' : 'px-4 py-2 text-xs mt-3'}`}>
                      <Phone size={14} /> Chat via WhatsApp
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] right-4 liquid-glass rounded-3xl p-5 flex flex-col gap-4 pointer-events-auto sm:hidden border border-white/10">
          {[
            { icon: ShieldCheck, label: 'S&K Jaminan' },
            { icon: MapPin, label: 'Lokasi Toko' },
            { icon: Phone, label: 'Hubungi Admin' },
          ].map(({ icon: Icon, label }) => (
            <a key={label} href="#" className="flex items-center gap-3 text-sm font-semibold text-gray-200 hover:text-emerald-400 transition-colors">
              <Icon size={16} className="text-emerald-400/70" /> {label}
            </a>
          ))}

          {/* Timeline compact for mobile */}
          <div className="border-t border-white/10 pt-3 flex items-center gap-2">
            {[
              { label: 'Pilih Alat', active: step1Active, done: step1Done, color: 'emerald' },
              { label: 'Isi Data', active: step2Active, done: step2Done, color: 'emerald' },
              { label: 'Bayar', active: step3Active, done: false, color: 'emerald' },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-1">
                <div className={`flex items-center gap-1 ${step.active ? `text-${step.color}-400` : step.done ? `text-${step.color}-500/70` : 'text-gray-600'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${step.active ? `bg-${step.color}-500 text-black` : step.done ? `bg-${step.color}-500/15 border border-${step.color}-500/30` : 'bg-white/5 border border-white/10'}`}>
                    {step.done ? <Check size={9} /> : i + 1}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider">{step.label}</span>
                </div>
                {i < 2 && <div className="w-2 h-px bg-white/10 rounded-full" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
