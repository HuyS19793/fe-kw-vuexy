// components/tabs/KwFilteringTab.tsx
import React, { useState } from 'react'

import { Typography, Button, Box, Alert, Paper, useTheme, useMediaQuery } from '@mui/material'
import { useTranslations } from 'next-intl'

import FileUploader from '../FileUploader'
import FilePreview from '../FilePreview'
import ValidationErrors from '../ValidationErrors'
import type { UploadStatus, ValidationError, UploadTabType } from '@/types/bulkUpload'

interface KwFilteringTabProps {
  accountId: string
  accountName: string
  onUploadSuccess: (tabType: UploadTabType) => void
  onFileSelected?: (file: File | null) => void
  hideUploadButton?: boolean
}

const KwFilteringTab: React.FC<KwFilteringTabProps> = ({
  accountId,
  accountName,
  onUploadSuccess,
  onFileSelected,
  hideUploadButton = false
}) => {
  const t = useTranslations()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    loading: false,
    error: null,
    success: false
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDownloadTemplate = async (): Promise<void> => {
    // Implementation remains the same
  }

  const handleFileUpload = async (file: File): Promise<void> => {
    // Only show upload success message if not hiding upload button
    if (hideUploadButton) return

    setUploadStatus({ loading: true, error: null, success: false })

    try {
      // Simulate API call and validation
      // For demo, let's simulate a validation error
      const simulateValidation = Math.random() > 0.7

      if (simulateValidation) {
        // Simulate validation errors
        const errors: ValidationError[] = [
          { row: 3, column: '精査条件', message: t('invalidInspectionCondition') },
          { row: 5, column: '休日実行', message: t('invalidHolidayExecution') },
          { message: t('someFieldsAreMissing') } // General error without row/column
        ]

        setTimeout(() => {
          setUploadStatus({
            loading: false,
            error: errors,
            success: false
          })
        }, 1500)

        return
      }

      // Simulate success
      setTimeout(() => {
        setUploadStatus({
          loading: false,
          error: null,
          success: true
        })

        // Call the success callback
        onUploadSuccess('KW Filtering')
      }, 1500)
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadStatus({
        loading: false,
        error: [{ message: t('unexpectedUploadError') }],
        success: false
      })
    }
  }

  // Handle local file selection
  const handleFileSelection = (file: File | null) => {
    setSelectedFile(file)

    // Pass to parent component if callback exists
    if (onFileSelected) {
      onFileSelected(file)
    }
  }

  return (
    <Box className='space-y-4' sx={{ height: '100%', overflowY: 'auto' }}>
      <Typography variant='body1' className='mb-4'>
        {t('kwFilteringDescription')}
      </Typography>

      {uploadStatus.error && (
        <ValidationErrors
          errors={uploadStatus.error}
          onClose={() => setUploadStatus(prev => ({ ...prev, error: null }))}
        />
      )}

      {/* Layout changes: Use grid for larger screens */}
      <Box
        sx={{
          display: isSmallScreen ? 'block' : 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3
        }}
      >
        <Paper elevation={0} variant='outlined' className='p-4 border border-gray-200'>
          <Box className='flex flex-col space-y-4'>
            <Typography variant='subtitle2' className='font-medium flex items-center'>
              <i className='tabler-download mr-2 text-primary-500' />
              {t('downloadTemplate')}
            </Typography>

            <Typography variant='body2' className='text-gray-600'>
              {t('templateDescriptionCampaign')}
            </Typography>

            <Button
              variant='outlined'
              color='primary'
              startIcon={<i className='tabler-download' />}
              onClick={handleDownloadTemplate}
              className='self-start'
            >
              {t('downloadTemplate')}
            </Button>
          </Box>
        </Paper>

        {isSmallScreen && <div className='my-4'></div>}

        <Paper elevation={0} variant='outlined' className='p-4 border border-gray-200'>
          <Box className='flex flex-col space-y-4'>
            <Typography variant='subtitle2' className='font-medium flex items-center'>
              <i className='tabler-upload mr-2 text-primary-500' />
              {t('uploadUpdatedTemplate')}
            </Typography>

            <Typography variant='body2' className='text-gray-600'>
              {t('uploadDescription')}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* File uploader in full width section */}
      <Paper elevation={0} variant='outlined' className='p-4 border border-gray-200'>
        <FileUploader
          onFileUpload={handleFileUpload}
          loading={uploadStatus.loading}
          accept={{
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
          }}
          onFileSelected={handleFileSelection}
          hideUploadButton={hideUploadButton}
        />

        {uploadStatus.success && (
          <Alert severity='success' className='mt-3'>
            {t('settingsUpdateSuccess')}
          </Alert>
        )}
      </Paper>

      {/* File Preview in full width */}
      <FilePreview file={selectedFile} templateType='kw-filtering' previewRowCount={5} />
    </Box>
  )
}

export default KwFilteringTab
