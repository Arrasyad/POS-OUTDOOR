Berikut adalah **Struktur Lengkap Versi Final (Cetak Biru UI/UX & Fungsional)** untuk **Halaman LEVEL 1 (Halaman Formulir Kontak Super Instan)** pada website Pos Outdoor.

---

# 📑 BLUEPRINT STRUKTUR FINAL: LEVEL 1 (FORMULIR KONTAK & VERIFIKASI INSTAN)

## 1. STRUKTUR HEADER (Minimalist Progress Bar)

Navigasi atas disederhanakan total agar pengguna fokus mengisi data tanpa teralihkan untuk kembali melihat-lihat katalog.

* **Tombol Kembali** (Kiri): Ikon panah kiri `⬅️ Kembali ke Katalog` (Jika diklik, keranjang belanja di Level 0 tidak akan hilang karena tersimpan di *Local Storage*).
* **Progress Tracker** (Tengah/Kanan): Indikator visual sederhana yang menunjukkan posisi user saat ini:
> `Pilih Alat (Selesai) ➔ 🟠 Isi Data (Sekarang) ➔ Bayar & Selesai (Berikutnya)`



---

## 2. FITUR UTAMA: BENTENG PENGAMAN STOK (Temporary Booking Lock)

Berupa bilah peringatan (*banner*) tipis yang bergerak dinamis di bagian paling atas formulir.

* **Countdown Timer Bar:** Teks berjalan dengan latar belakang warna kuning/oranye hangat.
> `⏰ Stok perlengkapan Anda telah kami amankan! Selesaikan pengisian formulir dalam waktu 14:59 menit.`


* **Logika Sistem:** Sistem *backend* mengunci inventaris alat pilihan user selama 15 menit. Jika waktu habis sebelum user menekan tombol lanjut, kuncian lepas, dan user akan dialihkan kembali ke Level 0 dengan notifikasi: *"Waktu pengisian habis, silakan cek kembali ketersediaan stok alat Anda."*

---

## 3. FORMULIR DATA PENYEWA (Single-Column Bento Form)

Disusun dalam satu kolom vertikal yang bersih untuk mempermudah pengetikan di layar *smartphone*. Hanya meminta data yang 100% diperlukan untuk operasional toko.

* **Komponen Input 1: Nama Lengkap**
* *Placeholder/Petunjuk:* "Masukkan nama sesuai KTP asli Anda"
* *UX Validasi:* Input wajib diisi (*Required*). Jika kosong, kolom berwarna kemerahan.


* **Komponen Input 2: Nomor WhatsApp Aktif**
* *Placeholder/Petunjuk:* "Contoh: 081234567xxx"
* *UX Validasi:* Sistem otomatis menolak karakter huruf, hanya menerima angka, dan memberikan validasi format nomor Indonesia yang valid (minimal 10-13 digit). Nomor ini akan menjadi ID unik pesanan pelanggan.


* **Komponen Input 3: Catatan Tambahan (Opsional)**
* *Placeholder/Petunjuk:* "Contoh: Minta tenda warna biru / titip pesan untuk jam pengambilan."
* *UX Validasi:* Berupa *Textarea* panjang yang bebas diisi atau dikosongkan oleh user.



---

## 4. SEKSI DISCLAIMER: JAMINAN FISIK MUTLAK (Pengganti Upload KTP)

Kotak informasi visual yang mencolok (*Bento Box Highlight*) tepat di bawah formulir pengisian data. Menggunakan ikon peringatan (⚠️) dengan latar belakang kontras untuk menegaskan aturan main toko.

* **Konten Teks Peringatan:**
> ### ⚠️ SYARAT WAJIB PENGAMBILAN ALAT:
> 
> 
> 1. Anda **WAJIB membawa KTP Fisik Asli** yang namanya cocok dengan kolom "Nama Lengkap" di atas saat datang ke toko Pos Outdoor.
> 2. KTP Fisik Asli tersebut akan **ditinggal di toko sebagai jaminan sah** selama masa peminjaman dan dikembalikan utuh saat alat pulang.
> 3. Alat tidak akan diserahkan jika Anda tidak membawa KTP fisik asli atau nama di KTP berbeda dengan data pemesanan.
> 
> 



---

## 5. PANEL RINGKASAN & TOMBOL AKSI UTAMA (Sticky Order Summary)

Komponen statis di bagian bawah layar ponsel yang merangkum kembali komitmen transaksi sebelum melangkah ke gerbang pembayaran.

* **Rangkuman Instan:**
* `Durasi Sewa:` 27 Jun - 28 Jun 2026 ([X] Malam)
* `Total Alat:` [Y] Jenis Perlengkapan
* `Total Biaya Sewa:` **Rp110.000**


* **Tombol CTA Pembayaran (Pintu Menuju Level 2):**
* Tombol tebal berwarna hijau atau jingga menyala bertuliskan: **`"Konfirmasi & Lanjut Pembayaran (QRIS) 💳"`**.
* *Mekanisme Kontrol:* Tombol ini dalam kondisi mati (*disabled*) dan baru akan aktif berubah warna setelah kolom *Nama* dan *WhatsApp* terisi secara valid serta user mencentang kotak persetujuan:
* `[✓] Saya mengerti dan setuju dengan Syarat Jaminan KTP Fisik & Kebijakan Pembatalan Pos Outdoor.`





---

### 🛠️ Ringkasan Alur Kerja UX Halaman Level 1:

User Masuk ➔ **Melihat Timer 15 Menit** ➔ Mengetik Nama & No WhatsApp ➔ **Membaca & Menyetujui Syarat Jaminan KTP Fisik** ➔ Klik Tombol Konfirmasi ➔ Sistem Memproses Data ➔ User Masuk ke Level 2.

Halaman Level 1 ini memotong semua *friction* privasi digital. User merasa aman karena tidak ada data sensitif (foto KTP) yang disimpan di internet, sementara Pos Outdoor tetap memegang kendali legalitas secara fisik di toko nanti.