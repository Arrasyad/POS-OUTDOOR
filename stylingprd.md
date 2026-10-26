## 📄 PRD: Desain & Styling [LEVEL 0] - Landing Page & Smart Catalog

**Tujuan:** Mendefinisikan pedoman visual, tata letak, dan estetika antarmuka secara deklaratif untuk Halaman Utama Pos Outdoor.

---

### 🎨 1. Pedoman Gaya Global (Global Styling)

* 
**Pendekatan Tata Letak:** Desain antarmuka wajib dibangun menggunakan pendekatan *Mobile-First*.


* 
**Struktur Utama:** Susunan informasi dan elemen antarmuka wajib menggunakan tata letak *Bento Grid Layout* yang rapi dan intuitif.


* 
**Tipografi:** Gunakan *font* sans-serif modern yang tegas dan mudah dibaca, secara spesifik direkomendasikan **Plus Jakarta Sans** atau **Inter**.


* 
**Palet Warna Latar Belakang:** Dominan menggunakan putih bersih dan abu-abu sangat muda untuk memberikan kesan ruang yang luas.


* 
**Palet Warna Aksen (CTA):** Gunakan **Hijau Forest** (*Pine Green*) atau **Jingga Gunung** (*Deep Amber/Orange*) sebagai warna tombol utama agar menonjol.


* 
**Efek Visual Utama (Liquid Glass / Glassmorphism):** Diterapkan secara konsisten pada elemen yang melayang seperti *Bento box*, *Floating Cart*, dan *Sticky Headers*.


* 
**Kelas CSS Spesifik:** Untuk mengimplementasikan efek *Liquid Glass*, AI wajib menggunakan susunan kelas Tailwind berikut: `bg-white/30 backdrop-blur-md border border-white/20 shadow-lg backdrop-saturate-[180%]`.



---

### 🧩 2. Spesifikasi Desain Komponen Level 0

| Komponen | Spesifikasi Visual & Tata Letak |
| --- | --- |
| **Visual Banner (Hero Section)** | Menampilkan foto petualangan gunung atau aktivitas *camping* estetis yang berkabut, dilengkapi dengan *overlay* gelap agar teks *headline* di atasnya terbaca dengan jelas.

 |
| **Widget Pengunci Tanggal** | Diimplementasikan menggunakan UI kalender dalam bentuk *Bento Box* atau *Floating Card*. Sistem juga memunculkan teks indikator durasi transparan tepat di bagian bawah kalender.

 |
| **Kartu Produk Dinamis** | Katalog produk disusun rapi dalam bentuk kartu *grid* yang bersih. Setiap kartu wajib menampilkan gambar produk yang jernih, nama spesifik alat, dan harga sewa per malam.

 |
| **Indikator Stok (Tersedia)** | Ditandai menggunakan teks indikator berwarna hijau.

 |
| **Indikator Stok (Habis)** | Kartu produk otomatis diubah menjadi visual samar (*grayscale*), tombol sewa terkunci, dan menampilkan keterangan teks berwarna merah.

 |
| **Laci Keranjang Mengapung** | Tombol berbentuk ikon keranjang diposisikan melayang pada koordinat *absolute bottom-right* di layar agar tidak mengganggu proses *scrolling*.

 |
| **Menu Laci Keranjang** | Saat tombol keranjang diklik, menu akan terbuka sebagai laci dari arah samping, diimplementasikan menggunakan komponen *Slide-Over* dari pustaka Shadcn UI.

 |

---

### ✨ 3. Interaksi Mikro & Animasi (Micro-interactions)

* 
**Pustaka Animasi:** Gunakan **Framer Motion** untuk menghidupkan elemen antarmuka dengan *micro-interactions* tanpa membebani performa browser.


* 
**Animasi Tombol Sewa:** Tombol *Call to Action* (CTA) `[+ Sewa]` harus memiliki interaksi yang responsif saat diklik, kemudian berubah wujud secara mulus menjadi *Quantity Counter* dengan format `[-] 1 [+]`.