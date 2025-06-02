'use server'

import { db } from '@/db'
import { doctorsTable } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/next-safe-action'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { headers } from 'next/headers'
import { upsertDoctorSchema } from './schema'

// export const upsertDoctor = async (data: UpsertDoctorSchema) => {
//   upsertDoctorSchema.parse(data)

//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//   if (!session?.user) {
//     throw new Error('Unauthorized')
//   }

//   const { clinic } = session.user

//   if (!clinic) {
//     throw new Error('Unauthorized')
//   }

//   const { id: clinicId } = clinic

//   await db
//     .insert(doctorsTable)
//     .values({ id: data.id, ...data, clinicId, specialityId: data.speciality })
//     .onConflictDoUpdate({
//       target: [doctorsTable.id],
//       set: { ...data, specialityId: data.speciality },
//     })
// }

dayjs.extend(utc)

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const availableFromTimeMondayUTC = formatTimeToUTC(
      parsedInput.availableFromTimeMonday
    )
    const availableToTimeMondayUTC = formatTimeToUTC(
      parsedInput.availableToTimeMonday
    )

    const availableFromTimeTuesdayUTC = formatTimeToUTC(
      parsedInput.availableFromTimeTuesday
    )
    const availableToTimeTuesdayUTC = formatTimeToUTC(
      parsedInput.availableToTimeTuesday
    )

    const availableFromTimeWednesdayUTC = formatTimeToUTC(
      parsedInput.availableFromTimeWednesday
    )
    const availableToTimeWednesdayUTC = formatTimeToUTC(
      parsedInput.availableToTimeWednesday
    )

    const availableFromTimeThursdayUTC = formatTimeToUTC(
      parsedInput.availableFromTimeThursday
    )
    const availableToTimeThursdayUTC = formatTimeToUTC(
      parsedInput.availableToTimeThursday
    )

    const availableFromTimeFridayUTC = formatTimeToUTC(
      parsedInput.availableFromTimeFriday
    )
    const availableToTimeFridayUTC = formatTimeToUTC(
      parsedInput.availableToTimeFriday
    )

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const { clinic } = session.user

    if (!clinic) {
      throw new Error('Unauthorized')
    }

    const { id: clinicId } = clinic

    await db
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        ...parsedInput,
        clinicId,
        specialityId: parsedInput.speciality,
        availableFromTimeMonday: availableFromTimeMondayUTC.format('HH:mm:ss'),
        availableToTimeMonday: availableToTimeMondayUTC.format('HH:mm:ss'),
        availableFromTimeTuesday:
          availableFromTimeTuesdayUTC.format('HH:mm:ss'),
        availableToTimeTuesday: availableToTimeTuesdayUTC.format('HH:mm:ss'),
        availableFromTimeWednesday:
          availableFromTimeWednesdayUTC.format('HH:mm:ss'),
        availableToTimeWednesday:
          availableToTimeWednesdayUTC.format('HH:mm:ss'),
        availableFromTimeThursday:
          availableFromTimeThursdayUTC.format('HH:mm:ss'),
        availableToTimeThursday: availableToTimeThursdayUTC.format('HH:mm:ss'),
        availableFromTimeFriday: availableFromTimeFridayUTC.format('HH:mm:ss'),
        availableToTimeFriday: availableToTimeFridayUTC.format('HH:mm:ss'),
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          specialityId: parsedInput.speciality,
          availableFromTimeMonday:
            availableFromTimeMondayUTC.format('HH:mm:ss'),
          availableToTimeMonday: availableToTimeMondayUTC.format('HH:mm:ss'),
          availableFromTimeTuesday:
            availableFromTimeTuesdayUTC.format('HH:mm:ss'),
          availableToTimeTuesday: availableToTimeTuesdayUTC.format('HH:mm:ss'),
          availableFromTimeWednesday:
            availableFromTimeWednesdayUTC.format('HH:mm:ss'),
          availableToTimeWednesday:
            availableToTimeWednesdayUTC.format('HH:mm:ss'),
          availableFromTimeThursday:
            availableFromTimeThursdayUTC.format('HH:mm:ss'),
          availableToTimeThursday:
            availableToTimeThursdayUTC.format('HH:mm:ss'),
          availableFromTimeFriday:
            availableFromTimeFridayUTC.format('HH:mm:ss'),
          availableToTimeFriday: availableToTimeFridayUTC.format('HH:mm:ss'),
        },
      })
  })

const formatTimeToUTC = (timeString: string) => {
  try {
    return dayjs()
      .set('hour', Number.parseInt(timeString.split(':')[0]))
      .set('minute', Number.parseInt(timeString.split(':')[1]))
      .set('second', Number.parseInt(timeString.split(':')[2]))
      .utc()
  } catch (error) {
    return dayjs().set('hour', 0).set('minute', 0).set('second', 0).utc()
  }
}
