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
  availableFromTimeMonday: time('available_from_time_monday'),
  availableToTimeMonday: time('available_to_time_monday'),
  availableFromTimeTuesday: time('available_from_time_tuesday'),
  availableToTimeTuesday: time('available_to_time_tuesday'),
  availableFromTimeWednesday: time('available_from_time_wednesday'),
  availableToTimeWednesday: time('available_to_time_wednesday'),
  availableFromTimeThursday: time('available_from_time_thursday'),
  availableToTimeThursday: time('available_to_time_thursday'),
  availableFromTimeFriday: time('available_from_time_friday'),
  availableToTimeFriday: time('available_to_time_friday'),
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
