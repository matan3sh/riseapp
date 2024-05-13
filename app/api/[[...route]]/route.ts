import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app
  .get('/hello', (c) => {
    return c.json({
      message: 'Hello Next.js!',
    })
  })
  .get(
    '/hello/:test',
    zValidator(
      'param',
      z.object({
        test: z.string(),
      })
    ),
    (c) => {
      const { test } = c.req.valid('param')
      return c.json({
        message: `Hello Next.js! ${test}`,
      })
    }
  )

export const GET = handle(app)
export const POST = handle(app)
