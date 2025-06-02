import { spec } from 'node:test/reporters'
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'
import { db } from '@/db'
import { doctorsTable } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AddDoctorButton } from './_components/add-doctor-button'
import { DoctorCard } from './_components/doctor-card'

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/authentication')
  }

  if (!session.user?.clinic) {
    redirect('/clinic-form')
  }

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session.user.clinic.id),
    with: {
      speciality: true,
    },
  })

  const specialities = await db.query.specialitiesTable.findMany({
    columns: { id: true, name: true },
    orderBy(fields, operators) {
      return operators.asc(fields.name)
    },
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>
            Gerencie os seus médicos de sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton specialities={specialities} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <div className='grid grid-cols-3 gap-6'>
          {doctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              specialities={specialities}
            />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage
