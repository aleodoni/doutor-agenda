import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignoutButton } from './_components/signout-button'

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/authentication')
  }

  if (!session.user.clinic) {
    redirect('/clinic-form')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      <SignoutButton />
    </div>
  )
}

export default DashboardPage
