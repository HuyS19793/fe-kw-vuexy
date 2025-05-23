// src/components/tabs/KwFilteringTab.tsx
import React, { useState, useEffect } from 'react'

import { Typography, Button, Box, Alert, Paper, Divider } from '@mui/material'
import { useTranslations } from 'next-intl'

import FileUploader from '../FileUploader'
import FilePreview from '../FilePreview'
import ValidationErrors from '../ValidationErrors'
import { useBulkUpload } from '@/hooks/useBulkUpload'
import type { UploadTabType, ValidationError } from '@/types/bulkUpload'

interface KwFilteringTabProps {
  accountId: string
  accountName: string
  onUploadSuccess: (tabType: UploadTabType) => void
  onFileSelected?: (file: File | null) => void
  onValidationErrors?: (errors: ValidationError[] | null) => void
  hideUploadButton?: boolean
  registerResetFunction?: (resetFn: () => void) => void
}

const KwFilteringTab: React.FC<KwFilteringTabProps> = ({
  accountId,
  accountName,
  onUploadSuccess,
  onFileSelected,
  onValidationErrors,
  hideUploadButton = false,
  registerResetFunction
}) => {
  const t = useTranslations()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Use the enhanced hook
  const {
    isLoading,
    isUploading,
    errors,
    previewData,
    previewFile,
    uploadFile,
    downloadTemplate,
    resetErrors,
    resetAll
  } = useBulkUpload({
    onSuccess: () => {
      onUploadSuccess('KW Filtering')
    },
    onError: errors => {
      console.error('Upload errors:', errors)
    }
  })

  // Report validation errors to parent component
  useEffect(() => {
    if (onValidationErrors) {
      onValidationErrors(errors)
    }
  }, [errors, onValidationErrors])

  const handleDownloadTemplate = async (): Promise<void> => {
    await downloadTemplate({
      accountId,
      templateType: 'kw-filtering'
    })
  }

  // Handle file selection
  const handleFileSelection = (file: File | null) => {
    setSelectedFile(file)

    if (file) {
      // Generate preview when file is selected
      previewFile(file, 'kw-filtering')
    } else {
      // Reset all states when file is removed
      resetAll()
    }

    // Pass to parent component if callback exists
    if (onFileSelected) {
      onFileSelected(file)
    }
  }

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<void> => {
    if (!file) return

    await uploadFile(file, 'kw-filtering')
  }

  useEffect(() => {
    if (registerResetFunction) {
      registerResetFunction(resetAll)
    }
  }, [registerResetFunction, resetAll])

  return (
    <Box className='space-y-4'>
      <Typography variant='body1' className='mb-4'>
        {t('kwFilteringDescription')}
      </Typography>

      {errors && errors.length > 0 && <ValidationErrors errors={errors} onClose={resetErrors} />}

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
            disabled={isLoading}
          >
            {isLoading ? t('downloadingTemplate') : t('downloadTemplate')}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} variant='outlined' className='p-4 border border-gray-200'>
        <Box className='flex flex-col space-y-4'>
          <Typography variant='subtitle2' className='font-medium flex items-center'>
            <i className='tabler-upload mr-2 text-primary-500' />
            {t('uploadUpdatedTemplate')}
          </Typography>

          <Typography variant='body2' className='text-gray-600'>
            {t('uploadDescription')}
          </Typography>

          <Divider className='my-2' />

          <FileUploader
            onFileUpload={handleFileUpload}
            loading={isUploading}
            accept={{
              'text/csv': ['.csv'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
            }}
            onFileSelected={handleFileSelection}
            hideUploadButton={hideUploadButton}
          />

          {/* File Preview Component with actual parsed data */}
          <FilePreview file={selectedFile} templateType='kw-filtering' previewRowCount={5} previewData={previewData} />

          {isUploading && (
            <Alert severity='info' className='mt-3'>
              {t('Uploading')}...
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default KwFilteringTab
