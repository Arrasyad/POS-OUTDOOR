import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/posoutdoor_db'
  });
  await conn.execute("ALTER TABLE bookings MODIFY COLUMN status ENUM('PENDING','DP_PAID','PAID','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING'");
  console.log('Migration Done');
  process.exit(0);
}
run();
