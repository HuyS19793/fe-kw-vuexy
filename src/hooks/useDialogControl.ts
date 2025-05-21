// hooks/useDialogControl.ts
import { useState } from 'react'

export function useDialogControl() {
  const [openDialog, setOpenDialog] = useState('')

  // console.log('openDialog', openDialog)

  const toggleDialog = (dialogId: string) => setOpenDialog(current => (current === dialogId ? '' : dialogId))

  const closeDialog = () => setOpenDialog('')
  const openDialogById = (dialogId: string) => setOpenDialog(dialogId)

  return {
    openDialog,
    toggleDialog,
    closeDialog,
    openDialogById,
    isDialogOpen: (dialogId: string) => openDialog === dialogId
  }
}
