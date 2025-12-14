import { pgTable, serial, varchar, text, integer, uniqueIndex } from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 20 }).notNull(),
    passwordHash: varchar('password_hash', { length: 60 }).notNull(),
    plan: varchar('plan', { length: 10 }).notNull().default('free'),
    customerId: varchar('customer_id', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull()
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
    .references(() => users.id, { onDelete: 'cascade' })
})
