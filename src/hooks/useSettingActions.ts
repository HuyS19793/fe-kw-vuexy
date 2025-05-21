// hooks/useSettingActions.ts

import { toast } from 'react-toastify'

import { useRouter } from 'nextjs-toploader/app'

import { useTranslations } from 'next-intl'

import { useConfirmDialog } from '@/components/ConfirmDialogComponent'
import { useLoading } from '@/contexts/loadingContext'

export function useSettingActions() {
  const t = useTranslations()
  const router = useRouter()
  const { isPending, startLoadingTransition } = useLoading()
  const { confirmDialog, openConfirmDialog, closeConfirmDialog } = useConfirmDialog()

  const handleApiAction = async (
    action: () => Promise<{ success: boolean }>,
    successMessage: string,
    errorMessage: string,
    successCallback?: () => void,
    errorCallback?: () => void
  ) => {
    try {
      startLoadingTransition(async () => {
        const res = await action()

        if (res.success) {
          router.refresh()
          toast.success(t(successMessage))

          if (successCallback) {
            successCallback()
          }
        } else {
          toast.error(t(errorMessage))

          if (errorCallback) {
            errorCallback()
          }
        }
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error(t('An unexpected error occurred'))
    }
  }

  const confirmAction = (id: string, title: string, content: string, action: () => void) => {
    openConfirmDialog({
      id,
      title: t(title),
      content: t(content),
      callback: () => {
        action()
        closeConfirmDialog()
      }
    })
  }

  return {
    isPending,
    handleApiAction,
    confirmAction,
    confirmDialog,
    closeConfirmDialog
  }
}
