// components/FileUploader.tsx
import React, { useState, useCallback } from 'react'

import { Box, Typography, Button, CircularProgress, Alert, Paper } from '@mui/material'
import type { DropzoneOptions, FileRejection, Accept } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'

import type { ValidationError } from '@/types/bulkUpload'

interface FileUploaderProps {
  onFileUpload: (file: File) => Promise<void>
  loading: boolean
  error?: ValidationError[] | null
  accept?: Accept
  maxSize?: number
}

interface FileInfo {
  file: File
  name: string
  size: number
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  loading,
  error,
  accept = {
    'text/csv': ['.csv'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
  },
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const t = useTranslations()
  const [file, setFile] = useState<FileInfo | null>(null)
  const [dropzoneError, setDropzoneError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]

        if (rejection.errors[0].code === 'file-too-large') {
          setDropzoneError(t('fileTooLarge'))
        } else if (rejection.errors[0].code === 'file-invalid-type') {
          setDropzoneError(t('invalidFileType'))
        } else {
          setDropzoneError(t('fileUploadError', { error: rejection.errors[0].message }))
        }

        return
      }

      setDropzoneError(null)

      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0]

        setFile({
          file: selectedFile,
          name: selectedFile.name,
          size: selectedFile.size
        })
      }
    },
    [t]
  )

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
    multiple: false
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions)

  const handleUpload = (): void => {
    if (file && onFileUpload) {
      onFileUpload(file.file)
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    setFile(null)
    setDropzoneError(null)
  }

  return (
    <Box className='space-y-3'>
      {dropzoneError && (
        <Alert severity='error' onClose={() => setDropzoneError(null)}>
          {dropzoneError}
        </Alert>
      )}

      <Paper
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center min-h-[150px] ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-300'
        }`}
      >
        <input {...getInputProps()} />

        {file ? (
          <Box className='flex flex-col items-center space-y-2'>
            <Box className='flex items-center'>
              <i className='tabler-file text-3xl text-primary-500 mr-2' />
              <Typography variant='body1' className='font-medium'>
                {file.name}
              </Typography>
              <Button variant='text' color='error' size='small' className='ml-2' onClick={handleRemove}>
                <i className='tabler-x' />
              </Button>
            </Box>
            <Typography variant='body2' color='textSecondary'>
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        ) : (
          <Box className='flex flex-col items-center text-center'>
            <i className='tabler-upload text-3xl text-gray-400 mb-2' />
            <Typography variant='body1' className='mb-1'>
              {isDragActive ? t('dropFileHere') : t('dragDropFile')}
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              {t('supportedFormats')}: CSV, Excel (.xlsx, .xls)
            </Typography>
            <Typography variant='caption' color='textSecondary' className='mt-1'>
              {t('maximumFileSize')}: 5MB
            </Typography>
          </Box>
        )}
      </Paper>

      <Box className='flex justify-end'>
        <Button
          variant='contained'
          color='primary'
          onClick={handleUpload}
          disabled={!file || loading}
          className='min-w-[120px]'
        >
          {loading ? (
            <CircularProgress size={24} color='inherit' />
          ) : (
            <>
              <i className='tabler-upload mr-2' />
              {t('uploadButton')}
            </>
          )}
        </Button>
      </Box>
    </Box>
  )
}

export default FileUploader
