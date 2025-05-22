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

  return (
    <Box className='mb-4'>
      <Alert
        severity='warning'
        onClose={onClose}
        sx={{
          backgroundColor: '#ffffcc',
          color: '#000000',
          border: '1px solid #e0e0e0',
          '& .MuiAlert-icon': { color: '#ff9800' }
        }}
      >
        {errors.map((error, index) => (
          <Typography key={index} variant='body1'>
            {error.message}
          </Typography>
        ))}
      </Alert>
    </Box>
  )
}

export default ValidationErrors
