#!/usr/bin/env node
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function main() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Checking user record details...\n');

    // Get all columns from user table
    const users = await sql`SELECT * FROM "user" ORDER BY created_at DESC LIMIT 1`;

    if (users.length === 0) {
      console.log('No users found');
    } else {
      const u = users[0];
      console.log('Latest User Record:');
      Object.entries(u).forEach(([key, val]) => {
        const displayVal = val === null ? 'NULL' : val.toString().substring(0, 100);
        console.log(`  ${key}: ${displayVal}`);
      });
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
