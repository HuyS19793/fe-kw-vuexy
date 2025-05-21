// components/tabs/KwFilteringTab.tsx
import React, { useState } from 'react'

import { Typography, Button, Box, Alert, Paper } from '@mui/material'
import { useTranslations } from 'next-intl'

import FileUploader from '../FileUploader'
import ValidationErrors from '../ValidationErrors'
import type { UploadStatus, ValidationError, UploadTabType } from '@/types/bulkUpload'

interface KwFilteringTabProps {
  accountId: string
  accountName: string
  onUploadSuccess: (tabType: UploadTabType) => void
}

const KwFilteringTab: React.FC<KwFilteringTabProps> = ({ accountId, accountName, onUploadSuccess }) => {
  const t = useTranslations()

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    loading: false,
    error: null,
    success: false
  })

  const handleDownloadTemplate = async (): Promise<void> => {
    try {
      // API call to download template will be implemented later
      console.log('Download template for KW Filtering')

      // Placeholder for actual implementation
      const response = await fetch(`/api/template/kw-filtering?accountId=${accountId}`)

      if (!response.ok) throw new Error('Failed to download template')

      // Handle the file download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `kwseisa_setting_template_${accountName}_${accountId}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading template:', error)

      // Handle error - could set state to show error message
    }
  }

  const handleFileUpload = async (file: File): Promise<void> => {
    setUploadStatus({ loading: true, error: null, success: false })

    try {
      // Will be replaced with actual API call
      // Simulate API call and validation
      // For demo, let's simulate a validation error
      const simulateValidation = Math.random() > 0.7

      if (simulateValidation) {
        // Simulate validation errors
        const errors: ValidationError[] = [
          { row: 3, column: '精査条件', message: t('invalidInspectionCondition') },
          { row: 5, column: '休日実行', message: t('invalidHolidayExecution') }
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

  return (
    <Box className='space-y-4'>
      <Typography variant='body1' className='mb-4'>
        {t('kwFilteringDescription')}
      </Typography>

      {uploadStatus.error && (
        <ValidationErrors
          errors={uploadStatus.error}
          onClose={() => setUploadStatus(prev => ({ ...prev, error: null }))}
        />
      )}

      <Paper elevation={0} variant='outlined' className='p-4 border border-gray-200'>
        <Box className='flex flex-col space-y-4'>
          <Typography variant='subtitle2' className='font-medium'>
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

      <Paper elevation={0} variant='outlined' className='p-4 border border-gray-200'>
        <Box className='flex flex-col space-y-4'>
          <Typography variant='subtitle2' className='font-medium'>
            {t('uploadUpdatedTemplate')}
          </Typography>

          <Typography variant='body2' className='text-gray-600'>
            {t('uploadDescription')}
          </Typography>

          <FileUploader
            onFileUpload={handleFileUpload}
            loading={uploadStatus.loading}
            accept={{
              'text/csv': ['.csv'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
            }}
          />

          {uploadStatus.success && (
            <Alert severity='success' className='mt-3'>
              {t('settingsUpdateSuccess')}
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default KwFilteringTab
