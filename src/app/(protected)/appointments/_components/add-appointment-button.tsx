'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import type {
  doctorsTable,
  patientsTable,
  specialitiesTable,
} from '@/db/schema'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import AddAppointmentForm, {} from './add-appointment-form'

type AddAppointmentButtonProps = {
  doctors: (typeof doctorsTable.$inferSelect & {
    speciality: { id: string; name: string }
  })[]
  patients: (typeof patientsTable.$inferSelect)[]
}

const AddAppointmentButton = ({
  patients,
  doctors,
}: AddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <AddAppointmentForm
        isOpen={isOpen}
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  )
}

export default AddAppointmentButton
