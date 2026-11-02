# 📄 PRD - TIM 2: PEMBARUAN FITUR NOTA / STRUK & KODE BOOKING RESMI
**Sistem Informasi POS Rental Outdoor (Pos Outdoor)**

| Metadata | Keterangan |
| :--- | :--- |
| **Penanggung Jawab** | **Tim 2 / Anggota 2** |
| **Modul** | Nota Digital Dinamis, Kode Booking, Format Cetak Kasir & Pelacak Pesanan |
| **Status Dokumen** | Draft Ready for Development |
| **Target Rilis** | Sprint 1 - Versi 2.1 |
| **Terkait dengan** | Tim 1 (Rincian Denda di Nota), Tim 3 (Status DP & Pelunasan di Nota) |

---

## 1. 📌 LATAR BELAKANG & MASALAH (PROBLEM STATEMENT)
1. **Broken Link Kritis pada Pesan WhatsApp:** Pada komponen [`PaymentPhaseB.tsx`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/components/PaymentPhaseB.tsx#L34-L41), pesan WhatsApp otomatis menyertakan link: `posoutdoor.com/receipt/${code}`. **Namun, rute `/receipt/[code]` atau `/receipt` belum pernah dibuat di direktori Next.js (berujung 404 Not Found jika diklik)!**
2. **Data Nota Hilang Saat Refresh (Ephemeral State):** Bukti sewa saat ini hanya dirender dari memori client-side Zustand (`useStore.ts`). Begitu pelanggan menutup tab browser atau me-refresh halaman, nota hilang dan tidak bisa diakses kembali.
3. **Tidak Ada Format Cetak Kasir (*Thermal Printer*):** Toko fisik membutuhkan struk kertas kecil (ukuran 58mm atau 80mm) untuk disematkan pada KTP jaminan fisik pelanggan di laci kasir.
4. **Admin Tidak Bisa Mencetak Nota:** Di dashboard admin (`/admin/bookings`), admin tidak memiliki opsi untuk melihat atau mencetak ulang nota pelanggan yang datang membawa barang.

---

## 2. 🎯 TUJUAN & TARGET (GOALS & OBJECTIVES)
1. Membangun halaman publik dinamis **`/receipt/[id]`** yang mengambil data langsung dari basis data MySQL berdasarkan Kode Booking (misal: `#POS-202611-628`).
2. Membangun halaman pelacak pesanan mandiri **`/cek-booking`** agar pelanggan tanpa akun dapat mencari nota mereka hanya dengan nomor WhatsApp dan Kode Booking.
3. Mengembangkan dua mode tampilan cetak:
   * **Mode Struk Kasir (*Thermal 58mm/80mm*):** Format kompak hitam-putih untuk printer kasir toko.
   * **Mode Invoice Digital / PDF:** Desain glassmorphism modern untuk diunduh / disimpan di smartphone.
4. Menambahkan tombol aksi **`[ 🖨️ Cetak / Lihat Nota ]`** pada tabel transaksi admin.

---

## 3. 👤 USER PERSONA & ALUR KERJA (USER JOURNEY)
* **Kasus 1 (Pelanggan di Luar Toko):** Pelanggan selesai melakukan pembayaran online $\rightarrow$ Mengklik link dari chat WhatsApp $\rightarrow$ Membuka halaman `/receipt/POS-XXXX` kapan saja tanpa perlu login $\rightarrow$ Menunjukkan barcode di layar HP kepada kasir toko saat hari pengambilan.
* **Kasus 2 (Pelanggan Lupa Simpan Link):** Pelanggan membuka website Pos Outdoor $\rightarrow$ Klik menu navigasi "Cek Booking" $\rightarrow$ Masukkan No. WhatsApp & Kode $\rightarrow$ Nota langsung muncul.
* **Kasus 3 (Kasir di Toko):** Pelanggan datang $\rightarrow$ Kasir scan barcode atau cari di `/admin/bookings` $\rightarrow$ Klik tombol "Cetak Struk" $\rightarrow$ Printer thermal kasir mencetak struk rangkap 2 (1 untuk pelanggan, 1 dijepit bersama KTP asli).

---

## 4. ⚙️ SPESIFIKASI FUNGSIONAL & ATURAN BISNIS (BUSINESS RULES)

### A. Komponen Wajib di Dalam Nota / Struk
1. **Header Toko:**
   * Nama Toko: POS OUTDOOR LOMBOK
   * Alamat Fisik Toko & Kontak CS WhatsApp: `0838-3866-5398`
   * Jam Operasional: 07.00 – 22.00 WITA
2. **Identitas Transaksi & Pelanggan:**
   * Kode Booking (Ukuran besar & jelas)
   * Barcode Code128 / QR Code (dapat dipindai scanner optik)
   * Nama Lengkap Penyewa & No. WhatsApp
3. **Jadwal Sewa & Durasi:**
   * Tanggal & Jam Mulai Ambil (Mulai jam 08.00 WITA)
   * Tanggal & Batas Jam Kembali (Maksimal jam 20.00 WITA)
   * Total Durasi: [X] Hari [Y] Malam (Hitungan basis malam)
4. **Detail Peralatan yang Disewa:**
   * Tabel daftar nama alat, jumlah unit (qty), harga satuan per malam, dan subtotal.
5. **Rincian Status Pembayaran (Kolaborasi Tim 3):**
   * Pilihan Tipe: `LUNAS` atau `DP MINIMAL (30%)`.
   * Total Biaya Sewa: Rp xxx.xxx
   * Nominal yang Telah Dibayar: Rp xxx.xxx
   * **Sisa Tagihan Wajib Dibayar di Toko:** Rp xxx.xxx (dengan badge warna kuning jika DP).
6. **Rincian Denda & Pengembalian (Jika ada - Kolaborasi Tim 1):**
   * Denda Keterlambatan: Rp xxx.xxx
   * Denda Kerusakan/Cacat: Rp xxx.xxx
   * Total Denda yang Dibayar: Rp xxx.xxx
7. **Klausul Jaminan & Legalitas Toko (Footer Struk):**
   * *"Wajib meninggalkan KTP fisik asli dengan nama yang sama selama masa sewa."*
   * *"Keterlambatan pengembalian dikenakan denda sesuai kebijakan toko."*

---

## 5. 💻 SPESIFIKASI TEKNIS (TECHNICAL SPECIFICATIONS)

### A. Rute Baru di Next.js (`src/app/`)
1. **`src/app/receipt/[id]/page.tsx`**
   * Halaman publik untuk menampilkan nota berdasarkan `params.id` (Kode Booking).
   * Fetch data dari endpoint `/api/receipt/[id]`.
   * Tampilan responsif (optimal di mobile portrait).
2. **`src/app/cek-booking/page.tsx`**
   * Halaman publik form pencarian: Input `bookingCode` dan `whatsappNumber`.
   * Redirect otomatis ke `/receipt/[id]` jika data cocok.

### B. Endpoint API yang Dikerjakan Tim 2
1. **`GET /api/receipt/[id]`**
   * **Deskripsi:** Mengambil detail lengkap pesanan, relasi pengguna, item yang dipesan, dan status pembayaran/denda.
   * **Response:**
     ```json
     {
       "bookingCode": "POS-202611-628",
       "createdAt": "2026-11-02T13:45:00Z",
       "user": {
         "fullName": "Dicky Ananta",
         "whatsappNumber": "08123456789"
       },
       "schedule": {
         "startDate": "2026-11-05",
         "endDate": "2026-11-07",
         "nightCount": 2
       },
       "items": [
         { "name": "Tenda Kap. 4", "quantity": 1, "pricePerNight": 50000, "total": 100000 }
       ],
       "payment": {
         "totalPrice": 100000,
         "paymentType": "DP",
         "amountPaid": 30000,
         "remainingAmount": 70000,
         "status": "DP_PAID"
       },
       "fines": {
         "fineOverdue": 0,
         "fineDamage": 0,
         "fineNotes": null,
         "fineStatus": "NONE"
       }
     }
     ```

### C. Styling Print Thermal (`@media print`)
Tambahkan aturan CSS khusus cetak pada komponen nota:
```css
@media print {
  body * {
    visibility: hidden;
  }
  #thermal-receipt, #thermal-receipt * {
    visibility: visible;
  }
  #thermal-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 58mm; /* atau 80mm */
    font-size: 11px;
    color: #000;
    background: #fff;
    padding: 2mm;
  }
  .no-print {
    display: none !important;
  }
}
```

---

## 6. 🎨 DESAIN UI & INTEGRASI KOMPONEN
1. **Perbaikan di [`PaymentPhaseB.tsx`](file:///d:/Kuliah/SMT-6/Imk\posOutdoor\src\components\PaymentPhaseB.tsx):**
   * Ganti link hardcoded WhatsApp dari `posoutdoor.com/receipt/${code}` menjadi `${window.location.origin}/receipt/${code}`.
2. **Navigasi Utama (`src/components/Navbar.tsx`):**
   * Tambahkan tautan menu **"Cek Booking"** di samping link "Katalog" & "Profil".
3. **Admin Dashboard (`src/app/admin/bookings/page.tsx`):**
   * Tambahkan tombol ikon printer `[ 🖨️ Struk ]` pada setiap baris transaksi yang membuka dialog cetak langsung.

---

## 7. 🔗 MATRIKS KETERGANTUNGAN ANTAR-TIM
* **Dari Tim 3 (Payment):** Tim 2 membutuhkan nilai `paymentType`, `amountPaid`, dan `remainingAmount` agar rincian DP vs Pelunasan akurat.
* **Dari Tim 1 (Denda):** Tim 2 membutuhkan rincian denda jika pesanan sudah berstatus `COMPLETED` dengan denda.
* **Ke Tim 1 & 3:** Menyediakan cetak fisik kwitansi pelunasan dan bukti bebas jaminan KTP fisik.

---

## 8. ✅ DEFINITION OF DONE (DOD) / KRITERIA PENERIMAAN
- [ ] Rute `/receipt/[id]` dapat dibuka dan tidak menghasilkan error 404 saat diakses langsung melalui URL browser.
- [ ] Tombol kirim WhatsApp pada selesai pembayaran mengarahkan ke link nota yang valid dan dapat dibuka di tab baru.
- [ ] Halaman `/cek-booking` berhasil menampilkan nota setelah user memasukkan no WA dan kode booking yang valid.
- [ ] Tombol cetak struk berfungsi normal dengan dialog cetak browser (`window.print()`) dan format pas dengan ukuran kertas kasir (58mm/80mm).
- [ ] Admin dapat membuka atau mencetak nota transaksi dari dashboard admin.
