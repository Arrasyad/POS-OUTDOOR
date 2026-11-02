# 📄 PRD - TIM 3: PENYEMPURNAAN FITUR PEMBAYARAN (PAYMENT & SETTLEMENT)
**Sistem Informasi POS Rental Outdoor (Pos Outdoor)**

| Metadata | Keterangan |
| :--- | :--- |
| **Penanggung Jawab** | **Tim 3 / Anggota 3** |
| **Modul** | Sistem Pembayaran DP (30%), Pelunasan Kasir Toko, & Manajemen Transaksi |
| **Status Dokumen** | Draft Ready for Development |
| **Target Rilis** | Sprint 1 - Versi 2.1 |
| **Terkait dengan** | Tim 1 (Pelunasan Denda), Tim 2 (Tampilan Pembayaran di Nota), Tim 4 (Penguncian Stok Saat Bayar) |

---

## 1. 📌 LATAR BELAKANG & MASALAH (PROBLEM STATEMENT)
1. **Pencatatan Keuangan Tidak Membedakan DP dan Lunas:** Pada antarmuka pengguna (`PaymentPhaseA.tsx`), pengguna dapat memilih antara opsi `LUNAS` dan `DP Minimal (30%)`. Namun di basis data ([`schema.ts`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/db/schema.ts#L60-L72)), sistem hanya menyimpan satu kolom angka: `totalPrice`. Tidak ada pencatatan berapa rupiah yang sudah disetor via QRIS dan berapa sisa uang tunai yang belum dibayar!
2. **Tidak Ada Fitur Pelunasan di Kasir Toko:** Saat pelanggan yang hanya membayar DP 30% datang ke toko untuk mengambil tenda, kasir tidak memiliki tombol atau form untuk memproses **Pelunasan Sisa 70%**. Di dashboard admin, status hanya ada pilihan acak tanpa validasi finansial.
3. **Pembayaran 100% Simulasi:** Mekanisme pembayaran saat ini hanya bergantung pada tombol trigger simulasi lokal `confirmPayment()` di [`useStore.ts`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/store/useStore.ts#L179-L224) tanpa pencatatan metode bayar (QRIS, Tunai, atau Transfer Bank).
4. **Ringkasan Finansial Toko Kurang Akurat:** Metrik di [`/admin/page.tsx`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/app/admin/page.tsx#L68-L70) hanya menjumlahkan `totalPrice` dari pesanan yang ada, padahal banyak transaksi yang baru masuk DP-nya saja (menyebabkan pembukuan kas toko tidak sinkron dengan uang riil di rekening/laci kasir).

---

## 2. 🎯 TUJUAN & TARGET (GOALS & OBJECTIVES)
1. Memperbarui skema basis data untuk memisahkan secara tegas: **Total Tagihan**, **Nominal yang Dibayar (DP / Lunas)**, dan **Sisa Tagihan (*Remaining Balance*)**.
2. Menyediakan alur pembayaran 2 tahap:
   * **Tahap 1 (Online):** Pembayaran DP (30%) atau Lunas via QRIS/Transfer saat checkout web.
   * **Tahap 2 (Offline di Toko):** Pelunasan sisa 70% saat pelanggan datang serah terima KTP di toko fisik.
3. Membangun tombol aksi **`[ 💵 Terima Pelunasan Sisa ]`** di Admin Dashboard.
4. Memperbarui halaman Ringkasan Bisnis Admin (`/admin/page.tsx`) agar menampilkan:
   * Total Uang Masuk Aktual (*Actual Cash Received*).
   * Piutang Belum Dilunasi (*Pending Settlement / DP Bookings*).

---

## 3. 👤 USER PERSONA & ALUR KERJA (USER JOURNEY)
* **Alur Pengguna (Penyewa):**
  1. Pelanggan memilih tanggal dan alat $\rightarrow$ Checkout $\rightarrow$ Di Halaman Pembayaran (Fase A) memilih metode: **`[ DP Minimal 30%: Rp 30.000 ]`**.
  2. Pelanggan melakukan scan QRIS dan menekan konfirmasi pembayaran.
  3. Sistem mencatat transaksi dengan status **`DP_PAID`**.
  4. Nota digital langsung mencantumkan:  
     * *Total Sewa:* Rp 100.000  
     * *DP Masuk:* Rp 30.000  
     * *Sisa Wajib Bayar di Kasir:* **Rp 70.000**.
* **Alur Kasir (Saat Pengambilan Alat di Toko):**
  1. Pelanggan tiba di toko $\rightarrow$ Kasir membuka data booking `#POS-XXXX`.
  2. Kasir melihat badge kuning bertuliskan: **`DP PAID (Kurang Rp 70.000)`**.
  3. Pelanggan membayar sisa Rp 70.000 (Tunai / QRIS Kasir).
  4. Kasir klik tombol **`[ Lunasi Sisa Rp 70.000 ]`**.
  5. Status transaksi beralih menjadi **`PAID` (Lunas Penuh)** dan alat diserahkan bersamaan dengan penahanan KTP asli.

---

## 4. ⚙️ SPESIFIKASI FUNGSIONAL & ATURAN BISNIS (BUSINESS RULES)

### A. Rumus Kalkulasi Pembayaran
1. **Opsi LUNAS:**
   * $\text{Amount Paid} = \text{Total Price}$
   * $\text{Remaining Amount} = 0$
   * Status awal: `PAID`
2. **Opsi DP MINIMAL (30%):**
   * $\text{Amount Paid} = \text{Round}(\text{Total Price} \times 0.3)$
   * $\text{Remaining Amount} = \text{Total Price} - \text{Amount Paid}$
   * Status awal: `DP_PAID`

### B. Transisi Status Pembayaran (State Machine)
```
[CHECKOUT WEB]
       │
       ├── Pilih LUNAS ──────► [ Status: PAID ] ────► (Siap Ambil di Toko)
       │
       └── Pilih DP (30%) ───► [ Status: DP_PAID ] ──► (Pelanggan Tiba di Toko)
                                       │
                         [Kasir Klik 'Lunasi Sisa']
                                       │
                                       ▼
                               [ Status: PAID ] ────► (KTP Ditinggal, Alat Keluar)
```

### C. Pembatalan Otomatis Timer Kedaluwarsa
* Timer 15 menit di checkout: Jika transaksi dibuat dalam status `PENDING` tetapi tidak dibayar hingga batas waktu habis, sistem otomatis menandai transaksi sebagai `CANCELLED` dan melepaskan kuota alat (koordinasi Tim 4).

---

## 5. 💻 SPESIFIKASI TEKNIS (TECHNICAL SPECIFICATIONS)

### A. Perubahan Skema Basis Data (`src/db/schema.ts`)
Tambahkan field finansial berikut pada tabel `bookings`:
```typescript
paymentType: mysqlEnum("payment_type", ["LUNAS", "DP"]).default("LUNAS").notNull(),
amountPaid: int("amount_paid").default(0).notNull(),
remainingAmount: int("remaining_amount").default(0).notNull(),
paymentMethod: varchar("payment_method", { length: 50 }).default("QRIS").notNull(),
settledAt: datetime("settled_at"), // Waktu pelunasan kasir
```

### B. Endpoint API yang Dikerjakan Tim 3
1. **Pembaruan `POST /api/bookings`**:
   * Menghitung nilai `amountPaid` dan `remainingAmount` di server berdasarkan pilihan `paymentMethod` (LUNAS atau DP).
   * Mencegah manipulasi angka harga dari sisi frontend browser.
2. **`POST /api/admin/bookings/[id]/settle`**:
   * **Deskripsi:** Endpoint kasir untuk menerima pelunasan sisa tagihan.
   * **Payload Request:**
     ```json
     {
       "settlementAmount": 70000,
       "paymentMethod": "CASH", // atau "QRIS"
       "notes": "Pelunasan tunai di kasir saat ambil alat"
     }
     ```
   * **Logika Backend:**
     * Validasi: Pastikan booking berstatus `DP_PAID`.
     * Tambahkan `amountPaid = amountPaid + settlementAmount`.
     * Set `remainingAmount = 0`.
     * Ubah status menjadi `PAID`.
     * Set `settledAt = NOW()`.
   * **Response:** `{ "success": true, "status": "PAID", "remainingAmount": 0 }`

3. **Pembaruan `GET /api/admin/metrics`**:
   * Perbarui query metrik:
     * `totalRevenue`: Penjumlahan kolom `amountPaid` (uang riil yang sudah diterima toko).
     * `pendingReceivables`: Penjumlahan kolom `remainingAmount` dari transaksi `DP_PAID`.

---

## 6. 🎨 DESAIN UI & KOMPONEN YANG DIUBAH
1. **`src/components/PaymentPhaseA.tsx`:**
   * Tampilkan box komparasi yang sangat jelas antara bayar Lunas vs DP 30%.
   * Tambahkan simulasi upload bukti transfer atau pilihan bank jika diperlukan mode manual.
2. **`src/app/admin/bookings/page.tsx`:**
   * Tampilkan kolom tagihan terpisah: `Total`, `Terbayar`, dan `Kurang`.
   * Pada baris yang berstatus `DP_PAID`, sediakan tombol hijau menyala: **`[ Lunasi Rp XX.XXX ]`**.
3. **`src/app/admin/page.tsx`:**
   * Tambahkan kartu metrik ke-4: **"Piutang Belum Dilunasi"** (Uang yang akan diterima di toko saat serah terima alat).

---

## 7. 🔗 MATRIKS KETERGANTUNGAN ANTAR-TIM
* **Ke Tim 2 (Nota):** Sediakan data `paymentType`, `amountPaid`, dan `remainingAmount` untuk dicetak pada struk.
* **Ke Tim 1 (Denda):** Sistem pelunasan sewa harus selesai terlebih dahulu sebelum transaksi dapat diproses pengembaliannya oleh Tim 1.
* **Ke Tim 4 (Stok):** Ketika status beralih menjadi `PAID` atau `DP_PAID`, stok resmi direservasi di server.

---

## 8. ✅ DEFINITION OF DONE (DOD) / KRITERIA PENERIMAAN
- [ ] Kolom `paymentType`, `amountPaid`, `remainingAmount`, dan `settledAt` sukses dimigrasikan ke database.
- [ ] Transaksi dengan opsi DP otomatis mencatat 30% ke `amountPaid` dan 70% ke `remainingAmount`.
- [ ] Transaksi berstatus `DP_PAID` dapat dilunasi oleh admin melalui tombol pelunasan di dashboard.
- [ ] Setelah pelunasan, sisa tagihan menjadi Rp 0 dan status otomatis berubah menjadi `PAID`.
- [ ] Metrik total pendapatan di halaman ringkasan admin menampilkan jumlah uang riil yang sudah dibayar.
