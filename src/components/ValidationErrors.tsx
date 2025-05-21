// components/ValidationErrors.tsx
import React from 'react'

import { Alert, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Chip } from '@mui/material'
import { useTranslations } from 'next-intl'

import type { ValidationError } from '@/types/bulkUpload'

interface ValidationErrorsProps {
  errors: ValidationError[]
  onClose?: () => void
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors, onClose }) => {
  const t = useTranslations()

  if (!errors || errors.length === 0) return null

  // Group errors by type (row/column errors vs general errors)
  const rowErrors = errors.filter(err => err.row !== undefined && err.column !== undefined)
  const generalErrors = errors.filter(err => err.row === undefined || err.column === undefined)

  return (
    <Alert severity='error' onClose={onClose} className='mb-4' variant='outlined'>
      <Typography variant='subtitle1' className='font-medium mb-2'>
        {t('correctFollowingErrors')}
        {errors.length > 1 && (
          <Chip size='small' color='error' label={t('errorCount', { count: errors.length })} className='ml-2' />
        )}
      </Typography>

      {generalErrors.length > 0 && (
        <Box className='mb-2'>
          <List dense disablePadding className='ml-2'>
            {generalErrors.map((error, index) => (
              <ListItem key={`general-${index}`} disableGutters className='py-0.5'>
                <ListItemIcon className='min-w-8'>
                  <i className='tabler-alert-circle text-red-500' />
                </ListItemIcon>
                <ListItemText primary={<Typography variant='body2'>{error.message}</Typography>} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {generalErrors.length > 0 && rowErrors.length > 0 && <Divider className='my-2' />}

      {rowErrors.length > 0 && (
        <Box>
          <Typography variant='subtitle2' className='font-medium mb-1'>
            {t('rowColumnErrors')}:
          </Typography>
          <List dense disablePadding className='ml-2'>
            {rowErrors.map((error, index) => (
              <ListItem key={`row-${index}`} disableGutters className='py-0.5'>
                <ListItemIcon className='min-w-8'>
                  <i className='tabler-table-off text-red-500' />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant='body2'>
                      {t('rowColumnError', {
                        row: error.row,
                        column: error.column,
                        message: error.message
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Alert>
  )
}

export default ValidationErrors
