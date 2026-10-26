'use client';
import { Mountain, MapPin, Phone, Clock, ShieldCheck, Award, Users, Star, ArrowLeft, Heart, Package, Tent, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: 'easeOut' as const },
  }),
};

const stats = [
  { icon: Users, value: '2.500+', label: 'Pendaki Dipercaya' },
  { icon: Package, value: '150+', label: 'Jenis Perlengkapan' },
  { icon: Star, value: '4.9', label: 'Rating Kepuasan' },
  { icon: Award, value: '5 Tahun', label: 'Pengalaman' },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Keamanan Terjamin',
    desc: 'Seluruh perlengkapan melalui pengecekan ketat sebelum dan sesudah sewa untuk memastikan kondisi prima.',
  },
  {
    icon: Clock,
    title: 'Layanan 7 Hari',
    desc: 'Admin siap membantu dari pukul 07.00 – 22.00 WITA, termasuk hari libur dan akhir pekan.',
  },
  {
    icon: Tent,
    title: 'Perlengkapan Lengkap',
    desc: 'Dari tenda, carrier, hingga sleeping bag — semua tersedia dengan kualitas terbaik untuk berbagai medan.',
  },
  {
    icon: Heart,
    title: 'Komunitas Pendaki',
    desc: 'Bukan sekadar rental, kami adalah bagian dari komunitas pecinta alam Lombok yang saling mendukung.',
  },
];

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-[#09090b] selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.07),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_bottom-right,rgba(6,182,212,0.04),transparent_70%)]" />
      </div>

      {/* Back Button */}
      <div className="relative z-10 pt-8 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-emerald-400 transition-colors group"
          >
            <span className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-all duration-300">
              <ArrowLeft size={15} />
            </span>
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.5),0_0_80px_rgba(16,185,129,0.2)]">
                <Mountain size={38} className="text-black" />
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-400/30 scale-110 animate-pulse" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-4">
            Pos{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              Outdoor
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Mitra Terpercaya Para Pendaki Rinjani.{' '}
            <span className="text-gray-300">Sewa Alat Gunung Profesional di Kaki Gunung Rinjani, Lombok.</span>
          </p>

          {/* Tagline chip */}
          <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-xs font-black uppercase tracking-[0.18em]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
            Berdiri Sejak 2019 · Sembalun, Lombok Timur
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative rounded-2xl p-5 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(16,185,129,0.025) 100%)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                <stat.icon size={18} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white tracking-tight mb-1">{stat.value}</div>
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* About Card */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative rounded-3xl p-7 md:p-10 mb-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 50%, rgba(255,255,255,0.035) 100%)',
            backdropFilter: 'blur(56px) saturate(220%) brightness(1.08)',
            WebkitBackdropFilter: 'blur(56px) saturate(220%) brightness(1.08)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
        >
          {/* Shimmer top */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-4 tracking-tight">Tentang Kami</h2>
          <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
            <p>
              <span className="text-emerald-400 font-bold">Pos Outdoor</span> adalah usaha rental perlengkapan pendakian yang
              berdiri sejak 2019, berlokasi tepat di kaki Gunung Rinjani, Sembalun Bumbung, Lombok Timur. Kami hadir untuk
              memudahkan para pendaki yang ingin menikmati keindahan Rinjani tanpa harus membawa beban perlengkapan dari rumah.
            </p>
            <p>
              Dengan pengalaman lebih dari 5 tahun melayani ribuan pendaki dari seluruh Indonesia dan mancanegara, kami memahami
              kebutuhan Anda. Setiap perlengkapan dirawat dan diperiksa secara berkala untuk memastikan keselamatan dan
              kenyamanan petualangan Anda.
            </p>
            <p>
              Kami percaya bahwa perlengkapan yang baik adalah fondasi dari pendakian yang aman dan menyenangkan. Itulah mengapa
              kami hanya menyediakan alat-alat berkualitas dari merek terpercaya.
            </p>
          </div>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              custom={5 + i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="relative rounded-2xl p-6 overflow-hidden group"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-300">
                  <item.icon size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          custom={9}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative rounded-3xl p-7 md:p-10 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(255,255,255,0.02) 60%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid rgba(16,185,129,0.15)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(16,185,129,0.12)',
          }}
        >
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />

          <h2 className="text-xl font-extrabold text-white mb-6 tracking-tight">Kontak & Lokasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: MapPin,
                label: 'Alamat',
                value: 'Jl. Raya Pendakian No. 123, Desa Sembalun Bumbung, Lombok Timur, NTB',
                action: 'Buka Maps',
              },
              {
                icon: Phone,
                label: 'WhatsApp',
                value: '+62 812-3456-7890',
                action: 'Chat Sekarang',
              },
              {
                icon: Clock,
                label: 'Jam Operasional',
                value: 'Setiap hari, 07.00 – 22.00 WITA (termasuk hari libur)',
                action: null,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl p-5"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <item.icon size={15} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{item.value}</p>
                {item.action && (
                  <button className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold hover:gap-2.5 transition-all duration-200 group">
                    {item.action}
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          custom={10}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-white tracking-wide transition-all duration-300 active:scale-95 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(16,185,129,0.5)]"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.9) 100%)',
              boxShadow: '0 8px 32px rgba(16,185,129,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            <Mountain size={18} />
            Mulai Sewa Sekarang
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
