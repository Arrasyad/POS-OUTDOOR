Berikut adalah **Struktur Lengkap Versi Final (Cetak Biru UI/UX & Fungsional)** untuk **Halaman LEVEL 0 (Halaman Utama & Katalog Dinamis)** website Pos Outdoor.

Struktur ini dirancang dengan pendekatan *Mobile-First* (fokus kenyamanan pengguna ponsel), menggunakan tren layout **Bento Grid**, serta telah mengintegrasikan sistem logika **Pengunci Tanggal (Per Malam)** dan **Sistem DP/Lunas via QRIS** yang telah kita sepakati.

---

# 📑 BLUEPRINT STRUKTUR FINAL: LEVEL 0 (HOME & SMART CATALOG)

## 1. STRUKTUR HEADER & NAVIGASI (Top Bar)

Komponen minimalis di bagian paling atas layar yang tetap melayang (*sticky*) saat di-*scroll*.

* **Logo Pos Outdoor** (Kiri): Klik logo untuk *refresh* halaman kembali ke awal.
* **Menu Navigasi Ringkas** (Kanan - Desktop) / **Hamburger Menu** (Kanan - Mobile):
* *Link* Syarat & Ketentuan Jaminan (Penegasan bawa KTP fisik).
* *Link* Hubungi Admin (Langsung ke WhatsApp).
* *Link* Lokasi Toko (Google Maps).



---

## 2. HERO SECTION & STRIP PENGUNCI TANGGAL (The First Action)

Bagian utama yang langsung dilihat user saat web terbuka. Fokusnya adalah mengunci tanggal pendakian.

* **Visual Banner:** Foto petualangan gunung/aktivitas *camping* estetis berkabut dengan *overlay* gelap agar teks terbaca jelas.
* **Headline Utama:** *"Sewa Alat Gunung Instan Tanpa Ribet. Amankan Perlengkapan Petualanganmu Sekarang."*
* **Komponen Utama: Bento-Box Date Picker Widget (Floating/Sticky Card)**
* **Kolom Input 1:** Kalender Pilih Tanggal Mulai Sewa.
* **Kolom Input 2:** Kalender Pilih Tanggal Selesai Sewa.
* *Logika Sistem:* Tanggal Selesai di hari yang sama otomatis mati (*disabled*). Sistem memaksa minimal sewa H+1 (2 Hari 1 Malam).
* **Dynamic Banner Text:** Begitu tanggal dipilih, muncul teks indikator hijau:
> `📅 Durasi: [X] Hari [Y] Malam (Dihitung [Y] Malam)`





---

## 3. SEKSI FILTER & KATEGORI PINTAR (Quick Navigation)

Berada tepat di bawah Hero Section untuk mempermudah pencarian alat spesifik.

* **Pilihan Kategori (Horizontal Scrollable Buttons di Mobile):**
* `[Semua Alat]` (Default aktif)
* `[Tenda & Sleeping Bag]`
* `[Tas & Carrier]`
* `[Peralatan Memasak]`
* `[Sepatu & Pakaian]`


* **Pilihan Paket Bundling (Bento Grid Highlight):**
* Tombol khusus untuk memilih paket hemat (Contoh: *Paket Pemula Gunung Prau 2D1N*). Jika diklik, sistem otomatis memasukkan satu set alat dasar ke keranjang belanja.



---

## 4. KATALOG PRODUK DINAMIS (The Core Bento Grid)

Daftar produk yang ditampilkan dalam bentuk kartu grid yang bersih dan informatif.

* **Elemen di Dalam Setiap Kartu Produk:**
1. **Foto Produk:** Gambar jernih (misal: Tenda Eiger Kapasitas 4).
2. **Nama Produk & Spesifikasi Singkat:** (Contoh: *Tenda Dome Kap. 4 - Double Layer*).
3. **Harga Sewa:** Ditampilkan per malam dengan teks jelas (Contoh: *Rp50.000 / Malam*).
4. **Stok Indicator (Dinamis berdasarkan tanggal Hero Section):**
* *Jika Stok Ada:* Teks hijau (`🟢 Tersedia: 5 Unit`).
* *Jika Stok Habis:* Kartu otomatis menjadi samar (*grayscale*) dengan teks merah (`🔴 Habis pada tanggal terpilih`) dan tombol sewa terkunci.


5. **Tombol Aksi Interaktif:**
* Tombol **`[+ Sewa]`** berwarna Jingga/Hijau Forest.
* *Micro-interaction:* Jika diklik, tombol berubah menjadi *Quantity Counter* (`[-] 1 [+]`) agar user bisa menambah atau mengurangi jumlah alat langsung dari kartu tersebut.





---

## 5. LACI KERANJANG BELANJA MENGAPUNG (Floating Mini Cart Menu)

Tombol melayang di pojok kanan bawah layar berbentuk ikon keranjang belanja dengan lingkaran angka jumlah item (Contoh: `🛒 3`). Menggunakan *Local Storage* agar data tidak hilang jika halaman tertutup.

Jika ikon ini diklik oleh user, akan muncul **Slide-Over Panel (Laci dari Samping)** yang berisi:

* **Header Cart:** "Keranjang Sewa Anda" + Detail Durasi (Contoh: *27 Jun - 28 Jun | 1 Malam*).
* **Daftar Item Terpilih:** List alat, jumlahnya, dan kalkulasi transparan.
* *Visual:* `Tenda Kap. 4 (1 unit) x 1 Malam = Rp50.000`
* *Visual:* `Carrier 60L (2 unit) x 1 Malam = Rp60.000`


* **Ringkasan Biaya Belanja:**
* `Total Biaya Sewa: Rp110.000`
* `Minimal DP Poin (Opsi Kebijakan): Rp30.000` (Sebagai pengunci komitmen anti-user nakal).


* **Tombol CTA Utama (Pintu Menuju Level 1):**
* Tombol tebal bersinar bertuliskan: **`"Lanjut Isi Data Sewa (Tanpa Login) ➡️"`**.



---

### 🛠️ Ringkasan Alur Kerja UX Halaman Level 0:

User Masuk ➔ **Kunci Tanggal (Minimal 1 Malam)** ➔ Filter Kategori ➔ **Lihat Sisa Stok Real-Time** ➔ Klik Tombol Sewa ➔ **Cek Kalkulator Harga di Floating Cart** ➔ Klik Lanjut ke Level 1.