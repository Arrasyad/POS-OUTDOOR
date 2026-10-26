'use client';
import { Mountain, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative w-full mt-0 px-4 md:px-8 pb-10 pt-6">
      {/* Subtle top separator */}
      <div className="max-w-6xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Profil Card — clickable */}
          <Link href="/profil" className="group col-span-1 md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative rounded-3xl p-6 h-full overflow-hidden cursor-pointer"
              style={{
                background:
                  'linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(6,182,212,0.05) 100%)',
                border: '1px solid rgba(16,185,129,0.18)',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(16,185,129,0.15)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {/* Shimmer top */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(16,185,129,0.08), transparent 70%)' }}
              />

              <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.45)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-shadow duration-300">
                    <Mountain size={20} className="text-black" />
                  </div>
                  <div>
                    <span className="block text-base font-extrabold tracking-tight text-white">Pos Outdoor</span>
                    <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-[0.15em]">Profil Toko</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Mitra terpercaya para pendaki Rinjani sejak 2019. Perlengkapan lengkap, berkualitas, dan terjamin.
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-[0.15em] group-hover:gap-3 transition-all duration-300">
                  Lihat Profil Lengkap
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Info columns */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Lokasi */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Lokasi</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Jl. Raya Pendakian No. 123, Desa Sembalun Bumbung, Lombok Timur, NTB
              </p>
            </div>

            {/* Kontak */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Phone size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Kontak</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                WhatsApp: +62 812-3456-7890
                <br />
                <span className="text-gray-600">07.00 – 22.00 WITA</span>
              </p>
            </div>

            {/* S&K */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Jaminan</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Wajib titip KTP. Kerusakan jadi tanggung jawab penyewa. Keterlambatan dikenakan denda harian.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/[0.06]">
          <p className="text-gray-600 text-[11px] font-medium">
            © {new Date().getFullYear()} Pos Outdoor · Sembalun Bumbung, Lombok Timur
          </p>
          <div className="flex items-center gap-1.5 text-gray-700 text-[11px] font-medium">
            <Mountain size={11} className="text-emerald-500/60" />
            Dibuat dengan semangat petualangan
          </div>
        </div>
      </div>
    </footer>
  );
}
