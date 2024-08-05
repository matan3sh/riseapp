import { db } from '@/db/drizzle'
import { accounts, categories, trancactions } from '@/db/schema'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { zValidator } from '@hono/zod-validator'
import { parse, subDays } from 'date-fns'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono().get(
  '/',
  zValidator(
    'query',
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c)
    const { from, to, accountId } = c.req.valid('query')

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const defaultTo = new Date()
    const defaultFrom = subDays(defaultTo, 30)

    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo

    const data = await db
      .select({
        id: trancactions.id,
        category: categories.name,
        categoryId: trancactions.categoryId,
        payee: trancactions.payee,
        amount: trancactions.amount,
        notes: trancactions.notes,
        account: accounts.name,
        accountId: trancactions.accountId,
      })
      .from(trancactions)
      .innerJoin(accounts, eq(trancactions.accountId, accounts.id))
      .leftJoin(categories, eq(trancactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(trancactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(trancactions.date, startDate),
          lte(trancactions.date, endDate)
        )
      )
      .orderBy(desc(trancactions.date))

    return c.json({ data })
  }
)

// .get(
//   '/:id',
//   zValidator('param', z.object({ id: z.string().optional() })),
//   clerkMiddleware(),
//   async (c) => {
//     const auth = getAuth(c)
//     const { id } = c.req.valid('param')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     if (!auth?.userId) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const [data] = await db
//       .select({ id: categories.id, name: categories.name })
//       .from(categories)
//       .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))

//     if (!data) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     return c.json({ data })
//   }
// )

// .post(
//   '/',
//   clerkMiddleware(),
//   zValidator(
//     'json',
//     insertCategorySchema.pick({
//       name: true,
//     })
//   ),
//   async (c) => {
//     const auth = getAuth(c)
//     const values = c.req.valid('json')

//     if (!auth?.userId) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const [data] = await db
//       .insert(categories)
//       .values({
//         id: createId(),
//         userId: auth.userId,
//         ...values,
//       })
//       .returning()

//     return c.json({ data })
//   }
// )

// .post(
//   '/bulk-delete',
//   clerkMiddleware(),
//   zValidator('json', z.object({ ids: z.array(z.string()) })),
//   async (c) => {
//     const auth = getAuth(c)
//     const values = c.req.valid('json')

//     if (!auth?.userId) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const data = await db
//       .delete(categories)
//       .where(
//         and(
//           eq(categories.userId, auth.userId),
//           inArray(categories.id, values.ids)
//         )
//       )
//       .returning({
//         id: categories.id,
//       })

//     return c.json({ data })
//   }
// )

// .patch(
//   '/:id',
//   clerkMiddleware(),
//   zValidator('param', z.object({ id: z.string().optional() })),
//   zValidator('json', insertCategorySchema.pick({ name: true })),
//   async (c) => {
//     const auth = getAuth(c)
//     const { id } = c.req.valid('param')
//     const values = c.req.valid('json')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     if (!auth?.userId) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const [data] = await db
//       .update(categories)
//       .set(values)
//       .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
//       .returning()

//     if (!data) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     return c.json({ data })
//   }
// )

// .delete(
//   '/:id',
//   clerkMiddleware(),
//   zValidator('param', z.object({ id: z.string().optional() })),
//   async (c) => {
//     const auth = getAuth(c)
//     const { id } = c.req.valid('param')

//     if (!id) {
//       return c.json({ error: 'Missing id' }, 400)
//     }

//     if (!auth?.userId) {
//       return c.json({ error: 'Unauthorized' }, 401)
//     }

//     const [data] = await db
//       .delete(categories)
//       .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
//       .returning({ id: categories.id })

//     if (!data) {
//       return c.json({ error: 'Not found' }, 404)
//     }

//     return c.json({ data })
//   }
// )

export default app
