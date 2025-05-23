// components/ValidationErrors.tsx
import React from 'react'

import { Alert, Typography, Box } from '@mui/material'
import { useTranslations } from 'next-intl'

import type { ValidationError } from '@/types/bulkUpload'

interface ValidationErrorsProps {
  errors: ValidationError[]
  onClose?: () => void
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors, onClose }) => {
  const t = useTranslations()

  if (!errors || errors.length === 0) {
    return null
  }

  // Group errors by type for better display
  const headerErrors = errors.filter(e => e.message?.includes('header') || e.message?.includes('template'))
  const dataErrors = errors.filter(e => e.row && e.column)

  const generalErrors = errors.filter(
    e => !e.message?.includes('header') && !e.message?.includes('template') && !(e.row && e.column)
  )

  return (
    <Box className='mb-4 space-y-3'>
      {headerErrors.length > 0 && (
        <Alert
          severity='error'
          onClose={onClose}
          sx={{
            backgroundColor: '#ffeeee',
            color: '#d32f2f',
            border: '1px solid #ffcdd2',
            marginBottom: 2
          }}
        >
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            {t('Template Format Issues')}:
          </Typography>
          {headerErrors.map((error, index) => (
            <Typography key={index} variant='body2'>
              • {error.message}
            </Typography>
          ))}
          <Typography variant='body2' fontStyle='italic' sx={{ marginTop: 1 }}>
            {t("Please download the template again and ensure you're using the correct format.")}
          </Typography>
        </Alert>
      )}

      {dataErrors.length > 0 && (
        <Alert
          severity='warning'
          sx={{
            backgroundColor: '#fffde7',
            color: '#f57c00',
            border: '1px solid #ffe082',
            marginBottom: 2
          }}
        >
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            {t('Data Validation Issues')} ({dataErrors.length}):
          </Typography>
          {dataErrors.slice(0, 5).map((error, index) => (
            <Typography key={index} variant='body2'>
              • {t('Row')} {error.row}, {error.column}: {error.message}
            </Typography>
          ))}
          {dataErrors.length > 5 && (
            <Typography variant='body2' fontStyle='italic'>
              {t('and')} {dataErrors.length - 5} {t('more errors...')}
            </Typography>
          )}
        </Alert>
      )}

      {generalErrors.length > 0 && (
        <Alert
          severity='info'
          sx={{
            border: '1px solid #bbdefb',
            marginBottom: 2
          }}
        >
          {generalErrors.map((error, index) => (
            <Typography key={index} variant='body2'>
              {error.message}
            </Typography>
          ))}
        </Alert>
      )}
    </Box>
  )
}

export default ValidationErrors
