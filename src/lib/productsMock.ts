export interface BundleItem {
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  pricePerNight: number;
  stock: number; // base physical stock
  iconName: string; // from lucide-react
  category: string;
  description?: string;
  imageUrl?: string;
  isBundle?: boolean;
  bundleItems?: BundleItem[]; // If this exists, it's a bundle and its true stock depends on these items
}

export const productsMock: Product[] = [
  // 1. Tenda & Tidur
  { id: 'tenda-2', name: 'Tenda Kapasitas 2 Orang (Double Layer)', pricePerNight: 35000, stock: 3, iconName: 'Tent', category: 'Tenda & Tidur' },
  { id: 'tenda-4', name: 'Tenda Kapasitas 4 Orang (Double Layer)', pricePerNight: 50000, stock: 4, iconName: 'Tent', category: 'Tenda & Tidur' },
  { id: 'tenda-6', name: 'Tenda Kapasitas 6 Orang (Double Layer)', pricePerNight: 75000, stock: 2, iconName: 'Tent', category: 'Tenda & Tidur' },
  { id: 'tenda-lorong', name: 'Tenda Lorong / Tunnel Tent (Besar)', pricePerNight: 120000, stock: 2, iconName: 'Home', category: 'Tenda & Tidur' },
  { id: 'sb-polar', name: 'Sleeping Bag (SB) Dacron / Polar', pricePerNight: 15000, stock: 5, iconName: 'Bed', category: 'Tenda & Tidur' },
  { id: 'sb-bulu', name: 'Sleeping Bag Bulu Angsa', pricePerNight: 30000, stock: 4, iconName: 'Bed', category: 'Tenda & Tidur' },
  { id: 'matras-spon', name: 'Matras Karet / Spon', pricePerNight: 5000, stock: 5, iconName: 'AlignJustify', category: 'Tenda & Tidur' },
  { id: 'matras-foil', name: 'Matras Aluminium Foil', pricePerNight: 8000, stock: 3, iconName: 'AlignJustify', category: 'Tenda & Tidur' },
  { id: 'matras-angin', name: 'Matras Angin + Pompa', pricePerNight: 25000, stock: 4, iconName: 'Wind', category: 'Tenda & Tidur' },
  { id: 'flysheet-3x4', name: 'Flysheet (Atap Tambahan) 3x4m', pricePerNight: 15000, stock: 3, iconName: 'CloudRain', category: 'Tenda & Tidur' },
  { id: 'flysheet-4x6', name: 'Flysheet (Atap Tambahan) 4x6m', pricePerNight: 25000, stock: 3, iconName: 'CloudRain', category: 'Tenda & Tidur' },
  { id: 'footprint', name: 'Footprint (Alas Tenda)', pricePerNight: 10000, stock: 5, iconName: 'Square', category: 'Tenda & Tidur' },

  // 2. Tas Gunung
  { id: 'carrier-40l', name: 'Carrier 40L - 50L', pricePerNight: 30000, stock: 3, iconName: 'Backpack', category: 'Tas Gunung' },
  { id: 'carrier-60l', name: 'Carrier 60L - 70L', pricePerNight: 40000, stock: 4, iconName: 'Backpack', category: 'Tas Gunung' },
  { id: 'carrier-80l', name: 'Carrier 80L - 90L', pricePerNight: 50000, stock: 2, iconName: 'Backpack', category: 'Tas Gunung' },
  { id: 'daypack-25l', name: 'Daypack / Ransel Kecil 25L', pricePerNight: 20000, stock: 3, iconName: 'Backpack', category: 'Tas Gunung' },
  { id: 'raincover', name: 'Raincover (Mantel Tas)', pricePerNight: 5000, stock: 5, iconName: 'Umbrella', category: 'Tas Gunung' },

  // 3. Alat Masak & Makan
  { id: 'kompor-kotak', name: 'Kompor Gas Portable Kotak / Spider', pricePerNight: 15000, stock: 5, iconName: 'Flame', category: 'Alat Masak & Makan' },
  { id: 'kompor-ulir', name: 'Kompor Ulir Mini (Anti Angin)', pricePerNight: 20000, stock: 3, iconName: 'Flame', category: 'Alat Masak & Makan' },
  { id: 'nesting', name: 'Nesting / Panci Masak (Isi 2-3)', pricePerNight: 15000, stock: 5, iconName: 'Coffee', category: 'Alat Masak & Makan' },
  { id: 'wajan', name: 'Wajan Mini Teflon', pricePerNight: 10000, stock: 2, iconName: 'Utensils', category: 'Alat Masak & Makan' },
  { id: 'alat-makan', name: 'Set Alat Makan (Piring, Gelas, Sendok)', pricePerNight: 10000, stock: 5, iconName: 'UtensilsCrossed', category: 'Alat Masak & Makan' },
  { id: 'penahan-angin', name: 'Penahan Angin Kompor', pricePerNight: 5000, stock: 4, iconName: 'Wind', category: 'Alat Masak & Makan' },
  { id: 'jerigen', name: 'Jerigen Lipat / Kantong Air 5L', pricePerNight: 10000, stock: 4, iconName: 'Droplet', category: 'Alat Masak & Makan' },

  // 4. Lampu & Listrik
  { id: 'headlamp', name: 'Headlamp (Senter Kepala) + Baterai', pricePerNight: 10000, stock: 5, iconName: 'Flashlight', category: 'Lampu & Listrik' },
  { id: 'lampu-tenda', name: 'Lampu Tenda LED', pricePerNight: 10000, stock: 5, iconName: 'Lightbulb', category: 'Lampu & Listrik' },
  { id: 'lampu-tumblr', name: 'Lampu Tumblr (Hiasan)', pricePerNight: 15000, stock: 3, iconName: 'Sparkles', category: 'Lampu & Listrik' },
  { id: 'powerbank', name: 'Powerbank 20.000 mAh', pricePerNight: 15000, stock: 3, iconName: 'BatteryCharging', category: 'Lampu & Listrik' },

  // 5. Sepatu & Pakaian
  { id: 'sepatu', name: 'Sepatu Gunung (Banyak Ukuran)', pricePerNight: 35000, stock: 5, iconName: 'Footprints', category: 'Sepatu & Pakaian' },
  { id: 'trekking-1', name: 'Trekking Pole (Tongkat) - Satuan', pricePerNight: 10000, stock: 5, iconName: 'Activity', category: 'Sepatu & Pakaian' },
  { id: 'trekking-2', name: 'Trekking Pole (Tongkat) - Sepasang', pricePerNight: 18000, stock: 3, iconName: 'Activity', category: 'Sepatu & Pakaian' },
  { id: 'jaket', name: 'Jaket Gunung (Tahan Angin/Air)', pricePerNight: 25000, stock: 4, iconName: 'Shirt', category: 'Sepatu & Pakaian' },
  { id: 'jas-hujan', name: 'Jas Hujan / Ponco', pricePerNight: 15000, stock: 5, iconName: 'CloudRain', category: 'Sepatu & Pakaian' },
  { id: 'gaiter', name: 'Gaiter (Pelindung Kerikil Sepatu)', pricePerNight: 8000, stock: 3, iconName: 'Shield', category: 'Sepatu & Pakaian' },
  { id: 'sarung-tangan', name: 'Sarung Tangan Warm/Polar', pricePerNight: 7000, stock: 5, iconName: 'Hand', category: 'Sepatu & Pakaian' },
  { id: 'crampon', name: 'Crampon (Paku Sepatu Anti Slip)', pricePerNight: 15000, stock: 2, iconName: 'Snowflake', category: 'Sepatu & Pakaian' },

  // 6. Meja & Kursi Santai
  { id: 'kursi-std', name: 'Kursi Lipat Standar', pricePerNight: 15000, stock: 5, iconName: 'Armchair', category: 'Meja & Kursi Santai' },
  { id: 'kursi-besar', name: 'Kursi Lipat Besar (Sandaran)', pricePerNight: 25000, stock: 4, iconName: 'Armchair', category: 'Meja & Kursi Santai' },
  { id: 'meja', name: 'Meja Lipat Aluminium', pricePerNight: 20000, stock: 2, iconName: 'Grid', category: 'Meja & Kursi Santai' },
  { id: 'hammock', name: 'Hammock (Ayunan Gantung) + Tali', pricePerNight: 10000, stock: 4, iconName: 'Smile', category: 'Meja & Kursi Santai' },

  // 7. P3K & Darurat
  { id: 'p3k', name: 'Kotak Obat / P3K Lengkap', pricePerNight: 10000, stock: 3, iconName: 'Cross', category: 'P3K & Darurat' },
  { id: 'selimut', name: 'Selimut Darurat (Aluminium Thermal)', pricePerNight: 5000, stock: 5, iconName: 'Thermometer', category: 'P3K & Darurat' },

  // 8. Paket Bundling
  { 
    id: 'paket-hemat-2', 
    name: 'Paket Hemat 2 Orang', 
    pricePerNight: 75000, 
    stock: 99, // Bundle base stock doesn't matter, it's calculated dynamically
    iconName: 'Package', 
    category: 'Paket Bundling',
    description: '1 Tenda (2 Org), 2 SB, 2 Matras Karet, 1 Kompor Portable, 1 Nesting',
    bundleItems: [
      { productId: 'tenda-2', quantity: 1 },
      { productId: 'sb-polar', quantity: 2 },
      { productId: 'matras-spon', quantity: 2 },
      { productId: 'kompor-kotak', quantity: 1 },
      { productId: 'nesting', quantity: 1 }
    ]
  },
  { 
    id: 'paket-lengkap-2', 
    name: 'Paket Lengkap 2 Orang', 
    pricePerNight: 140000, 
    stock: 99, 
    iconName: 'Package', 
    category: 'Paket Bundling',
    description: '1 Tenda (2 Org), 2 SB, 2 Matras Angin, 1 Kompor, 1 Nesting, 1 Headlamp, 2 Kursi, 1 Meja',
    bundleItems: [
      { productId: 'tenda-2', quantity: 1 },
      { productId: 'sb-polar', quantity: 2 },
      { productId: 'matras-angin', quantity: 2 },
      { productId: 'kompor-kotak', quantity: 1 },
      { productId: 'nesting', quantity: 1 },
      { productId: 'headlamp', quantity: 1 },
      { productId: 'kursi-std', quantity: 2 },
      { productId: 'meja', quantity: 1 }
    ]
  },
  { 
    id: 'paket-hemat-4', 
    name: 'Paket Hemat 4 Orang', 
    pricePerNight: 120000, 
    stock: 99, 
    iconName: 'Package', 
    category: 'Paket Bundling',
    description: '1 Tenda (4 Org), 4 SB, 4 Matras Karet, 1 Kompor Portable, 1 Nesting',
    bundleItems: [
      { productId: 'tenda-4', quantity: 1 },
      { productId: 'sb-polar', quantity: 4 },
      { productId: 'matras-spon', quantity: 4 },
      { productId: 'kompor-kotak', quantity: 1 },
      { productId: 'nesting', quantity: 1 }
    ]
  },
  { 
    id: 'paket-lengkap-4', 
    name: 'Paket Lengkap 4 Orang', 
    pricePerNight: 200000, 
    stock: 99, 
    iconName: 'Package', 
    category: 'Paket Bundling',
    description: '1 Tenda (4 Org), 4 SB, 4 Matras Karet, 1 Flysheet, 1 Kompor, 1 Nesting, 1 Lampu, 4 Kursi, 1 Meja',
    bundleItems: [
      { productId: 'tenda-4', quantity: 1 },
      { productId: 'sb-polar', quantity: 4 },
      { productId: 'matras-spon', quantity: 4 },
      { productId: 'flysheet-3x4', quantity: 1 },
      { productId: 'kompor-kotak', quantity: 1 },
      { productId: 'nesting', quantity: 1 },
      { productId: 'lampu-tenda', quantity: 1 },
      { productId: 'kursi-std', quantity: 4 },
      { productId: 'meja', quantity: 1 }
    ]
  },
  { 
    id: 'paket-hemat-6', 
    name: 'Paket Hemat 6 Orang', 
    pricePerNight: 190000, 
    stock: 99, 
    iconName: 'Package', 
    category: 'Paket Bundling',
    description: '1 Tenda (6 Org), 6 SB, 6 Matras Karet, 2 Kompor Portable, 2 Nesting',
    bundleItems: [
      { productId: 'tenda-6', quantity: 1 },
      { productId: 'sb-polar', quantity: 6 },
      { productId: 'matras-spon', quantity: 6 },
      { productId: 'kompor-kotak', quantity: 2 },
      { productId: 'nesting', quantity: 2 }
    ]
  },
  { 
    id: 'paket-glamping', 
    name: 'Paket Glamping / Mewah', 
    pricePerNight: 350000, 
    stock: 99, 
    iconName: 'Gem', 
    category: 'Paket Bundling',
    description: '1 Tunnel Tent, 4 SB Bulu Angsa, 4 Matras Angin, 1 Flysheet 4x6, 1 Kompor, 1 Nesting+Makan, Lampu+Tumblr, 4 Kursi Besar, 1 Meja',
    bundleItems: [
      { productId: 'tenda-lorong', quantity: 1 },
      { productId: 'sb-bulu', quantity: 4 },
      { productId: 'matras-angin', quantity: 4 },
      { productId: 'flysheet-4x6', quantity: 1 },
      { productId: 'kompor-kotak', quantity: 1 },
      { productId: 'alat-makan', quantity: 1 },
      { productId: 'nesting', quantity: 1 },
      { productId: 'lampu-tenda', quantity: 1 },
      { productId: 'lampu-tumblr', quantity: 1 },
      { productId: 'kursi-besar', quantity: 4 },
      { productId: 'meja', quantity: 1 }
    ]
  },
];
