// hooks/useBulkUpload.ts
import { useState } from 'react'

import type { ValidationError, FileUploadResponse, TemplateDownloadParams } from '@/types/bulkUpload'

interface UseBulkUploadOptions {
  onSuccess?: (message?: string) => void
  onError?: (errors?: ValidationError[]) => void
}

interface UseBulkUploadReturn {
  isUploading: boolean
  errors: ValidationError[] | null
  downloadTemplate: (params: TemplateDownloadParams) => Promise<void>
  uploadFile: (file: File, templateType: 'kw-filtering' | 'genre-keyword') => Promise<void>
  resetErrors: () => void
}

export const useBulkUpload = (options?: UseBulkUploadOptions): UseBulkUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [errors, setErrors] = useState<ValidationError[] | null>(null)

  const resetErrors = (): void => {
    setErrors(null)
  }

  const downloadTemplate = async (params: TemplateDownloadParams): Promise<void> => {
    const { accountId, templateType } = params

    try {
      const response = await fetch(`/api/template/${templateType}?accountId=${accountId}`, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error('Failed to download template')
      }

      // Handle the file download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      // Get the filename from the Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `template_${templateType}_${accountId}.xlsx`

      if (contentDisposition) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)

        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }

      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading template:', error)
      setErrors([{ message: 'Failed to download template. Please try again.' }])
      options?.onError?.([{ message: 'Failed to download template. Please try again.' }])
    }
  }

  const uploadFile = async (file: File, templateType: 'kw-filtering' | 'genre-keyword'): Promise<void> => {
    setIsUploading(true)
    setErrors(null)

    try {
      const formData = new FormData()

      formData.append('file', file)

      const response = await fetch(`/api/upload/${templateType}`, {
        method: 'POST',
        body: formData
      })

      const data: FileUploadResponse = await response.json()

      if (!data.success) {
        setErrors(data.errors || [{ message: data.message || 'Upload failed' }])
        options?.onError?.(data.errors)

        return
      }

      options?.onSuccess?.(data.message)
    } catch (error) {
      console.error('Error uploading file:', error)
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'

      setErrors([{ message }])
      options?.onError?.([{ message }])
    } finally {
      setIsUploading(false)
    }
  }

  return {
    isUploading,
    errors,
    downloadTemplate,
    uploadFile,
    resetErrors
  }
}
