'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { doctorsTable, specialitiesTable } from '@/db/schema'
import { formatCurrencyIncents } from '@/helpers/currency'
import type { InferSelectModel } from 'drizzle-orm'
import { CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react'
import React from 'react'
import { getAvailability } from '../_helpers/availability'
import { UpsertDoctorForm } from './upsert-doctor-form'

type DoctorCardProps = {
  doctor: InferSelectModel<typeof doctorsTable> & {
    speciality: InferSelectModel<typeof specialitiesTable>
  }
  specialities: {
    name: string
    id: string
  }[]
}
export const DoctorCard = ({ doctor, specialities }: DoctorCardProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    React.useState(false)
  const doctorInitials = doctor.name
    .split(' ')
    .slice(1, 3)
    .map(word => word[0])
    .join('')

  const availability = getAvailability(doctor)

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Avatar className='w-10 h-10'>
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='text-sm font-medium'>{doctor.name}</h3>
            <p className='text-sm text-muted-foreground'>
              {doctor.speciality.name}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='flex flex-col gap-2'>
        <div className='grid grid-cols-5 gap-2'>
          <Badge variant={'outline'} className='flex w-full'>
            Segunda feira
          </Badge>
          <Badge variant={'outline'} className='flex w-full'>
            Terça feira
          </Badge>
          <Badge variant={'outline'} className='flex w-full'>
            Quarta feira
          </Badge>
          <Badge variant={'outline'} className='flex w-full'>
            Quinta feira
          </Badge>
          <Badge variant={'outline'} className='flex w-full'>
            Sexta feira
          </Badge>
        </div>
        <div className='grid grid-cols-5 gap-2'>
          <Badge variant={'outline'}>
            {availability.monday.from?.format('HH:mm')} -{' '}
            {availability.monday.to?.format('HH:mm')}
          </Badge>
          <Badge variant={'outline'}>
            {availability.tuesday.from?.format('HH:mm')} -{' '}
            {availability.tuesday.to?.format('HH:mm')}
          </Badge>
          <Badge variant={'outline'}>
            {availability.wednesday.from?.format('HH:mm')} -{' '}
            {availability.wednesday.to?.format('HH:mm')}
          </Badge>
          <Badge variant={'outline'}>
            {availability.thursday.from?.format('HH:mm')} -{' '}
            {availability.thursday.to?.format('HH:mm')}
          </Badge>
          <Badge variant={'outline'}>
            {availability.friday.from?.format('HH:mm')} -{' '}
            {availability.friday.to?.format('HH:mm')}
          </Badge>
        </div>
        {/* <div className='flex w-full gap-2'>
          <div className='flex gap-2 w-1/2 justify-start'>
            <Badge variant={'outline'} className='flex flex-1'>
              <CalendarIcon className='mr-1' />
              Segunda feira
            </Badge>
            <Badge variant={'outline'}>
              <ClockIcon className='mr-1' />
              {availability.monday.from?.format('HH:mm')} -{' '}
              {availability.monday.to?.format('HH:mm')}
            </Badge>
          </div>
          <div className='flex gap-2 w-1/2 '>
            <Badge variant={'outline'} className='flex flex-1'>
              <CalendarIcon className='mr-1' />
              Terça feira
            </Badge>
            <Badge variant={'outline'}>
              <ClockIcon className='mr-1' />
              {availability.tuesday.from?.format('HH:mm')} -{' '}
              {availability.tuesday.to?.format('HH:mm')}
            </Badge>
          </div>
        </div>
        <div className='flex w-full gap-2'>
          <div className='flex gap-2 w-1/2'>
            <Badge variant={'outline'} className='flex flex-1'>
              <CalendarIcon className='mr-1' />
              Quarta feira
            </Badge>
            <Badge variant={'outline'}>
              <ClockIcon className='mr-1' />
              {availability.wednesday.from?.format('HH:mm')} -{' '}
              {availability.wednesday.to?.format('HH:mm')}
            </Badge>
          </div>
          <div className='flex gap-2 w-1/2 '>
            <Badge variant={'outline'} className='flex flex-1'>
              <CalendarIcon className='mr-1' />
              Quinta feira
            </Badge>
            <Badge variant={'outline'}>
              <ClockIcon className='mr-1' />
              {availability.thursday.from?.format('HH:mm')} -{' '}
              {availability.thursday.to?.format('HH:mm')}
            </Badge>
          </div>
        </div>
        <div className='flex w-full gap-2'>
          <div className='flex gap-2 w-1/2'>
            <Badge variant={'outline'} className='flex flex-1'>
              <CalendarIcon className='mr-1' />
              Sexta feira
            </Badge>
            <Badge variant={'outline'}>
              <ClockIcon className='mr-1' />
              {availability.friday.from?.format('HH:mm')} -{' '}
              {availability.friday.to?.format('HH:mm')}
            </Badge>
          </div>
          <div className='flex gap-2 w-1/2'>{''}</div>
        </div> */}
        <Badge variant={'outline'}>
          <DollarSignIcon className='mr-1' />
          {formatCurrencyIncents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter>
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className='w-full'>Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            specialities={specialities}
            doctor={{
              ...doctor,
              availableFromTimeMonday:
                availability.monday.from?.format('HH:mm:ss') ?? '',
              availableToTimeMonday:
                availability.monday.to?.format('HH:mm:ss') ?? '',
              availableFromTimeTuesday:
                availability.tuesday.from?.format('HH:mm:ss') ?? '',
              availableToTimeTuesday:
                availability.tuesday.to?.format('HH:mm:ss') ?? '',
              availableFromTimeWednesday:
                availability.wednesday.from?.format('HH:mm:ss') ?? '',
              availableToTimeWednesday:
                availability.wednesday.to?.format('HH:mm:ss') ?? '',
              availableFromTimeThursday:
                availability.thursday.from?.format('HH:mm:ss') ?? '',
              availableToTimeThursday:
                availability.thursday.to?.format('HH:mm:ss') ?? '',
              availableFromTimeFriday:
                availability.friday.from?.format('HH:mm:ss') ?? '',
              availableToTimeFriday:
                availability.friday.to?.format('HH:mm:ss') ?? '',
            }}
            onSuccess={() => {
              setIsUpsertDoctorDialogOpen(false)
            }}
            isOpen={isUpsertDoctorDialogOpen}
          />
        </Dialog>
      </CardFooter>
    </Card>
  )
}
