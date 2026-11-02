# 🗺️ DOKUMEN PANDUAN PENGEMBANGAN 4 TIM (POS OUTDOOR V2.1)

Repositori ini sedang dalam pengembangan paralel oleh 4 tim pengembang untuk mentransformasi prototipe interaktif Pos Outdoor menjadi sistem POS rental yang solid, terintegrasi, dan siap operasional.

---

## 👥 PEMBAGIAN TIM & DOKUMEN PRD

| Tim / Anggota | Fitur Utama | File PRD Markdown | Fokus Utama |
| :--- | :--- | :--- | :--- |
| **Tim 1** | **Manajemen Denda** | [`PRD-TIM-1-DENDA.md`](./PRD-TIM-1-DENDA.md) | Denda keterlambatan (overdue), denda kerusakan alat, modal inspeksi fisik di kasir |
| **Tim 2** | **Pembaruan Nota / Struk** | [`PRD-TIM-2-NOTA.md`](./PRD-TIM-2-NOTA.md) | Perbaikan broken link WA, rute publik `/receipt/[id]`, pelacak `/cek-booking`, cetak thermal kasir (58mm) |
| **Tim 3** | **Penyempurnaan Payment** | [`PRD-TIM-3-PAYMENT.md`](./PRD-TIM-3-PAYMENT.md) | Pemisahan DP 30% vs Sisa tagihan, tombol aksi pelunasan kasir toko, audit pendapatan riil |
| **Tim 4** | **Penyempurnaan CRUD Stok** | [`PRD-TIM-4-STOK.md`](./PRD-TIM-4-STOK.md) | Validasi stok sisi server (anti-overselling), aktivasi CRUD paket bundling, status unit maintenance/rusak |

---

## 🔄 DIAGRAM ALUR INTEGRASI ANTAR-TIM

```
                        [ TIM 4: CRUD STOK ]
                     (Stok Siap vs Maintenance)
                                 │
                                 ▼
                     [ PENGUNCIAN TANGGAL & CART ]
                                 │
                                 ▼
                       [ TIM 3: PAYMENT ]
                  (DP 30% atau Lunas via QRIS)
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ TIM 2: NOTA DIGITAL ]           [ GUDANG TOKO ]
   (Struk Thermal & Link WA)       (Serah Terima & Tahan KTP)
                 │                               │
                 │                     (Saat Barang Kembali)
                 │                               │
                 ▼                               ▼
       [ TIM 3: PELUNASAN ]             [ TIM 1: DENDA ]
    (Pelunasan Sisa di Kasir)      (Inspeksi Fisik & Telat)
                                                 │
                                                 ▼
                                        (Jika Ada Kerusakan)
                                                 │
                                                 ▼
                                       [ TIM 4: KURANGI STOK ]
```

---

## 🌿 STRATEGI GIT BRANCHING (MENCEGAH MERGE CONFLICT)

Untuk menghindari saling menimpa kode pada file sentral seperti `src/db/schema.ts`, `src/store/useStore.ts`, dan `src/app/admin/bookings/page.tsx`, setiap tim **wajib** mengikuti aturan branch berikut:

```bash
# Branch utama
main

# Branch per tim
feature/tim1-denda
feature/tim2-nota-receipt
feature/tim3-payment-settlement
feature/tim4-stock-crud
```

### Aturan Koordinasi Skema Database (`src/db/schema.ts`)
1. **Lakukan Migrasi Database Bersama Lebih Dulu:** Seluruh penambahan kolom baru (denda, detail DP/pelunasan, dan maintenance stock) sebaiknya dimerge ke skema pusat terlebih dahulu sebelum penulisan UI dimulai.
2. **Jangan Menghapus Kolom Lama:** Kolom yang sudah ada tidak boleh diganti namanya agar relasi transaksi yang sudah ada di database tidak rusak.

---

## 📅 JADWAL EKSEKUSI REKOMENDASI (SPRINT PLAN)

* **Hari 1:** Sinkronisasi Skema Database Drizzle & Persiapan API Contracts antar 4 tim.
* **Hari 2 - 3:** Pengerjaan logika backend API dan komponen UI mandiri di branch masing-masing.
* **Hari 4:** Integrasi antar-modul (Tim 1 & 4 untuk alat rusak, Tim 2 & 3 untuk tampilan DP di nota).
* **Hari 5:** Pengujian menyeluruh (*End-to-End Testing*), simulasi kasir di toko, dan merge ke `main`.
