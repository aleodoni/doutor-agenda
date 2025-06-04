import { db } from '@/db'
import { appointmentsTable, doctorsTable, patientsTable } from '@/db/schema'
import { asc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { DataTable } from '@/components/ui/data-table'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import AddAppointmentButton from './_components/add-appointment-button'
import { appointmentsTableColumns } from './_components/table-columns'

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/authentication')
  }
  if (!session.user.clinic) {
    redirect('/clinic-form')
  }

  const [doctors, patients, appointments] = await Promise.all([
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session.user.clinic.id),
      with: {
        speciality: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    }),

    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session.user.clinic.id),
    }),

    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session.user.clinic.id),
      with: {
        patient: true,
        doctor: {
          with: {
            speciality: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: asc(appointmentsTable.date),
    }),
  ])

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton doctors={doctors} patients={patients} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  )
}
