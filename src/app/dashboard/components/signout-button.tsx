'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export const SignoutButton = () => {
  const router = useRouter()

  function signOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/authentication')
        },
      },
    })
  }

  return <Button onClick={() => signOut()}>Sair</Button>
}
