// components/FileUploader.tsx
import React, { useState, useCallback, useEffect } from 'react'

import { Box, Typography, Button, CircularProgress, Alert, Paper, Fade } from '@mui/material'
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
  onFileSelected?: (file: File | null) => void
  hideUploadButton?: boolean
}

interface FileInfo {
  file: File
  name: string
  size: number
  preview?: string
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
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileSelected,
  hideUploadButton = false
}) => {
  const t = useTranslations()
  const [file, setFile] = useState<FileInfo | null>(null)
  const [dropzoneError, setDropzoneError] = useState<string | null>(null)

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
    }
  }, [file])

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
        const preview = URL.createObjectURL(selectedFile)

        const fileInfo = {
          file: selectedFile,
          name: selectedFile.name,
          size: selectedFile.size,
          preview
        }

        setFile(fileInfo)

        // Notify parent component about selected file
        if (onFileSelected) {
          onFileSelected(selectedFile)
        }
      }
    },
    [t, onFileSelected]
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

    if (file?.preview) {
      URL.revokeObjectURL(file.preview)
    }

    setFile(null)
    setDropzoneError(null)

    // Notify parent component about file removal
    if (onFileSelected) {
      onFileSelected(null)
    }
  }

  // Format file size nicely
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'

    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // Determine file icon based on extension
  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''

    if (['csv'].includes(extension)) return 'tabler-file-spreadsheet'
    if (['xls', 'xlsx'].includes(extension)) return 'tabler-file-spreadsheet'

    return 'tabler-file'
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
        elevation={0}
        className={`p-6 border-2 border-dashed rounded-md cursor-pointer flex flex-col items-center justify-center min-h-[150px] transition-all duration-200 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 shadow-md'
            : file
              ? 'border-green-300 bg-green-50/30'
              : 'border-gray-300 hover:border-primary-300'
        }`}
      >
        <input {...getInputProps()} />

        {file ? (
          <Fade in={!!file}>
            <Box className='flex flex-col items-center space-y-3 w-full'>
              <Box className='flex items-center w-full justify-between border-b pb-2'>
                <div className='flex items-center'>
                  <i className={`${getFileIcon(file.name)} text-3xl text-primary-500 mr-2`} />
                  <div>
                    <Typography variant='body1' className='font-medium text-primary-700'>
                      {file.name}
                    </Typography>
                    <Typography variant='caption' color='textSecondary'>
                      {formatFileSize(file.size)}
                    </Typography>
                  </div>
                </div>
                <Button
                  variant='text'
                  color='error'
                  size='small'
                  className='ml-2'
                  onClick={handleRemove}
                  startIcon={<i className='tabler-trash' />}
                >
                  {t('Remove')}
                </Button>
              </Box>

              <Typography variant='body2' className='text-center text-gray-500 italic'>
                {t('clickToReplaceFile')}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Box className='flex flex-col items-center text-center transition-opacity duration-200'>
            <i className='tabler-upload text-3xl text-gray-400 mb-2' />
            <Typography variant='body1' className='mb-1 font-medium'>
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

      {!hideUploadButton && (
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
      )}
    </Box>
  )
}

export default FileUploader
