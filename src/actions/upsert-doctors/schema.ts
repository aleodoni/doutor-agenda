import { z } from 'zod'

export const upsertDoctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().trim().min(1, { message: 'Nome é obrigatorio' }),
    speciality: z
      .string()
      .trim()
      .min(1, { message: 'Especialidade é obrigatoria' }),
    appointmentPriceInCents: z
      .number()
      .min(1, { message: 'Preco de consulta é obrigatorio' }),
    availableFromTimeMonday: z.string().trim(),
    availableToTimeMonday: z.string().trim(),
    availableFromTimeTuesday: z.string().trim(),
    availableToTimeTuesday: z.string().trim(),
    availableFromTimeWednesday: z.string().trim(),
    availableToTimeWednesday: z.string().trim(),
    availableFromTimeThursday: z.string().trim(),
    availableToTimeThursday: z.string().trim(),
    availableFromTimeFriday: z.string().trim(),
    availableToTimeFriday: z.string().trim(),
  })
  .refine(
    data => {
      if (
        (data.availableFromTimeMonday.length === 0 &&
          data.availableToTimeMonday.length === 0) ||
        data.availableFromTimeMonday < data.availableToTimeMonday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeMonday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeTuesday.length === 0 &&
          data.availableToTimeTuesday.length === 0) ||
        data.availableFromTimeTuesday < data.availableToTimeTuesday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeTuesday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeWednesday.length === 0 &&
          data.availableToTimeWednesday.length === 0) ||
        data.availableFromTimeWednesday < data.availableToTimeWednesday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeWednesday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeThursday.length === 0 &&
          data.availableToTimeThursday.length === 0) ||
        data.availableFromTimeThursday < data.availableToTimeThursday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeThursday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeFriday.length === 0 &&
          data.availableToTimeFriday.length === 0) ||
        data.availableFromTimeFriday < data.availableToTimeFriday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeFriday'],
    }
  )

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>
