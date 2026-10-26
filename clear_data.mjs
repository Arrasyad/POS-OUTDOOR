import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function clearData() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/posoutdoor_db'
  });
  
  try {
    console.log("Mempersiapkan penghapusan...");
    await conn.execute("SET FOREIGN_KEY_CHECKS = 0;");
    
    // Hapus seluruh data transaksi dan relasinya
    console.log("Menghapus data pesanan (booking_items, bookings)...");
    await conn.execute("TRUNCATE TABLE booking_items;");
    await conn.execute("TRUNCATE TABLE bookings;");
    
    // Hapus seluruh data pelanggan
    console.log("Menghapus data pelanggan (users)...");
    await conn.execute("TRUNCATE TABLE users;");
    
    // Hapus seluruh produk dan paket
    console.log("Menghapus data inventaris (bundle_items, products)...");
    await conn.execute("TRUNCATE TABLE bundle_items;");
    await conn.execute("TRUNCATE TABLE products;");
    
    await conn.execute("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("Semua data berhasil dibersihkan!");
  } catch (e) {
    console.error("Terjadi kesalahan:", e.message);
  } finally {
    await conn.end();
  }

  process.exit(0);
}

clearData();
