// components/BulkUploadButton.tsx
import React from 'react'

import { Button, Tooltip } from '@mui/material'
import { useTranslations } from 'next-intl'

interface BulkUploadButtonProps {
  onClick: () => void
  disabled?: boolean
}

const BulkUploadButton: React.FC<BulkUploadButtonProps> = ({ onClick, disabled = false }) => {
  const t = useTranslations()

  return (
    <Tooltip title={t('bulkSettingsUpload')}>
      <span>
        {' '}
        {/* Wrapper required for disabled tooltips */}
        <Button
          variant='contained'
          color='primary'
          startIcon={<i className='tabler-upload' />}
          onClick={onClick}
          disabled={disabled}
          className='ml-2'
        >
          {t('bulkSettingsUpload')}
        </Button>
      </span>
    </Tooltip>
  )
}

export default BulkUploadButton
