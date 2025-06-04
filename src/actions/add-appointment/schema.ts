import { z } from 'zod'

export const addAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Paciente é obrigatório'),
  doctorId: z.string().min(1, 'Médico é obrigatório'),
  date: z.date({
    required_error: 'Data é obrigatória',
  }),
  time: z.string().min(1, 'Horário é obrigatório'),
  appointmentPriceInCents: z.number().min(1, {
    message: 'Valor da consulta é obrigatório.',
  }),
})

export type AddAppointmentSchema = z.infer<typeof addAppointmentSchema>
