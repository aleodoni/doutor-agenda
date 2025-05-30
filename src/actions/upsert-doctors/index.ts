'use server'

import { db } from '@/db'
import { doctorsTable } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/next-safe-action'
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

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
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
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: { ...parsedInput, specialityId: parsedInput.speciality },
      })
  })
