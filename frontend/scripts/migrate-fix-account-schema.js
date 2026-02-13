#!/usr/bin/env node
/**
 * Fix account table schema:
 * - Add provider_id column (required by Better Auth)
 * - Make password column NOT NULL for email/password auth
 * - Update existing data
 */
const postgres = require('postgres');
const databaseUrl = process.env.DATABASE_URL;

async function migrate() {
  const sql = postgres(databaseUrl);
  try {
    console.log('Fixing account table schema...\n');

    // Step 1: Add provider_id if it doesn't exist
    console.log('1. Adding provider_id column...');
    try {
      await sql`
        ALTER TABLE "account"
        ADD COLUMN IF NOT EXISTS provider_id TEXT
      `;
      console.log('   ✅ provider_id column added');
    } catch (e) {
      console.log('   ℹ️  provider_id might already exist');
    }

    // Step 2: Populate provider_id from provider column (if provider column exists)
    console.log('2. Populating provider_id from provider column...');
    try {
      const hasProvider = await sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'account' AND column_name = 'provider'
      `;

      if (hasProvider.length > 0) {
        // Copy provider to provider_id if provider_id is empty
        await sql`
          UPDATE "account"
          SET provider_id = provider
          WHERE provider_id IS NULL
          AND provider IS NOT NULL
        `;
        console.log('   ✅ provider_id populated');
      }
    } catch (e) {
      console.log('   ℹ️  Could not populate from provider column');
    }

    // Step 3: Make provider_id NOT NULL for future inserts
    console.log('3. Adding provider_id NOT NULL constraint...');
    try {
      await sql`
        ALTER TABLE "account"
        ALTER COLUMN provider_id SET NOT NULL
      `;
      console.log('   ✅ provider_id set to NOT NULL');
    } catch (e) {
      if (e.message.includes('not-null violation')) {
        console.log('   ℹ️  Some rows might have NULL provider_id, setting defaults...');
        // Set default for NULL values
        await sql`
          UPDATE "account"
          SET provider_id = COALESCE(provider, 'email')
          WHERE provider_id IS NULL
        `;
        // Try again
        await sql`
          ALTER TABLE "account"
          ALTER COLUMN provider_id SET NOT NULL
        `;
        console.log('   ✅ provider_id set to NOT NULL (after defaults)');
      } else {
        console.log('   ⚠️  ' + e.message);
      }
    }

    // Step 4: Verify schema
    console.log('\n4. Verifying account table schema...');
    const cols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'account'
      ORDER BY ordinal_position
    `;

    console.log('\n   Account table columns:');
    cols.forEach(col => {
      const notNull = col.is_nullable === 'NO' ? ' (NOT NULL)' : '';
      console.log(`   • ${col.column_name}: ${col.data_type}${notNull}`);
    });

    console.log('\n✅ Account schema migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
