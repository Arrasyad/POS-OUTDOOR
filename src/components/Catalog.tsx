'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/productsMock';
import ProductCard from './ProductCard';
import { LayoutGroup } from 'framer-motion';
import { Search } from 'lucide-react';
import { useStore } from '@/store/useStore';

const CATEGORIES = [
  'Semua Alat',
  'Paket Bundling',
  'Tenda & Tidur',
  'Tas Gunung',
  'Alat Masak & Makan',
  'Lampu & Listrik',
  'Sepatu & Pakaian',
  'Meja & Kursi Santai',
  'P3K & Darurat'
];

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('Semua Alat');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  
  const { isDateLocked, products } = useStore();

  const [cols, setCols] = useState(5);
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1280) setCols(5); // xl
      else if (window.innerWidth >= 1024) setCols(4); // lg
      else if (window.innerWidth >= 640) setCols(3); // sm
      else setCols(2); // default
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'Semua Alat' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full px-4 md:px-8 py-20 max-w-[1400px] mx-auto bg-[#09090b]">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-4">
            Katalog <span className="text-emerald-400">Peralatan</span>
          </h2>
          <p className="text-gray-400 text-base">Peralatan standar tinggi untuk keselamatan Anda. Temukan paket bundling di kategori.</p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full md:w-auto relative">
          <input 
            type="text" 
            placeholder="Cari alat gunung..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-6 mb-8 scrollbar-hide [&::-webkit-scrollbar]:hidden border-b border-white/5">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-xs transition-all border ${activeCategory === category ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <LayoutGroup>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5 grid-flow-row-dense">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => {
              let itemOrder = index;
              
              if (expandedProductId) {
                const expandedIndex = filteredProducts.findIndex(p => p.id === expandedProductId);
                if (expandedIndex !== -1) {
                  const isRightEdge = expandedIndex % cols === cols - 1;
                  if (isRightEdge) {
                    if (index === expandedIndex) itemOrder = index - 1;
                    else if (index === expandedIndex - 1) itemOrder = index + 1;
                  }
                }
              }

              return (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isExpanded={expandedProductId === product.id}
                  onToggleExpand={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                  styleOrder={itemOrder}
                />
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p className="text-xl font-bold">Produk tidak ditemukan.</p>
            </div>
          )}
        </div>
      </LayoutGroup>
    </section>
  );
}
