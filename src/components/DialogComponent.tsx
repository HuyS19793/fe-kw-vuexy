import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useTranslations } from 'next-intl'

import DialogCloseButton from './dialogs/DialogCloseButton'

type DialogComponentProps = {
  open: boolean
  onClose: () => void
  id?: string
  title?: string
  Body: React.ReactNode
  Actions?: React.ReactNode
  ExtraActions?: React.ReactNode
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

const DialogComponent = ({ open, onClose, id, title = '', Body, Actions, ExtraActions }: DialogComponentProps) => {
  // *** HOOKS ***
  const t = useTranslations()

  return (
    <>
      <Dialog
        open={open}
        maxWidth='xl'
        scroll='body'
        onClose={onClose}
        aria-labelledby={id || slugify(title)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        {title && <DialogTitle id={id}>{title}</DialogTitle>}
        <DialogContent
          className='flex flex-col gap-6 pbs-0'
          sx={{
            overflowY: 'auto' // Thêm thanh cuộn dọc nếu cần
          }}
        >
          <DialogCloseButton onClick={onClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          {Body}
        </DialogContent>

        <DialogActions className='dialog-actions-dense mt-2 flex justify-between'>
          <div>{ExtraActions}</div>

          <div className='flex justify-between gap-x-4'>
            <div>
              <Button color='secondary' variant='tonal' onClick={onClose}>
                {t('Close')}
              </Button>
            </div>
            {Actions}
          </div>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogComponent
