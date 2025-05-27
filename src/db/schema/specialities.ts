import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { doctorsTable } from './doctors'

export const specialitiesTable = pgTable('specialities', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const specialitiesTableRelations = relations(
  specialitiesTable,
  ({ many }) => ({
    doctors: many(doctorsTable),
  })
)
