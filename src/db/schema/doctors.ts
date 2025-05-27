import { createId } from '@paralleldrive/cuid2'
import { integer, pgTable, text, time, timestamp } from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm'
import { clinicsTable } from './clinics'
import { specialitiesTable } from './specialities'

export const doctorsTable = pgTable('doctors', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  avatarImageUrl: text('avatar_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
  availableTimeMonday: time('available_time_monday').notNull(),
  availableTimeTuesday: time('available_time_tuesday').notNull(),
  availableTimeWednesday: time('available_time_wednesday').notNull(),
  availableTimeThursday: time('available_time_thursday').notNull(),
  availableTimeFriday: time('available_time_friday').notNull(),
  appointmentPriceInCents: integer('appointment_price_in_cents').notNull(),
  specialityId: text('speciality_id')
    .notNull()
    .references(() => specialitiesTable.id),
  clinicId: text('clinic_id')
    .notNull()
    .references(() => clinicsTable.id, { onDelete: 'cascade' }),
})

export const doctorsTableRelations = relations(doctorsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }),
  speciality: one(specialitiesTable, {
    fields: [doctorsTable.specialityId],
    references: [specialitiesTable.id],
  }),
}))
