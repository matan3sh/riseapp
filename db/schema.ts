import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  plaidId: text('plaid_id'),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
})

export const accountsRelations = relations(accounts, ({ many }) => ({
  trancactions: many(trancactions),
}))

export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  plaidId: text('plaid_id'),
  name: text('name').notNull(),
  userId: text('user_id').notNull(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  trancactions: many(trancactions),
}))

export const insertCategorySchema = createInsertSchema(categories)

export const trancactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes'),
  date: timestamp('date').notNull(),
  accountId: text('account_id')
    .references(() => accounts.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
})

export const transactionsRelations = relations(trancactions, ({ one }) => ({
  account: one(accounts, {
    fields: [trancactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [trancactions.categoryId],
    references: [categories.id],
  }),
}))

export const insertTransactionSchema = createInsertSchema(trancactions, {
  date: z.coerce.date(),
})
