import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import ClinicForm from './components/form'

const ClinicFormPage = () => {
  return (
    <Dialog defaultOpen>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Adicionar uma nova clínica</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para adicionar uma nova clínica.
          </DialogDescription>
        </DialogHeader>
        <ClinicForm />
      </DialogContent>
    </Dialog>
  )
}

export default ClinicFormPage
