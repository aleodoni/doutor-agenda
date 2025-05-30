'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { UpsertDoctorForm } from './upsert-doctor-form'

type AddDoctorButtonProps = {
  // children: React.ReactNode
  specialities: {
    name: string
    id: string
  }[]
}

export const AddDoctorButton = (props: AddDoctorButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm specialities={props.specialities} />
    </Dialog>
  )
}
