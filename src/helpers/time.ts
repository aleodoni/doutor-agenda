import type { doctorsTable } from '@/db/schema'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export const generateTimeSlots = (
  weekDay: number,
  doctor: typeof doctorsTable.$inferSelect
) => {
  const slots: string[] = []

  let doctorDayOfWeekFromTime: string | null = null
  let doctorDayOfWeekToTime: string | null = null

  // Mapeia o dia da semana para os horários disponíveis do médico
  switch (weekDay) {
    case 1:
      doctorDayOfWeekFromTime = doctor.availableFromTimeMonday
      doctorDayOfWeekToTime = doctor.availableToTimeMonday
      break
    case 2:
      doctorDayOfWeekFromTime = doctor.availableFromTimeTuesday
      doctorDayOfWeekToTime = doctor.availableToTimeTuesday
      break
    case 3:
      doctorDayOfWeekFromTime = doctor.availableFromTimeWednesday
      doctorDayOfWeekToTime = doctor.availableToTimeWednesday
      break
    case 4:
      doctorDayOfWeekFromTime = doctor.availableFromTimeThursday
      doctorDayOfWeekToTime = doctor.availableToTimeThursday
      break
    case 5:
      doctorDayOfWeekFromTime = doctor.availableFromTimeFriday
      doctorDayOfWeekToTime = doctor.availableToTimeFriday
      break
    default:
      return []
  }

  // Verifica se há horários disponíveis
  if (!doctorDayOfWeekFromTime || !doctorDayOfWeekToTime) {
    return []
  }

  // Parseia os horários com Day.js em UTC
  const fromTime = dayjs
    .utc(`1970-01-01 ${doctorDayOfWeekFromTime}`, 'YYYY-MM-DD HH:mm')
    .local()
  const toTime = dayjs
    .utc(`1970-01-01 ${doctorDayOfWeekToTime}`, 'YYYY-MM-DD HH:mm')
    .local()

  // Valida se os horários são válidos e se fromTime é anterior a toTime
  if (!fromTime.isValid() || !toTime.isValid() || fromTime.isAfter(toTime)) {
    return []
  }

  // Gera slots de 30 em 30 minutos
  let currentTime = fromTime
  while (currentTime.isBefore(toTime) || currentTime.isSame(toTime)) {
    slots.push(currentTime.format('HH:mm:ss'))
    currentTime = currentTime.add(30, 'minute')
  }

  return slots
}
