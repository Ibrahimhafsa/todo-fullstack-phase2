#!/usr/bin/env node
/**
 * Add password column to account table for email/password authentication
 */
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function migrate() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Adding password column to account table...');

    await sql`
      ALTER TABLE "account"
      ADD COLUMN IF NOT EXISTS password TEXT
    `;

    console.log('✅ Password column added (or already exists)');

    // Verify the column exists
    const cols = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'account' AND column_name = 'password'
    `;

    if (cols.length > 0) {
      console.log('✅ Verified: password column exists in account table');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
