'use client';
import { useState, useEffect } from 'react';
import { Calendar, Lock, Unlock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const { dateRange, nightCount, setDateRange, lockDate, unlockDate, isDateLocked, setActiveBookings } = useStore();
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [todayDateStr, setTodayDateStr] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    setTodayDateStr(today.toISOString().split('T')[0]);
  }, []);

  // Synchronize start and end dates from store's dateRange on mount/rehydration
  useEffect(() => {
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setMinutes(fromDate.getMinutes() - fromDate.getTimezoneOffset());
      setStart(fromDate.toISOString().split('T')[0]);
    } else {
      setStart('');
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setMinutes(toDate.getMinutes() - toDate.getTimezoneOffset());
      setEnd(toDate.toISOString().split('T')[0]);
    } else {
      setEnd('');
    }
  }, [dateRange]);

  const [isFetching, setIsFetching] = useState(false);

  const handleApplyDates = async () => {
    if (start && end) {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/bookings?start=${start}&end=${end}`);
        if (res.ok) {
          const bookings = await res.json();
          setActiveBookings(bookings);
        } else {
          setActiveBookings([]);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setActiveBookings([]);
      } finally {
        setIsFetching(false);
      }
      setDateRange({ from: new Date(start), to: new Date(end) });
      lockDate();
    }
  };

  let minEndDate = todayDateStr;
  if (start) {
    const startDateObj = new Date(start);
    startDateObj.setDate(startDateObj.getDate() + 1);
    minEndDate = startDateObj.toISOString().split('T')[0];
  } else if (todayDateStr) {
    const today = new Date(todayDateStr);
    today.setDate(today.getDate() + 1);
    minEndDate = today.toISOString().split('T')[0];
  }

  useEffect(() => {
    if (start && end && new Date(end) <= new Date(start)) setEnd('');
  }, [start, end]);

  return (
    <section className="relative w-full min-h-[750px] pt-32 pb-16 px-4 md:px-8 flex flex-col justify-center bg-[url('/hero-bg.png')] bg-cover bg-center overflow-hidden">
      {/* Layered gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/30 via-[#09090b]/55 to-[#09090b] z-0" />
      {/* Radial ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(16,185,129,0.08),transparent)] z-0" />

      <div className="relative z-10 max-w-4xl mx-auto w-full mt-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-white drop-shadow-2xl">
            Adventure <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">Awaits</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
            Sewa Alat Gunung Instan Tanpa Ribet.&nbsp;
            <span className="text-gray-300">Amankan Perlengkapan Petualanganmu Sekarang.</span>
          </p>
        </div>

        {/* Date Picker - Premium Glass Card */}
        <div
          className="relative max-w-3xl mx-auto rounded-[2rem]"
          style={{
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.04),
              0 32px 80px rgba(0,0,0,0.6),
              0 8px 24px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.18),
              inset 1px 0 0 rgba(255,255,255,0.08),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Isolated Glass Layer to prevent GPU composite bugs */}
          <div 
            className="absolute inset-0 rounded-[2rem] pointer-events-none -z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 60%, rgba(16,185,129,0.04) 100%)',
              backdropFilter: 'blur(60px) saturate(220%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(60px) saturate(220%) brightness(1.08)',
            }}
          />

          {/* Top shimmer line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          <div className="px-7 pt-7 md:px-9 md:pt-9 flex flex-col md:flex-row items-end gap-5">
            {/* Departure */}
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                Keberangkatan
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={start}
                  min={todayDateStr}
                  disabled={isDateLocked}
                  onChange={(e) => setStart(e.target.value)}
                  className="w-full text-white rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: start ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: start ? 'inset 0 1px 0 rgba(16,185,129,0.08), 0 0 0 3px rgba(16,185,129,0.07)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            </div>

            {/* Arrow separator */}
            <div className="hidden md:flex items-center pb-3 text-gray-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Return */}
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                Kepulangan
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={end}
                  min={minEndDate}
                  disabled={!start || isDateLocked}
                  onChange={(e) => setEnd(e.target.value)}
                  className="w-full text-white rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: end ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: end ? 'inset 0 1px 0 rgba(16,185,129,0.08), 0 0 0 3px rgba(16,185,129,0.07)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                />
              </div>
            </div>

            {/* Lock/Unlock Button */}
            <div className="flex-none w-full md:w-auto pb-0.5">
              {!isDateLocked ? (
                <button
                  onClick={handleApplyDates}
                  disabled={!start || !end || isFetching}
                  className={`w-full md:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 active:scale-95 disabled:cursor-not-allowed ${
                    start && end 
                      ? 'text-white border border-white/10 hover:border-emerald-500/60 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                      : 'text-white/30 border border-white/5 shadow-none'
                  }`}
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Lock size={16} />
                  {isFetching ? 'Memuat...' : 'Kunci Tanggal'}
                </button>
              ) : (
                <button
                  onClick={() => unlockDate()}
                  className="w-full md:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 active:scale-95 text-white/30 border border-white/5 shadow-none hover:text-white hover:border-emerald-500/60 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.4)]"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <Unlock size={16} />
                  Ubah Tanggal
                </button>
              )}
            </div>
          </div>

          {/* DURATION LIQUID DROPDOWN */}
          <div 
            className="grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] w-full"
            style={{ gridTemplateRows: isDateLocked ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden w-full">
              <div className="px-7 md:px-9 pt-7 md:pt-8">
                <div className="pt-6 md:pt-7 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    Durasi Pendakian
                  </div>
                  <div className="inline-flex items-center justify-center text-white font-semibold text-sm tracking-wide bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    {nightCount + 1} Hari {nightCount} Malam
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom spacer for consistent card padding */}
          <div className="h-7 md:h-9 w-full" />

          {/* Bottom shimmer line */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </div>
    </section>
  );
}
