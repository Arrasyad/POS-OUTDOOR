'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Receipt, Package, Users, LogOut, Mountain, Menu, X } from 'lucide-react';
import { useState } from 'react';

const MENU_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Transaksi', icon: Receipt },
  { href: '/admin/products', label: 'Inventaris', icon: Package },
  { href: '/admin/users', label: 'Pelanggan', icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#ededed] font-sans selection:bg-emerald-500 selection:text-black flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#0c0c0e]/80 backdrop-blur-xl">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Mountain size={16} className="text-black" />
            </div>
            <span className="font-black tracking-tighter text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              PosAdmin
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {MENU_ITEMS.map(item => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-gray-500'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-colors border border-transparent hover:border-red-400/20"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-white/10 bg-[#0c0c0e]/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Mountain size={20} className="text-emerald-400" />
            <span className="font-black tracking-tighter">PosAdmin</span>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0c0c0e] border-b border-white/10 p-4 space-y-2 z-30 shadow-2xl">
            {MENU_ITEMS.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 bg-red-400/5 rounded-xl"
            >
              <LogOut size={18} /> Keluar
            </button>
          </div>
        )}

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
