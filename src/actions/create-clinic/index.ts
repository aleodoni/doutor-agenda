'use server'

import { db } from '@/db'
import { clinicsTable, usersToClinicsTable } from '@/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const createClinic = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('User not authenticated')
  }

  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name,
    })
    .returning()

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  })

  redirect('/dashboard')
}
