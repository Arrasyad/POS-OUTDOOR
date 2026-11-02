# 📄 PRD - TIM 4: PENYEMPURNAAN CRUD STOK & MANAJEMEN INVENTARIS
**Sistem Informasi POS Rental Outdoor (Pos Outdoor)**

| Metadata | Keterangan |
| :--- | :--- |
| **Penanggung Jawab** | **Tim 4 / Anggota 4** |
| **Modul** | Manajemen Inventaris, Validasi Stok Sisi Server, Status Maintenance & Paket Bundling |
| **Status Dokumen** | Draft Ready for Development |
| **Target Rilis** | Sprint 1 - Versi 2.1 |
| **Terkait dengan** | Tim 1 (Update Stok Rusak dari Denda), Tim 3 (Validasi Kuota Saat Booking) |

---

## 1. 📌 LATAR BELAKANG & MASALAH (PROBLEM STATEMENT)
1. **Tidak Ada Validasi Stok di Sisi Server (*Server-Side Stock Race Condition*):** Pengecekan ketersediaan stok saat ini hanya dilakukan di browser pengguna melalui [`stockCalculator.ts`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/lib/stockCalculator.ts). Pada API endpoint [`/api/bookings`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/app/api/bookings/route.ts#L51-L105), sistem langsung melakukan `insert` ke tabel tanpa memeriksa apakah unit masih tersisa pada rentang tanggal tersebut. Akibatnya, jika dua pelanggan melakukan checkout di detik yang sama untuk tenda terakhir, keduanya akan sukses dan terjadi **Overselling (Stok Minus)**.
2. **Fitur Paket Bundling Mati di Admin:** Tabel relasi `bundle_items` sudah ada di skema MySQL ([`schema.ts`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/db/schema.ts#L29-L47)), namun pada antarmuka admin ([`src/app/admin/products/page.tsx`](file:///d:/Kuliah/SMT-6/Imk/posOutdoor/src/app/admin/products/page.tsx#L111-L157)), form create produk meng-hardcode nilai `isBundle: false`. Admin tidak bisa membuat, mengedit, atau melihat isi paket bundling lewat UI!
3. **Visibilitas Status Stok Tercampur:** Kolom `stock` di database bersifat angka statis. Admin tidak bisa membedakan:
   * Berapa unit yang sedang berada di gudang toko?
   * Berapa unit yang sedang dibawa pendaki ke gunung?
   * Berapa unit yang sedang rusak / robek / dicuci (*under maintenance*)?

---

## 2. 🎯 TUJUAN & TARGET (GOALS & OBJECTIVES)
1. Membangun **Validasi Ketersediaan Stok Sisi Server (*Server-Side Concurrency Check*)** di endpoint `/api/bookings` dengan transaksi atomik.
2. Membuka dan menyempurnakan **CRUD Paket Bundling** di Admin Dashboard:
   * Admin dapat membuat paket (misal: *"Paket Pendaki Berdua 2D1N"*).
   * Memilih produk-produk penyusun paket beserta kuantitasnya (misal: 1 Tenda + 2 Matras + 2 SB + 1 Kompor).
   * Stok paket dihitung otomatis secara dinamis mengikuti stok komponen paling sedikit.
3. Menyediakan pemisahan status stok: **Stok Fisik Total**, **Stok Rusak/Maintenance**, dan **Stok Siap Sewa**.
4. Menyediakan endpoint untuk menerima pemindahan unit ke status rusak ketika ada laporan denda dari Tim 1.

---

## 3. 👤 USER PERSONA & ALUR KERJA (USER JOURNEY)
* **Kasus 1 (Admin Membuat Paket Bundling):**
  1. Admin membuka menu `/admin/products`.
  2. Klik tombol **`[ + Tambah Paket Bundling ]`**.
  3. Mengisi Nama Paket, Harga Sewa Paket, dan memilih alat-alat komponen dari daftar produk (misal: pilih Tenda 4P qty 1, Matras qty 2).
  4. Simpan $\rightarrow$ Sistem menyimpan ke tabel `products` (`is_bundle = 1`) dan tabel `bundle_items`.
  5. Pengguna di katalog Level 0 langsung melihat paket tersebut dengan stok yang terkalkulasi otomatis.
* **Kasus 2 (Pencegahan Bentrok Stok Saat Checkout):**
  1. Pelanggan menekan tombol bayar di web.
  2. Endpoint `/api/bookings` menghitung ulang stok alat pada rentang tanggal sewa di server.
  3. Jika stok aman, pesanan dibuat. Jika ada alat yang sudah habis disewa orang lain beberapa detik sebelumnya, server mengembalikan error 409 (*Conflict: Stock Unavailable*) dan meminta user memilih tanggal/alat lain.
* **Kasus 3 (Penanganan Alat Rusak dari Tim 1):**
  1. Tim 1 menyelesaikan proses denda untuk tenda sobek.
  2. Sistem otomatis memindahkan 1 unit tenda dari stok siap sewa ke `maintenanceStock`.
  3. Stok di katalog berkurang 1 hingga unit selesai diperbaiki oleh staf toko.

---

## 4. ⚙️ SPESIFIKASI FUNGSIONAL & ATURAN BISNIS (BUSINESS RULES)

### A. Rumus Ketersediaan Stok Fisik
$$\text{Stok Siap Sewa (Base)} = \text{Stok Total} - \text{Stok Maintenance}$$

### B. Rumus Stok Paket Bundling
Untuk sebuah produk paket $B$ yang terdiri dari komponen $c_1, c_2, \dots, c_n$ dengan kebutuhan kuantitas $q_i$:
$$\text{Stok Tersedia Paket } B = \min \left( \left\lfloor \frac{\text{Stok Tersedia } c_1}{q_1} \right\rfloor, \left\lfloor \frac{\text{Stok Tersedia } c_2}{q_2} \right\rfloor, \dots, \left\lfloor \frac{\text{Stok Tersedia } c_n}{q_n} \right\rfloor \right)$$

### C. Server-Side Overlap Checking Logic
Pada rentang tanggal yang diminta ($T_{\text{start}}$ s.d. $T_{\text{end}}$):
1. Ambil semua pesanan aktif berstatus `PAID`, `DP_PAID`, atau `PENDING` yang tanggalnya bersinggungan:
   $$\text{Booking.startDate} < T_{\text{end}} \quad \text{DAN} \quad \text{Booking.endDate} > T_{\text{start}}$$
2. Untuk setiap malam di rentang tersebut, hitung total kuantitas barang yang telah dipesan.
3. Pastikan:
   $$\text{Maksimal Terpesan} + \text{Kuantitas Diminta} \le \text{Stok Siap Sewa}$$

---

## 5. 💻 SPESIFIKASI TEKNIS (TECHNICAL SPECIFICATIONS)

### A. Perubahan Skema Basis Data (`src/db/schema.ts`)
Perbarui tabel `products`:
```typescript
export const products = mysqlTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  pricePerNight: int("price_per_night").notNull(),
  stock: int("stock").notNull(), // Total unit fisik dimiliki
  maintenanceStock: int("maintenance_stock").default(0).notNull(), // Unit rusak/dicuci
  category: varchar("category", { length: 255 }).notNull(),
  iconName: varchar("icon_name", { length: 255 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  isBundle: boolean("is_bundle").default(false).notNull(),
  description: text("description"),
});
```

### B. Endpoint API yang Dikerjakan Tim 4
1. **Penguatan `POST /api/bookings`:**
   * Sebelum `db.insert`, lakukan query agregasi untuk memvalidasi ketersediaan stok setiap item (dan komponen jika bundle).
   * Jika gagal, kembalikan status `409 Conflict`:
     ```json
     { "error": "Alat 'Tenda Kapasitas 4' tidak mencukupi untuk rentang tanggal yang dipilih." }
     ```

2. **`POST /api/admin/bundles` & `PATCH /api/admin/bundles/[id]`:**
   * **Deskripsi:** Endpoint khusus untuk menyimpan produk paket bundling beserta relasi isi itemnya.
   * **Payload Request:**
     ```json
     {
       "name": "Paket Pendaki Berdua 2D1N",
       "pricePerNight": 95000,
       "category": "Paket Bundling",
       "description": "Termasuk tenda 2P, 2 matras spon, dan 1 kompor portable",
       "imageUrl": "/uploads/paket-berdua.jpg",
       "bundleItems": [
         { "productId": "tenda-2", "quantity": 1 },
         { "productId": "matras-spon", "quantity": 2 },
         { "productId": "kompor-kotak", "quantity": 1 }
       ]
     }
     ```

3. **`PATCH /api/admin/products/[id]/maintenance`:**
   * **Deskripsi:** Mengubah jumlah unit yang dipindahkan ke maintenance atau dikembalikan ke siap sewa.
   * **Payload:** `{ "action": "ADD_MAINTENANCE", "quantity": 1, "notes": "Frame retak" }`

---

## 6. 🎨 DESAIN UI & KOMPONEN YANG DIUBAH
1. **`src/app/admin/products/page.tsx`:**
   * Tambahkan pemisah Tab: **`[ Semua Alat ]`**, **`[ Alat Satuan ]`**, dan **`[ Paket Bundling ]`**.
   * Pada tabel produk, tampilkan indikator 3 angka: `Total: 10 | Siap: 8 | Rusak/Cuci: 2`.
   * Tombol modal baru: **`[ + Buat Paket Bundling ]`** dengan pemilihan item multi-select dinamis.
2. **Katalog Utama (`src/components/ProductCard.tsx`):**
   * Pastikan badge *"Paket Hemat"* muncul untuk produk yang memiliki `isBundle = true`, beserta daftar alat yang didapatkan di dalam paket.

---

## 7. 🔗 MATRIKS KETERGANTUNGAN ANTAR-TIM
* **Dari Tim 1 (Denda):** Menerima sinyal barang rusak untuk otomatis menaikkan `maintenanceStock` dan menurunkan kuota siap sewa.
* **Ke Tim 3 (Payment):** Memastikan stok terkunci (*locked*) selama proses checkout dan dirilis jika pembayaran dibatalkan.
* **Ke Tim 2 (Nota):** Jika yang dipesan adalah paket bundling, sediakan relasi nama-nama komponen paket agar dapat dicetak rinciannya di struk untuk panduan serah terima barang di gudang toko.

---

## 8. ✅ DEFINITION OF DONE (DOD) / KRITERIA PENERIMAAN
- [ ] Server API menolak pemesanan jika kuota alat pada tanggal terpilih telah habis (tidak ada lagi overselling).
- [ ] Admin dapat membuat produk baru bertipe Bundling beserta daftar item komponen dan kuantitasnya.
- [ ] Stok produk bundling di katalog otomatis terhitung berdasarkan stok terkecil dari komponen penyusunnya.
- [ ] Admin dapat melihat dan mengatur unit alat yang masuk ke status `maintenanceStock`.
- [ ] Menghapus produk atau mengedit harga berjalan mulus tanpa merusak relasi pesanan lama.
