/**
 * seed.js — Run this once to create/reset the default admin account.
 *
 * Usage:
 *   node seed.js
 *
 * This is useful if you already ran schema.sql but the admin login fails,
 * or if you want to reset the admin password.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db     = require('./config/db');

async function seed() {
  const adminEmail    = 'admin@velocityrail.com';
  const adminPassword = 'admin123';
  const adminName     = 'Rail Admin';

  console.log('🌱 Seeding admin account...');

  try {
    const hash = await bcrypt.hash(adminPassword, 10);

    // Upsert: if email exists update password & role, otherwise insert
    await db.execute(
      `INSERT INTO USERS (name, email, password, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'admin'`,
      [adminName, adminEmail, hash]
    );

    console.log('✅ Admin account ready.');
    console.log('   Email   :', adminEmail);
    console.log('   Password: admin123');
    console.log('\n⚠️  Change the password after your first login!\n');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
