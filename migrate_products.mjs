import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/posoutdoor_db'
  });
  
  try {
    await conn.execute("ALTER TABLE products ADD COLUMN image_url VARCHAR(1024) DEFAULT NULL");
    console.log("Added image_url column");
  } catch(e) {
    console.log("image_url might already exist", e.message);
  }

  try {
    await conn.execute("ALTER TABLE products MODIFY COLUMN icon_name VARCHAR(255) DEFAULT NULL");
    console.log("Modified icon_name column");
  } catch(e) {
    console.log("Failed to modify icon_name", e.message);
  }

  console.log('Migration Done');
  process.exit(0);
}
run();
