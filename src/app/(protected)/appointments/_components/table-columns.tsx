'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import type { appointmentsTable } from '@/db/schema'

import AppointmentsTableActions from './table-actions'

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string
    name: string
    email: string
    phoneNumber: string
    sex: 'male' | 'female'
  }
  doctor: {
    id: string
    name: string
    speciality: {
      id: string
      name: string
    }
  }
}

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: 'patient',
    accessorKey: 'patient.name',
    header: 'Paciente',
  },
  {
    id: 'doctor',
    accessorKey: 'doctor.name',
    header: 'Médico',
    cell: params => {
      const appointment = params.row.original
      return `${appointment.doctor.name}`
    },
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: 'Data e Hora',
    cell: params => {
      const appointment = params.row.original
      return format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    },
  },
  {
    id: 'speciality',
    accessorKey: 'doctor.speciality.name',
    header: 'Especialidade',
  },
  {
    id: 'price',
    accessorKey: 'appointmentPriceInCents',
    header: 'Valor',
    cell: params => {
      const appointment = params.row.original
      const price = appointment.appointmentPriceInCents / 100
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price)
    },
  },
  {
    id: 'actions',
    cell: params => {
      const appointment = params.row.original
      return <AppointmentsTableActions appointment={appointment} />
    },
  },
]
