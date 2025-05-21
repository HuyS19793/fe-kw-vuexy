// hooks/useBulkUpload.ts
import { useState, useCallback } from 'react'

import { parseCSV, csvToObjectArray, validateKwFilteringData, validateGenreKeywordData } from '@/utils/fileValidator'

import type { ValidationError, FileUploadResponse, TemplateDownloadParams, FilePreviewData } from '@/types/bulkUpload'

interface UseBulkUploadOptions {
  onSuccess?: (message?: string) => void
  onError?: (errors?: ValidationError[]) => void
}

interface UseBulkUploadReturn {
  isUploading: boolean
  errors: ValidationError[] | null
  previewData: FilePreviewData | null
  isLoading: boolean
  downloadTemplate: (params: TemplateDownloadParams) => Promise<void>
  uploadFile: (file: File, templateType: 'kw-filtering' | 'genre-keyword') => Promise<void>
  previewFile: (file: File, templateType: 'kw-filtering' | 'genre-keyword') => Promise<void>
  resetErrors: () => void
}

export const useBulkUpload = (options?: UseBulkUploadOptions): UseBulkUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [previewData, setPreviewData] = useState<FilePreviewData | null>(null)

  const resetErrors = (): void => {
    setErrors(null)
  }

  const downloadTemplate = async (params: TemplateDownloadParams): Promise<void> => {
    const { accountId, templateType } = params

    try {
      setIsLoading(true)

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
    } finally {
      setIsLoading(false)
    }
  }

  const previewFile = useCallback(async (file: File, templateType: 'kw-filtering' | 'genre-keyword'): Promise<void> => {
    setIsLoading(true)
    setErrors(null)
    setPreviewData(null)

    try {
      // Read file content
      const fileContent = await readFileAsText(file)

      // Parse CSV
      const csvData = parseCSV(fileContent)

      // Extract headers
      const headers = csvData[0]

      // Convert to object array for validation
      const data = csvToObjectArray(csvData, headers)

      // Validate data based on template type
      const validationResult =
        templateType === 'kw-filtering' ? validateKwFilteringData(data) : validateGenreKeywordData(data)

      // Set errors if any
      if (!validationResult.isValid) {
        setErrors(validationResult.errors)
      }

      // Set preview data
      setPreviewData({
        headers,
        rows: csvData.slice(1, 6), // First 5 rows
        totalRows: csvData.length - 1 // Exclude header row
      })
    } catch (error) {
      console.error('Error previewing file:', error)
      setErrors([{ message: 'Error previewing file. Please check the file format.' }])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadFile = async (file: File, templateType: 'kw-filtering' | 'genre-keyword'): Promise<void> => {
    setIsUploading(true)
    setErrors(null)

    try {
      // Read and validate the file first
      const fileContent = await readFileAsText(file)
      const csvData = parseCSV(fileContent)
      const headers = csvData[0]
      const data = csvToObjectArray(csvData, headers)

      // Validate data
      const validationResult =
        templateType === 'kw-filtering' ? validateKwFilteringData(data) : validateGenreKeywordData(data)

      // If validation fails, show errors
      if (!validationResult.isValid) {
        setErrors(validationResult.errors)
        options?.onError?.(validationResult.errors)

        return
      }

      const formData = new FormData()

      formData.append('file', file)

      const response = await fetch(`/api/upload/${templateType}`, {
        method: 'POST',
        body: formData
      })

      const responseData: FileUploadResponse = await response.json()

      if (!responseData.success) {
        setErrors(responseData.errors || [{ message: responseData.message || 'Upload failed' }])
        options?.onError?.(responseData.errors)

        return
      }

      options?.onSuccess?.(responseData.message)
    } catch (error) {
      console.error('Error uploading file:', error)
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'

      setErrors([{ message }])
      options?.onError?.([{ message }])
    } finally {
      setIsUploading(false)
    }
  }

  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = event => {
        if (event.target?.result) {
          resolve(event.target.result.toString())
        } else {
          reject(new Error('Failed to read file'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Error reading file'))
      }

      reader.readAsText(file)
    })
  }

  return {
    isUploading,
    isLoading,
    errors,
    previewData,
    downloadTemplate,
    uploadFile,
    previewFile,
    resetErrors
  }
}
