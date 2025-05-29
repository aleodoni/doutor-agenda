import { db } from '@/db'

import * as schema from '@/db/schema'
import { env } from '@/env'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    modelName: 'usersTable',
  },
  session: {
    modelName: 'sessionsTable',
  },
  account: {
    modelName: 'accountsTable',
  },
  verification: {
    modelName: 'verificationsTable',
  },
  emailAndPassword: {
    enabled: true,
  },
})
