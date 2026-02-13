#!/usr/bin/env node
/**
 * Make provider column nullable since Better Auth uses provider_id instead
 */
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function migrate() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Making provider column nullable...\n');

    // Drop the NOT NULL constraint on provider
    await sql`
      ALTER TABLE "account"
      ALTER COLUMN provider DROP NOT NULL
    `;

    console.log('✅ provider column is now nullable');

    // Also make account_id nullable since Better Auth might not use it
    try {
      await sql`
        ALTER TABLE "account"
        ALTER COLUMN account_id DROP NOT NULL
      `;
      console.log('✅ account_id column is now nullable');
    } catch (e) {
      console.log('ℹ️  account_id constraints: ' + e.message.substring(0, 50));
    }

    // Make provider_account_id nullable for email/password auth
    try {
      await sql`
        ALTER TABLE "account"
        ALTER COLUMN provider_account_id DROP NOT NULL
      `;
      console.log('✅ provider_account_id column is now nullable');
    } catch (e) {
      console.log('ℹ️  provider_account_id info: ' + e.message.substring(0, 50));
    }

    console.log('\n✅ Account schema update completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
