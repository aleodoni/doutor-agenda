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
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AddDoctorButton } from './_components/add-doctor-button'

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
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage
