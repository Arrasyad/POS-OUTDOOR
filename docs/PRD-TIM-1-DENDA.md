# 📄 PRD - TIM 1: FITUR MANAJEMEN DENDA & PENGEMBALIAN BARANG
**Sistem Informasi POS Rental Outdoor (Pos Outdoor)**

| Metadata | Keterangan |
| :--- | :--- |
| **Penanggung Jawab** | **Tim 1 / Anggota 1** |
| **Modul** | Manajemen Denda, Pengembalian Alat, & Inspeksi Fisik |
| **Status Dokumen** | Draft Ready for Development |
| **Target Rilis** | Sprint 1 - Versi 2.1 |
| **Terkait dengan** | Tim 2 (Struk Denda), Tim 3 (Pelunasan Denda), Tim 4 (Update Stok Rusak) |

---

## 1. 📌 LATAR BELAKANG & MASALAH (PROBLEM STATEMENT)
Saat ini sistem Pos Outdoor hanya mencakup alur peminjaman awal (*checkout to payment*). Ketika pelanggan datang mengembalikan barang ke toko:
1. **Tidak Ada Deteksi Keterlambatan:** Jika pelanggan telat mengembalikan (melewati batas jam 20:00 WITA atau telat beberapa hari), sistem tidak memiliki mekanisme perhitungan denda otomatis.
2. **Tidak Ada Pencatatan Kerusakan Fisik:** Jika tenda sobek, frame patah, atau pasak hilang, admin toko tidak dapat mencatat biaya kompensasi kerusakan secara terstruktur pada sistem.
3. **Dropdown Status Terlalu Bebas:** Di Admin Dashboard (`/admin/bookings`), admin bisa langsung mengubah status pesanan menjadi `COMPLETED` tanpa proses verifikasi fisik (*physical check-in checklist*).

---

## 2. 🎯 TUJUAN & TARGET (GOALS & OBJECTIVES)
1. Membangun **Modal Inspeksi Pengembalian Barang (*Return Inspection Modal*)** di dashboard admin.
2. Mengotomatisasi perhitungan **Denda Keterlambatan (*Overdue Fine*)** berdasarkan selisih tanggal rencana kembali vs tanggal pengembalian aktual.
3. Menyediakan form pencatatan **Denda Kerusakan / Kehilangan (*Damage & Loss Fine*)** dengan catatan deskriptif.
4. Merekam status denda (`NONE`, `UNPAID`, `PAID`) yang terintegrasi dengan status booking (`COMPLETED` atau `OVERDUE`).

---

## 3. 👤 USER PERSONA & ALUR KERJA (USER JOURNEY)
* **Aktor Utama:** Kasir / Staf Gudang Toko Pos Outdoor.
* **Alur Operasional di Toko:**
  1. Pelanggan datang ke toko membawa alat sewa dan menunjukkan Kode Booking (atau KTP jaminan).
  2. Kasir mencari data pesanan di `/admin/bookings`.
  3. Kasir mengklik tombol aksi **`[ 📦 Terima Pengembalian ]`**.
  4. Muncul modal inspeksi:
     * Sistem otomatis mengecek apakah tanggal hari ini > `endDate`. Jika ya, otomatis menghitung hari keterlambatan dan nominal denda.
     * Kasir memeriksa fisik barang satu per satu (checklist).
     * Jika ada barang cacat/rusak/hilang, kasir memasukkan nominal denda kerusakan dan catatan (misal: *"Pasak tenda hilang 2 pcs, denda Rp 20.000"*).
  5. Kasir memilih metode pembayaran denda (Tunai di kasir / QRIS).
  6. Setelah denda dibayar (atau denda Rp 0 jika tepat waktu & mulus), pesanan dinyatakan `COMPLETED` dan KTP fisik diserahkan kembali kepada pelanggan.

---

## 4. ⚙️ SPESIFIKASI FUNGSIONAL & ATURAN BISNIS (BUSINESS RULES)

### A. Aturan Perhitungan Denda Keterlambatan (Overdue)
1. **Batas Toleransi Pengembalian:** Tanggal `endDate` maksimal pukul 20:00 WITA.
2. **Perhitungan Hari Telat:**
   * Jika dikembalikan pada tanggal `endDate` sebelum 20:00 = 0 hari (Tidak didenda).
   * Jika dikembalikan H+1 = 1 hari telat.
   * Rumus denda keterlambatan:  
     $$\text{Denda Keterlambatan} = \text{Hari Terlambat} \times \text{Tarif Denda Harian}$$  
     *(Tarif acuan default: Rp 25.000 / hari per transaksi atau 100% tarif sewa harian alat yang bersangkutan).*

### B. Aturan Denda Kerusakan & Kehilangan
1. Bersifat input manual kasir berdasarkan daftar biaya ganti rugi toko:
   * Kotor berlumpur ekstrem (butuh laundry): Rp 15.000 – Rp 30.000
   * Pasak hilang: Rp 10.000 / pcs
   * Frame patah / Sobek: Rp 50.000 – Rp 150.000
   * Hilang total: Nilai beli baru alat tersebut.
2. Wajib menyertakan input teks `fineNotes` untuk transparansi ke pelanggan.

### C. State Machine Status Booking
* `PAID` / `DP_PAID` $\rightarrow$ Jika melewati `endDate` dan belum dikembalikan $\rightarrow$ Status berubah menjadi **`OVERDUE`** (badge merah berkedip).
* `OVERDUE` / `PAID` $\rightarrow$ Kasir proses inspeksi $\rightarrow$ Denda lunas $\rightarrow$ **`COMPLETED`**.

---

## 5. 💻 SPESIFIKASI TEKNIS (TECHNICAL SPECIFICATIONS)

### A. Perubahan Skema Basis Data (`src/db/schema.ts`)
Tambahkan field berikut pada tabel `bookings`:
```typescript
// Kolom baru pada tabel bookings
actualReturnDate: datetime("actual_return_date"),
fineOverdue: int("fine_overdue").default(0).notNull(),
fineDamage: int("fine_damage").default(0).notNull(),
fineNotes: text("fine_notes"),
fineStatus: mysqlEnum("fine_status", ["NONE", "UNPAID", "PAID"]).default("NONE").notNull(),
```
Perbarui enum status pada `bookings`:
```typescript
status: mysqlEnum("status", [
  "PENDING",
  "DP_PAID",
  "PAID",
  "OVERDUE",    // Status baru untuk yang telat kembali
  "COMPLETED",
  "CANCELLED"
]).default("PENDING").notNull(),
```

### B. Endpoint API yang Dikerjakan Tim 1
1. **`POST /api/admin/bookings/[id]/return`**
   * **Deskripsi:** Memproses inspeksi pengembalian barang dan mencatat denda.
   * **Payload Request:**
     ```json
     {
       "actualReturnDate": "2026-11-03T14:30:00Z",
       "fineOverdue": 50000,
       "fineDamage": 20000,
       "fineNotes": "Telat 2 hari. Pasak tenda hilang 2 pcs.",
       "finePaid": true,
       "paymentMethod": "CASH",
       "damagedItems": [
         { "productId": "tenda-4", "quantityDamaged": 1, "action": "MAINTENANCE" }
       ]
     }
     ```
   * **Response:** `{ "success": true, "totalFine": 70000, "status": "COMPLETED" }`

---

## 6. 🎨 DESAIN UI / KOMPONEN YANG DIUBAH / DIBUAT
1. **`src/app/admin/bookings/page.tsx`**:
   * Tambahkan kolom "Aksi Pengembalian" di tabel transaksi.
   * Tambahkan badge `OVERDUE` dengan gaya warna oranye/merah menyala.
2. **`src/components/admin/ReturnInspectionModal.tsx` (Komponen Baru)**:
   * Modal glassmorphism berisi ringkasan sewa, checklist barang, kalkulator denda otomatis, dan ringkasan pembayaran denda.

---

## 7. 🔗 MATRIKS KETERGANTUNGAN ANTAR-TIM
* **Ke Tim 2 (Nota):** Tim 1 wajib menyediakan data denda (`fineOverdue`, `fineDamage`, `fineNotes`) agar Tim 2 bisa mencetaknya di nota pengembalian / kwitansi denda.
* **Ke Tim 3 (Payment):** Pembayaran denda yang diterima kasir wajib dicatat ke riwayat penerimaan uang kasir.
* **Ke Tim 4 (Stok):** Jika ada alat yang dilaporkan rusak pada `damagedItems`, panggil fungsi Tim 4 untuk memindahkan stok siap sewa ke `maintenanceStock`.

---

## 8. ✅ DEFINITION OF DONE (DOD) / KRITERIA PENERIMAAN
- [ ] Kolom denda pada tabel `bookings` telah terintegrasi di database via Drizzle migration.
- [ ] Tombol `[ Terima Pengembalian ]` aktif pada transaksi yang berstatus `PAID` atau `OVERDUE`.
- [ ] Sistem menghitung denda otomatis jika waktu server > `endDate`.
- [ ] Kasir dapat menambahkan denda kerusakan fisik beserta catatannya.
- [ ] Transaksi sukses beralih ke status `COMPLETED` setelah denda dibayar atau nihil.
- [ ] Tidak ada error console di browser dan API merespons dengan status 200/400 yang rapi.
