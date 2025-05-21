import { Button } from '@mui/material'
import { useTranslations } from 'next-intl'

const TableActionComponent = ({
  isDataChanged,
  onReset,
  onSubmit
}: {
  isDataChanged: boolean
  onReset?: () => void
  onSubmit?: () => void
}) => {
  const t = useTranslations()

  return (
    <div className='flex gap-4'>
      {onReset && (
        <Button
          variant='tonal'
          color='secondary'
          startIcon={<i className='tabler-restore' />}
          onClick={onReset}
          disabled={!isDataChanged}
        >
          {t('Reset')}
        </Button>
      )}
      {onSubmit && (
        <Button
          variant='contained'
          startIcon={<i className='tabler-send' />}
          disabled={!isDataChanged}
          onClick={onSubmit}
        >
          {t('Submit')}
        </Button>
      )}
    </div>
  )
}

export default TableActionComponent
