#!/usr/bin/env node
/**
 * Check what fields Better Auth expects vs what exists in the database
 */

const postgres = require('postgres');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

async function checkSchema() {
  const sql = postgres(databaseUrl);

  try {
    console.log('📊 Checking database schema...\n');

    // Get all columns for each table
    const tables = ['user', 'session', 'account', 'verification'];

    for (const table of tables) {
      console.log(`\n🔍 Table: "${table}"`);
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${table}
        ORDER BY ordinal_position
      `;

      if (columns.length === 0) {
        console.log(`   ❌ Table does not exist!`);
      } else {
        columns.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)';
          const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`   • ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
        });
      }
    }

    console.log('\n\n📝 What Better Auth expects (with Drizzle adapter, provider: "pg"):');
    console.log(`
User table fields:
  • id (TEXT, PRIMARY KEY)
  • email (TEXT, UNIQUE)
  • emailVerified (BOOLEAN) OR email_verified (BOOLEAN with snake_case)
  • name (TEXT)
  • image (TEXT)
  • createdAt (TIMESTAMP) OR created_at (with snake_case)
  • updatedAt (TIMESTAMP) OR updated_at (with snake_case)

Session table fields:
  • id (TEXT, PRIMARY KEY)
  • userId (TEXT) OR user_id (with snake_case) - Foreign key to user(id)
  • expiresAt (TIMESTAMP) OR expires_at (with snake_case)
  • token (TEXT, UNIQUE)
  • createdAt (TIMESTAMP) OR created_at (with snake_case)
  • updatedAt (TIMESTAMP) OR updated_at (with snake_case)

Account table fields:
  • id (TEXT, PRIMARY KEY)
  • userId (TEXT) OR user_id (with snake_case) - Foreign key to user(id)
  • accountId (TEXT) OR account_id (with snake_case)
  • provider (TEXT)
  • providerAccountId (TEXT) OR provider_account_id (with snake_case)
  • refreshToken (TEXT) OR refresh_token (with snake_case)
  • accessToken (TEXT) OR access_token (with snake_case)
  • accessTokenExpiresAt (TIMESTAMP) OR access_token_expires_at (with snake_case)
  • tokenType (TEXT) OR token_type (with snake_case)
  • scope (TEXT)
  • idToken (TEXT) OR id_token (with snake_case)
  • sessionState (TEXT) OR session_state (with snake_case)
  • createdAt (TIMESTAMP) OR created_at (with snake_case)
  • updatedAt (TIMESTAMP) OR updated_at (with snake_case)

Verification table fields:
  • id (TEXT, PRIMARY KEY)
  • identifier (TEXT)
  • value (TEXT)
  • expiresAt (TIMESTAMP) OR expires_at (with snake_case)
  • createdAt (TIMESTAMP) OR created_at (with snake_case)
  • updatedAt (TIMESTAMP) OR updated_at (with snake_case)
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

checkSchema();
