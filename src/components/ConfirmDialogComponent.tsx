import React, { useState } from 'react'

import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

import DialogComponent from './DialogComponent'

export const useConfirmDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: '',
    title: '',
    content: '',
    callback: () => {}
  })

  interface ConfirmDialogData {
    id: string
    title: string
    content: string
    callback: () => void
  }

  const openConfirmDialog = (data: ConfirmDialogData) => {
    const { id, title, content, callback } = data

    setConfirmDialog({
      open: true,
      id,
      title,
      content,
      callback
    })
  }

  const closeConfirmDialog = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false
    })
  }

  return { confirmDialog, openConfirmDialog, closeConfirmDialog }
}

type ConfirmDialogProps = {
  confirmDialog: {
    open: boolean
    id: string
    title: string
    content: string
    callback: () => void
  }
  onClose: () => void
  confirmButtonText?: string
  isLoading?: boolean
}

const ConfirmDialogComponent = ({
  confirmDialog: { open, id, title, content, callback },
  onClose,
  confirmButtonText = 'Agree',
  isLoading = false
}: ConfirmDialogProps) => {
  const t = useTranslations()

  return (
    <>
      <DialogComponent
        open={open}
        id={id}
        title={title}
        Body={content}
        onClose={onClose}
        Actions={
          <>
            <div>
              <Button variant='contained' onClick={callback} disabled={isLoading}>
                {t(isLoading ? 'Saving' : confirmButtonText)}
              </Button>
            </div>
          </>
        }
      />
    </>
  )
}

export default ConfirmDialogComponent
