import {
  pgTable,
  boolean,
  serial,
  varchar,
  text,
  integer,
  uniqueIndex,
  timestamp
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 20 }).notNull(),
    passwordHash: varchar('password_hash', { length: 60 }).notNull(),
    plan: varchar('plan', { length: 10 }).notNull().default('free'),
    customerId: varchar('customer_id', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdateFn(() => sql`now()`)
  },
  (t) => ({
    usersUsernameKey: uniqueIndex('users_username_key').on(t.username),
    usersEmailKey: uniqueIndex('users_email_key').on(t.email),
    usersCustomerIdKey: uniqueIndex('users_customer_id_key').on(t.customerId)
  })
)

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 50 }).notNull(),
  url: text('url').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  platform: varchar('platform', { length: 50 }).notNull().default('custom'),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdateFn(() => sql`now()`)
})
