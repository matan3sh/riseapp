import { createId } from '@paralleldrive/cuid2'
import { db } from '../db/drizzle'
import { accounts, categories, transactions } from '../db/schema'

const DEMO_USER_ID = 'user_2g3q2YVFPuSX68W4RDDGx4d2ozb' // Example Clerk user ID

async function seed() {
  console.log('🌱 Starting seeding...')

  // Clear existing data
  await db.delete(transactions)
  await db.delete(categories)
  await db.delete(accounts)

  console.log('🧹 Cleared existing data')

  // Seed accounts
  const accountsData = [
    { id: createId(), name: 'Main Checking', userId: DEMO_USER_ID },
    { id: createId(), name: 'Savings Account', userId: DEMO_USER_ID },
    { id: createId(), name: 'Credit Card', userId: DEMO_USER_ID },
  ]

  const insertedAccounts = await db
    .insert(accounts)
    .values(accountsData)
    .returning()
  console.log('💳 Created accounts:', insertedAccounts.length)

  // Seed categories
  const categoriesData = [
    { id: createId(), name: 'Groceries', userId: DEMO_USER_ID },
    { id: createId(), name: 'Rent', userId: DEMO_USER_ID },
    { id: createId(), name: 'Utilities', userId: DEMO_USER_ID },
    { id: createId(), name: 'Entertainment', userId: DEMO_USER_ID },
    { id: createId(), name: 'Transportation', userId: DEMO_USER_ID },
    { id: createId(), name: 'Shopping', userId: DEMO_USER_ID },
    { id: createId(), name: 'Healthcare', userId: DEMO_USER_ID },
    { id: createId(), name: 'Income', userId: DEMO_USER_ID },
  ]

  const insertedCategories = await db
    .insert(categories)
    .values(categoriesData)
    .returning()
  console.log('🏷️ Created categories:', insertedCategories.length)

  // Generate some sample transactions
  const transactionsData = [
    {
      id: createId(),
      amount: 5000, // $50.00
      payee: 'Walmart',
      date: new Date('2024-03-15'),
      accountId: insertedAccounts[0].id,
      categoryId: insertedCategories[0].id, // Groceries
      notes: 'Weekly grocery shopping',
    },
    {
      id: createId(),
      amount: 150000, // $1,500.00
      payee: 'Landlord',
      date: new Date('2024-03-01'),
      accountId: insertedAccounts[0].id,
      categoryId: insertedCategories[1].id, // Rent
      notes: 'Monthly rent',
    },
    {
      id: createId(),
      amount: 12000, // $120.00
      payee: 'Electric Company',
      date: new Date('2024-03-05'),
      accountId: insertedAccounts[0].id,
      categoryId: insertedCategories[2].id, // Utilities
      notes: 'Monthly electricity bill',
    },
    {
      id: createId(),
      amount: 500000, // $5,000.00
      payee: 'Employer',
      date: new Date('2024-03-01'),
      accountId: insertedAccounts[1].id,
      categoryId: insertedCategories[7].id, // Income
      notes: 'Monthly salary',
    },
    {
      id: createId(),
      amount: 7500, // $75.00
      payee: 'Amazon',
      date: new Date('2024-03-10'),
      accountId: insertedAccounts[2].id,
      categoryId: insertedCategories[5].id, // Shopping
      notes: 'Online shopping',
    },
  ]

  const insertedTransactions = await db
    .insert(transactions)
    .values(transactionsData)
    .returning()
  console.log('💸 Created transactions:', insertedTransactions.length)

  console.log('✅ Seeding completed!')
  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error)
  process.exit(1)
})
