/**
 * Better Auth Drizzle Schema Definitions
 * These table definitions tell the Drizzle adapter how to interact with the database
 */

import { pgTable, text, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// User table
export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false),
    name: text("name"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("user_email_idx").on(table.email)]
);

// Session table
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"), // ✅ REQUIRED by Better Auth
    userAgent: text("user_agent"), // Optional, but helpful for security
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("session_token_idx").on(table.token)]
);

// Account table (for linked providers/OAuth and email+password)
export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    providerId: text("provider_id").notNull(), // ✅ REQUIRED by Better Auth
    providerAccountId: text("provider_account_id").notNull(), // ✅ REQUIRED
    accountId: text("account_id"), // Optional, for backward compat
    password: text("password"), // ✅ REQUIRED for email/password auth
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("account_provider_idx").on(
      table.providerId,
      table.providerAccountId
    ),
  ]
);

// Verification token table
export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("verification_identifier_idx").on(table.identifier)]
);

// Export as a schema object for the adapter
export const schema = {
  user,
  session,
  account,
  verification,
};
