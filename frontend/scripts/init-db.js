#!/usr/bin/env node
/**
 * Initialize Better Auth database tables in PostgreSQL
 * Run with: node scripts/init-db.js
 *
 * This creates the required Better Auth tables without needing TypeScript/tsx
 */

const postgres = require('postgres');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔄 Initializing Better Auth database tables...');
console.log(`📍 Database: ${databaseUrl.split('@')[1]?.split(':')[0] || 'unknown'}`);

async function initializeDatabase() {
  let sql;
  try {
    sql = postgres(databaseUrl);

    // Create user table
    await sql`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        email_verified BOOLEAN DEFAULT false,
        name TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Created "user" table');

    // Create session table
    await sql`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ Created "session" table');

    // Create account table
    await sql`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        account_id TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        access_token_expires_at TIMESTAMP,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
        UNIQUE(provider, provider_account_id)
      )
    `;
    console.log('✅ Created "account" table');

    // Create verification table
    await sql`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Created "verification" table');

    // Verify tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name
    `;

    console.log('\n📊 Verification - Tables in database:');
    tables.forEach(row => console.log(`   • ${row.table_name}`));

    console.log('\n✨ Database initialization completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Try signing up: http://localhost:3000/signup');
    console.log('3. Check DevTools → Application → Cookies for "better-auth.session-token"');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (error.message.includes('already exists')) {
      console.log('✅ Tables already exist, no action needed.');
      process.exit(0);
    }
    process.exit(1);
  } finally {
    if (sql) await sql.end();
  }
}

initializeDatabase();
