import { upsertDoctor } from '@/actions/upsert-doctors'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { doctorsTable } from '@/db/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Nome é obrigatorio' }),
    speciality: z
      .string()
      .trim()
      .min(1, { message: 'Especialidade é obrigatoria' }),
    appointmentPrice: z
      .number()
      .min(1, { message: 'Preco de consulta é obrigatorio' }),
    availableFromTimeMonday: z.string().trim(),
    availableToTimeMonday: z.string().trim(),
    availableFromTimeTuesday: z.string().trim(),
    availableToTimeTuesday: z.string().trim(),
    availableFromTimeWednesday: z.string().trim(),
    availableToTimeWednesday: z.string().trim(),
    availableFromTimeThursday: z.string().trim(),
    availableToTimeThursday: z.string().trim(),
    availableFromTimeFriday: z.string().trim(),
    availableToTimeFriday: z.string().trim(),
  })
  .refine(
    data => {
      if (
        (data.availableFromTimeMonday.length === 0 &&
          data.availableToTimeMonday.length === 0) ||
        data.availableFromTimeMonday < data.availableToTimeMonday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeMonday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeTuesday.length === 0 &&
          data.availableToTimeTuesday.length === 0) ||
        data.availableFromTimeTuesday < data.availableToTimeTuesday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeTuesday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeWednesday.length === 0 &&
          data.availableToTimeWednesday.length === 0) ||
        data.availableFromTimeWednesday < data.availableToTimeWednesday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeWednesday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeThursday.length === 0 &&
          data.availableToTimeThursday.length === 0) ||
        data.availableFromTimeThursday < data.availableToTimeThursday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeThursday'],
    }
  )
  .refine(
    data => {
      if (
        (data.availableFromTimeFriday.length === 0 &&
          data.availableToTimeFriday.length === 0) ||
        data.availableFromTimeFriday < data.availableToTimeFriday
      ) {
        return true
      }
    },
    {
      message: 'Hora inicial deve ser menor que a hora final',
      path: ['availableFromTimeFriday'],
    }
  )

