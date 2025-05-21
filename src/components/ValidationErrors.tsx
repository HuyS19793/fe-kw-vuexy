// components/ValidationErrors.tsx
import React from 'react'

import { Alert, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useTranslations } from 'next-intl'

import type { ValidationError } from '@/types/bulkUpload'

interface ValidationErrorsProps {
  errors: ValidationError[]
  onClose?: () => void
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors, onClose }) => {
  const t = useTranslations()

  if (!errors || errors.length === 0) return null

  return (
    <Alert severity='error' onClose={onClose} className='mb-4'>
      <Typography variant='subtitle2' className='font-medium mb-2'>
        {t('correctFollowingErrors')}
      </Typography>

      <List dense disablePadding className='ml-2'>
        {errors.map((error, index) => (
          <ListItem key={index} disableGutters className='py-0.5'>
            <ListItemIcon className='min-w-8'>
              <i className='tabler-alert-circle text-red-500' />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant='body2'>
                  {error.row && error.column
                    ? t('rowColumnError', {
                        row: error.row,
                        column: error.column,
                        message: error.message
                      })
                    : error.message}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Alert>
  )
}

export default ValidationErrors
