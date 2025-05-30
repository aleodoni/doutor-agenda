import { Button } from '@/components/ui/button'
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
import { Plus } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

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
          <Button>
            <Plus />
            Adicionar médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage
