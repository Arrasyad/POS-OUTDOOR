import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/posoutdoor_db'
  });
  
  try {
    // Create admins table if not exists
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Admins table ensured");

    // Check if default admin exists
    const [rows] = await conn.execute("SELECT id FROM admins WHERE username = 'admin'");
    if (rows.length === 0) {
      console.log("Seeding default admin...");
      const id = uuidv4();
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      await conn.execute(
        "INSERT INTO admins (id, username, password_hash, name, created_at) VALUES (?, ?, ?, ?, NOW())",
        [id, 'admin', passwordHash, 'Super Admin']
      );
      console.log("Default admin seeded successfully.");
    } else {
      console.log("Admin user already exists. Skipping seed.");
    }

  } catch(e) {
    console.error("Migration failed:", e.message);
  }

  console.log('Admin Migration Done');
  process.exit(0);
}
run();
