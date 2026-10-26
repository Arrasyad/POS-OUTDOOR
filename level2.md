Berikut adalah **Struktur Lengkap Versi Final (Cetak Biru UI/UX & Fungsional)** untuk **Halaman LEVEL 2 (Halaman Transaksi, Kode Booking, & Integrasi WhatsApp)** pada website Pos Outdoor.

Halaman ini adalah babak final (*checkout & post-checkout*). Sesuai kesepakatan, halaman ini menerapkan **Opsi Pertama (Wajib DP/Lunas via QRIS)** untuk memblokir aksi user nakal, serta menyediakan fitur klaim nota otomatis via WhatsApp karena sistem berjalan tanpa *login*.

Halaman Level 2 ini memiliki **2 Fase Tampilan Visual** yang berjalan otomatis tanpa *refresh* halaman:

---

# 📑 BLUEPRINT STRUKTUR FINAL: LEVEL 2 (TRANSAKSI & NOTA DIGITAL)

## 🔄 FASE A: PROSES PEMBAYARAN (Sebelum Pembayaran Terkonfirmasi)

Tampilan ini muncul begitu user berhasil menekan tombol konfirmasi dari Level 1. Fokusnya adalah menuntun user menyelesaikan komitmen pembayaran dalam batas waktu aman.

### 1. Header Fase Pembayaran

* **Progress Tracker Final:** `Pilih Alat (Selesai) ➔ Isi Data (Selesai) ➔ 🟠 Pembayaran QRIS (Sekarang)`
* **Running Countdown Timer:** Melanjutkan durasi kuncian stok dari Level 1 (Sisa waktu dari 15 menit awal). Teks berkedip halus: `⚠️ Selesaikan pembayaran dalam 11:45 menit agar booking tidak hangus.`

### 2. Widget QRIS Dinamis (*Smart Payment Gateway*)

* **Display QR Code:** Menampilkan gambar kode QRIS resmi Pos Outdoor yang di-generasi secara otomatis oleh sistem *payment gateway*.
* **Petunjuk Pembayaran:** Teks ringkas di bawah QR: *"Scan QRIS di atas menggunakan aplikasi E-Wallet (Gopay, OVO, Dana, LinkAja) atau Mobile Banking Anda."*
* **Sinyal Loading Otomatis (*Real-Time Listener*):** Di bawah kode QR terdapat animasi *loading spinner* halus dengan teks: `⏳ Menunggu pembayaran Anda terdeteksi...` (User tidak perlu mengunggah bukti transfer, sistem mendeteksi otomatis saat uang masuk).

### 3. Kotak Transparansi Biaya & Syarat

* **Rincian Pembayaran:**
* Total Sewa Alat: `Rp110.000`
* **Metode Pembayaran Pilihan Toko:** `[Opsi Lunas: Rp110.000]` atau `[Opsi DP Minimal: Rp30.000]` (Sesuaikan dengan kebijakan manajemen Anda).


* **Pengingat Jaminan Fisik:** Teks kecil di area bawah: *"Pembayaran ini adalah pengunci stok sah. Pengambilan alat tetap wajib meninggalkan KTP Asli di toko."*

---

## 🏁 FASE B: NOTA DIGITAL & KODE BOOKING (Setelah Pembayaran Sukses)

Begitu uang masuk, sistem *backend* langsung mengubah tampilan halaman secara instan (*real-time redirection*) menjadi **Nota Digital Sah**. Halaman inilah yang di-sreenshot oleh user atau disimpan link-nya.

### 1. Header Sukses & Selamat

* **Visual Latar Hijau:** Ikon centang hijau besar `✅ PEMBAYARAN BERHASIL!`
* **Teks Apresiasi:** *"Terima kasih, [Nama User]! Perlengkapan petualanganmu resmi kami amankan."*

### 2. Kartu Bukti Sewa Digital (*Smart Booking Receipt*)

Sebuah kotak Bento Grid utama dengan desain premium yang berfungsi sebagai tiket fisik saat di toko:

* **Kode Booking Unik:** Ditampilkan dengan font tebal besar (Contoh: `#POS-202606-089`).
* **Barcode / QR Code Scanner:** Sistem menggenerasi *barcode* khusus dari kode booking tersebut. Saat hari H, admin toko tinggal melakukan scan barcode ini dari layar HP user menggunakan aplikasi admin.
* **Ringkasan Jadwal & Identitas:**
* *Nama Penyewa:* [Nama User]
* *No. WhatsApp:* [No WA User]
* *Tanggal Ambil:* Sabtu, 27 Juni 2026 (Mulai jam 08.00 WIB)
* *Tanggal Kembali:* Minggu, 28 Juni 2026 (Maksimal jam 20.00 WIB)
* *Durasi:* 2 Hari 1 Malam (Hitungan: 1 Malam)



### 3. Detail Inventaris Alat & Kebijakan Refund

* **Tabel Itemized:** List bersih berisi alat apa saja yang disewa beserta jumlahnya untuk dicocokkan saat serah terima barang fisik di toko.
* **Link Kebijakan Pembatalan (*Refund Policy*):** Teks info kecil yang jika diklik membuka *pop-up* aturan potong DP/Lunas (H-3 100%, H-1 50%, Hari H 0% hangus) seperti yang sudah kita sepakati untuk mengatasi user plinplan.

### 4. Fitur Utama Solusi Tanpa Login: Tombol Integrasi WhatsApp (CTA Terakhir)

Karena user tidak memiliki akun, tombol ini wajib diklik sebagai cadangan (*backup*) agar user memiliki salinan nota di chat pribadi mereka.

* **Tombol CTA Hijau Tebal:** `[ 💬 Kirim Nota ke WhatsApp Admin Pos Outdoor ]`
* **Mekanisme Otomatisasi Teks (Auto-Text):** Begitu diklik, aplikasi WhatsApp user terbuka dan otomatis mengetik pesan ke nomor toko:
> *"Halo Admin Pos Outdoor, saya telah melakukan pembayaran sewa alat gunung via web. \n\nNama: [Nama User] \nKode Booking: #POS-202606-089 \nLink Nota Digital: [posoutdoor.com/receipt/POS-202606-089](https://www.google.com/search?q=https%3A%2F%2Fposoutdoor.com%2Freceipt%2FPOS-202606-089) \n\nSampai jumpa di toko pada hari pengambilan!"*



---

### 🛠️ Ringkasan Akhir Keunggulan Sistem (Level 0 - Level 2)

Arsitektur 3 Level untuk **Pos Outdoor** ini sudah sempurna:

1. **Level 0:** Memblokir masalah stok bentrok sejak detik pertama lewat pengunci tanggal.
2. **Level 1:** Memotong hambatan privasi dengan membuang fitur upload KTP digital, diganti janji jaminan fisik.
3. **Level 2:** Memblokir user nakal lewat gerbang pembayaran QRIS otomatis dan menjembatani sistem tanpa login menggunakan sinkronisasi WhatsApp.