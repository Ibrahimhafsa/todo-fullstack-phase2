#!/usr/bin/env node
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function main() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Checking for users...\n');
    const users = await sql`SELECT id, email, name FROM "user" ORDER BY created_at DESC LIMIT 10`;

    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach((u, i) => {
        console.log(`   ${i + 1}. Email: ${u.email}, Name: ${u.name || '(no name)'}`);
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