type UpsertDoctorFormProps = {
  doctor: typeof doctorsTable.$inferSelect
  specialities: {
    name: string
    id: string
  }[]
  onSuccess?: () => void
}
export const UpsertDoctorForm = ({
  doctor,
  specialities,
  onSuccess,
}: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name ?? '',
      speciality: doctor?.specialityId ?? '',
      appointmentPrice: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      availableFromTimeMonday: doctor?.availableFromTimeMonday ?? '',
      availableToTimeMonday: doctor?.availableToTimeMonday ?? '',
      availableFromTimeTuesday: doctor?.availableFromTimeTuesday ?? '',
      availableToTimeTuesday: doctor?.availableToTimeTuesday ?? '',
      availableFromTimeWednesday: doctor?.availableFromTimeWednesday ?? '',
      availableToTimeWednesday: doctor?.availableToTimeWednesday ?? '',
      availableFromTimeThursday: doctor?.availableFromTimeThursday ?? '',
      availableToTimeThursday: doctor?.availableToTimeThursday ?? '',
      availableFromTimeFriday: doctor?.availableFromTimeFriday ?? '',
      availableToTimeFriday: doctor?.availableToTimeFriday ?? '',
    },
  })

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess() {
      toast.success('Medico cadastrado com sucesso')
      onSuccess?.()
    },
    onError() {
      toast.error('Erro ao cadastrar medico')
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      id: doctor?.id,
      appointmentPriceInCents: values.appointmentPrice * 100,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {doctor ? doctor.name : 'Adicionar um novo medico'}
        </DialogTitle>
        <DialogDescription>
          {doctor
            ? 'Edite as informações do medico.'
            : 'Adicione um novo medico.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='speciality'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidades</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecione uma especialidade...' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialities.map(speciality => (
                      <SelectItem
                        key={speciality.id}
                        value={speciality.id}
                      >{`${speciality.name}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='appointmentPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={value => {
                      field.onChange(value.floatValue)
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    thousandSeparator='.'
                    decimalSeparator=','
                    allowNegative={false}
                    allowLeadingZeros={false}
                    prefix='R$'
                    customInput={Input}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col space-y-2 '>
            <Label>Segunda feira - Horário de atendimento</Label>
            <fieldset className='flex w-full space-x-4 '>
              <FormField
                control={form.control}
                name='availableFromTimeMonday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>das</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue
                            placeholder='Selecione um horário...'
                            defaultValue={'00:00:00'}
                          />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='availableToTimeMonday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>até as</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className='flex flex-col space-y-2 '>
            <Label>Terça feira - Horário de atendimento</Label>
            <fieldset className='flex w-full space-x-4 '>
              <FormField
                control={form.control}
                name='availableFromTimeTuesday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>das</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='availableToTimeTuesday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>até as</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className='flex flex-col space-y-2 '>
            <Label>Quarta feira - Horário de atendimento</Label>
            <fieldset className='flex w-full space-x-4 '>
              <FormField
                control={form.control}
                name='availableFromTimeWednesday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>das</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='availableToTimeWednesday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>até as</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className='flex flex-col space-y-2 '>
            <Label>Quinta feira - Horário de atendimento</Label>
            <fieldset className='flex w-full space-x-4 '>
              <FormField
                control={form.control}
                name='availableFromTimeThursday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>das</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='availableToTimeThursday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>até as</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className='flex flex-col space-y-2 '>
            <Label>Sexta feira - Horário de atendimento</Label>
            <fieldset className='flex w-full space-x-4 '>
              <FormField
                control={form.control}
                name='availableFromTimeFriday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>das</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='availableToTimeFriday'
                render={({ field }) => (
                  <FormItem className='flex flex-col w-1/2 '>
                    <FormLabel>até as</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione um horário...' />
                          <SelectTimeDoctor />
                        </SelectTrigger>
                      </FormControl>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <DialogFooter>
            <Button type='submit' disabled={upsertDoctorAction.isPending}>
              {upsertDoctorAction.isPending
                ? 'Salvando...'
                : doctor
                  ? 'Salvar'
                  : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

export const SelectTimeDoctor = () => {
  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Manhã</SelectLabel>
        <SelectItem value='08:00:00'>08:00</SelectItem>
        <SelectItem value='08:30:00'>08:30</SelectItem>
        <SelectItem value='09:00:00'>09:00</SelectItem>
        <SelectItem value='09:30:00'>09:30</SelectItem>
        <SelectItem value='10:00:00'>10:00</SelectItem>
        <SelectItem value='10:30:00'>10:30</SelectItem>
        <SelectItem value='11:00:00'>11:00</SelectItem>
        <SelectItem value='11:30:00'>11:30</SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Tarde</SelectLabel>
        <SelectItem value='13:00:00'>13:00</SelectItem>
        <SelectItem value='13:30:00'>13:30</SelectItem>
        <SelectItem value='14:00:00'>14:00</SelectItem>
        <SelectItem value='14:30:00'>14:30</SelectItem>
        <SelectItem value='15:00:00'>15:00</SelectItem>
        <SelectItem value='15:30:00'>15:30</SelectItem>
        <SelectItem value='16:00:00'>16:00</SelectItem>
        <SelectItem value='16:30:00'>16:30</SelectItem>
        <SelectItem value='17:00:00'>17:00</SelectItem>
        <SelectItem value='17:30:00'>17:30</SelectItem>
      </SelectGroup>
      <SelectGroup>
        <SelectLabel>Noite</SelectLabel>
        <SelectItem value='18:00:00'>18:00</SelectItem>
        <SelectItem value='18:30:00'>18:30</SelectItem>
        <SelectItem value='19:00:00'>19:00</SelectItem>
        <SelectItem value='19:30:00'>19:30</SelectItem>
        <SelectItem value='20:00:00'>20:00</SelectItem>
        <SelectItem value='20:30:00'>20:30</SelectItem>
        <SelectItem value='21:00:00'>21:00</SelectItem>
        <SelectItem value='21:30:00'>21:30</SelectItem>
        <SelectItem value='22:00:00'>22:00</SelectItem>
      </SelectGroup>
    </SelectContent>
  )
}
