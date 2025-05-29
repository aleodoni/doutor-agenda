import { z } from 'zod'

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3333),

  // Database
  DATABASE_URL: z.string(),

  // Auth
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
