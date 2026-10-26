Berikut adalah rancangan PRD khusus untuk **[LEVEL 0] - Landing Page & Smart Catalog**.

---

## 📄 PRD: [LEVEL 0] - Landing Page & Smart Catalog

**Tujuan Utama:** Mengunci tanggal sewa, filter alat, kalkulasi harga, dan mengatur keranjang belanja.

### 1. 🎨 Pedoman Desain & *Styling* (AI Directives)

* Desain antarmuka harus menggunakan pendekatan *Mobile-First*.


* Struktur tata letak wajib menggunakan *Bento Grid Layout*.


* Tipografi menggunakan *font* sans-serif modern, yaitu Plus Jakarta Sans atau Inter.


* Warna latar belakang menggunakan Putih bersih dan Abu-abu sangat muda.


* Warna aksen atau *Call to Action* (CTA) menggunakan Hijau Forest (*Pine Green*) atau Jingga Gunung (*Deep Amber/Orange*).


* Efek *Liquid Glass* (*Glassmorphism*) diterapkan pada elemen melayang menggunakan kelas Tailwind: `bg-white/30 backdrop-blur-md border border-white/20 shadow-lg backdrop-saturate-[180%]`.



### 2. 🧩 Spesifikasi Komponen & Logika (*State*)

#### A. Hero Section & Widget Pengunci Tanggal (*Date Range Picker*)

* Implementasikan UI kalender dalam bentuk *Bento Box* atau *Floating Card*.


* Pengguna wajib memilih rentang tanggal peminjaman. Tanggal selesai tidak boleh sama dengan tanggal mulai, yang berarti minimal sewa adalah 2 Hari 1 Malam (H+1).


* Sistem kalkulasi harga harus menggunakan basis hitungan "Per Malam", yang dihitung dari rumus `endDate - startDate`.


* Sistem memunculkan teks indikator durasi di bawah kalender, contohnya: "Durasi Pendakian: 2 Hari 1 Malam (Hitungan: 1 Malam)".



#### B. Katalog Alat Pintar (*Smart Dynamic Catalog*)

* Kartu produk menampilkan gambar, nama alat, dan harga sewa per malam.


* 
*Mock Logic*: Saat tanggal dipilih oleh pengguna, sistem mengurangi stok secara matematis di dalam *state* agar terlihat seperti terhubung dengan *real-time database*.


* Visual indikator ketersediaan stok menggunakan warna Hijau untuk status "Tersedia".


* Kartu produk menggunakan visual *Grayscale* (samar) dan teks warna Merah untuk status "Habis".


* Animasi interaktif menggunakan *Framer Motion* yang mengubah tombol CTA menjadi `[-] 1 [+]` (*Quantity Counter*) saat pengguna mengkliknya.



#### C. Laci Keranjang Belanja Mengapung (*Floating Mini Cart Menu*)

* Tombol ikon keranjang diposisikan melayang pada koordinat *absolute bottom-right* di layar.


* Aksi klik pada tombol membuka menu laci dari samping menggunakan komponen *Slide-Over* dari Shadcn UI.


* Isi laci keranjang menampilkan rincian item, pengali malam, subtotal harga, dan tombol "Lanjut Isi Data Sewa".


* Manajemen *state* keranjang wajib menggunakan *Local Storage* agar data alat yang dipilih tetap tersimpan meskipun tab tertutup.