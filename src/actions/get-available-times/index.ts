'use server'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { eq, is } from 'drizzle-orm'
import { headers } from 'next/headers'
import { z } from 'zod'

import { db } from '@/db'
import { appointmentsTable, doctorsTable } from '@/db/schema'
import { generateTimeSlots } from '@/helpers/time'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/next-safe-action'
import { format, isBefore, parse } from 'date-fns'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getAvailableTimes = actionClient
  .schema(
    z.object({
      doctorId: z.string(),
      date: z.string().date(), // YYYY-MM-DD,
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      throw new Error('Unauthorized')
    }
    if (!session.user.clinic) {
      throw new Error('Clínica não encontrada')
    }

    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.doctorId),
    })

    if (!doctor) {
      throw new Error('Médico não encontrado')
    }

    const selectedDayOfWeek = dayjs(parsedInput.date).day()

    let doctorIsAvailableFrom = null
    let doctorIsAvailableTo = null

    switch (selectedDayOfWeek) {
      case 1:
        doctorIsAvailableFrom = doctor.availableFromTimeMonday
        doctorIsAvailableTo = doctor.availableToTimeMonday
        break
      case 2:
        doctorIsAvailableFrom = doctor.availableFromTimeTuesday
        doctorIsAvailableTo = doctor.availableToTimeTuesday
        break
      case 3:
        doctorIsAvailableFrom = doctor.availableFromTimeWednesday
        doctorIsAvailableTo = doctor.availableToTimeWednesday
        break
      case 4:
        doctorIsAvailableFrom = doctor.availableFromTimeThursday
        doctorIsAvailableTo = doctor.availableToTimeThursday
        break
      case 5:
        doctorIsAvailableFrom = doctor.availableFromTimeFriday
        doctorIsAvailableTo = doctor.availableToTimeFriday
        break
      default:
        doctorIsAvailableFrom = null
        doctorIsAvailableTo = null
        break
    }

    if (doctorIsAvailableFrom === null || doctorIsAvailableTo === null) {
      return []
    }

    const appointments = await db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
    })

    const appointmentsOnSelectedDate = appointments
      .filter(appointment => {
        return dayjs(appointment.date).isSame(parsedInput.date, 'day')
      })
      .map(appointment => dayjs(appointment.date).format('HH:mm:ss'))

    const timeSlots = generateTimeSlots(selectedDayOfWeek, doctor)

    const doctorAvailableFrom = dayjs()
      .utc()
      .set('hour', Number(doctorIsAvailableFrom.split(':')[0]))
      .set('minute', Number(doctorIsAvailableFrom.split(':')[1]))
      .set('second', 0)
      .local()
    const doctorAvailableTo = dayjs()
      .utc()
      .set('hour', Number(doctorIsAvailableTo.split(':')[0]))
      .set('minute', Number(doctorIsAvailableTo.split(':')[1]))
      .set('second', 0)
      .local()

    const doctorTimeSlots = timeSlots.filter(time => {
      const date = dayjs()
        .utc()
        .set('hour', Number(time.split(':')[0]))
        .set('minute', Number(time.split(':')[1]))
        .set('second', 0)
        .local()

      return true
    })

    return doctorTimeSlots.map(time => {
      return {
        value: time,
        available:
          !appointmentsOnSelectedDate.includes(time) &&
          !isTimeBefore(parsedInput.date, time),
        label: time.substring(0, 5),
      }
    })
  })

function isTimeBefore(date: string, time: string): boolean {
  const baseDate = format(new Date(), 'yyyy-MM-dd HH:mm')

  const date1 = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm:ss', new Date())
  const date2 = parse(`${baseDate}`, 'yyyy-MM-dd HH:mm', new Date())

  return isBefore(date1, date2)
}
