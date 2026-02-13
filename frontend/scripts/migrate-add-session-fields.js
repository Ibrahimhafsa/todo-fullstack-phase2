#!/usr/bin/env node
/**
 * Add missing fields to session table
 */
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function migrate() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Adding missing session table fields...\n');

    // Add ipAddress
    console.log('1. Adding ip_address column...');
    try {
      await sql`
        ALTER TABLE "session"
        ADD COLUMN IF NOT EXISTS ip_address TEXT
      `;
      console.log('   ✅ ip_address column added');
    } catch (e) {
      console.log('   ℹ️  ' + e.message.substring(0, 50));
    }

    // Add userAgent
    console.log('2. Adding user_agent column...');
    try {
      await sql`
        ALTER TABLE "session"
        ADD COLUMN IF NOT EXISTS user_agent TEXT
      `;
      console.log('   ✅ user_agent column added');
    } catch (e) {
      console.log('   ℹ️  ' + e.message.substring(0, 50));
    }

    console.log('\n✅ Session table migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
