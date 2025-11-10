import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './userModel';

export const userSessions = pgTable('user_sessions', {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    sessionToken: text('session_token').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});