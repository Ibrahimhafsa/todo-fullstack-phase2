#!/usr/bin/env node
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function main() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Checking account table...\n');

    // Get account records
    const accounts = await sql`
      SELECT * FROM "account"
      ORDER BY created_at DESC
      LIMIT 5
    `;

    console.log(`Found ${accounts.length} account record(s):\n`);
    accounts.forEach((acc, i) => {
      console.log(`Account ${i + 1}:`);
      Object.entries(acc).forEach(([key, val]) => {
        if (val !== null) {
          const displayVal = val.toString().substring(0, 150);
          console.log(`  ${key}: ${displayVal}`);
        }
      });
      console.log('');
    });

    // Also check all tables for any password-related data
    console.log('\n---\nSearching all tables for password-related data...\n');
    const allTables = ['user', 'account', 'session', 'verification'];

    for (const table of allTables) {
      const cols = await sql.unsafe(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = '${table}'
        AND (column_name ILIKE '%password%' OR column_name ILIKE '%credential%' OR column_name ILIKE '%hash%')
      `);
      if (cols.length > 0) {
        console.log(`${table}: ${cols.map(c => c.column_name).join(', ')}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
