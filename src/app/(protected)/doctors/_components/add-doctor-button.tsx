'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import React from 'react'
import { UpsertDoctorForm } from './upsert-doctor-form'

type AddDoctorButtonProps = {
  // children: React.ReactNode
  specialities: {
    name: string
    id: string
  }[]
}

export const AddDoctorButton = (props: AddDoctorButtonProps) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Adicionar médico
        </Button>
      </DialogTrigger>
      <UpsertDoctorForm
        specialities={props.specialities}
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  )
}
