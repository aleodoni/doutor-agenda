import type { doctorsTable, specialitiesTable } from '@/db/schema'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { InferSelectModel } from 'drizzle-orm'

dayjs.extend(utc)

export const getAvailability = (
  doctor: InferSelectModel<typeof doctorsTable> & {
    speciality: InferSelectModel<typeof specialitiesTable>
  }
) => {
  return {
    monday: {
      from: formatTimeToLocal(doctor.availableFromTimeMonday),
      to: formatTimeToLocal(doctor.availableToTimeMonday),
    },
    tuesday: {
      from: formatTimeToLocal(doctor.availableFromTimeTuesday),
      to: formatTimeToLocal(doctor.availableToTimeTuesday),
    },
    wednesday: {
      from: formatTimeToLocal(doctor.availableFromTimeWednesday),
      to: formatTimeToLocal(doctor.availableToTimeWednesday),
    },
    thursday: {
      from: formatTimeToLocal(doctor.availableFromTimeThursday),
      to: formatTimeToLocal(doctor.availableToTimeThursday),
    },
    friday: {
      from: formatTimeToLocal(doctor.availableFromTimeFriday),
      to: formatTimeToLocal(doctor.availableToTimeFriday),
    },
  }
}

const formatTimeToLocal = (timeString: string | null) => {
  if (!timeString) return null
  try {
    return dayjs()
      .utc()
      .set('hour', Number.parseInt(timeString.split(':')[0]))
      .set('minute', Number.parseInt(timeString.split(':')[1]))
      .set('second', Number.parseInt(timeString.split(':')[2]))
      .local()
  } catch (error) {
    return dayjs().set('hour', 0).set('minute', 0).set('second', 0).local()
  }
}
