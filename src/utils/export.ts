// utils/exportUtils.ts
import type { ExportParams, FileInfo } from '@/types/exportType'

/**
 * Create URL params from params object
 */
export function createSearchParams(params: ExportParams): URLSearchParams {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value)
    }
  })

  return searchParams
}

/**
 * Create full export URL
 */
export function createExportUrl(baseUrl: string, params: ExportParams): string {
  const searchParams = createSearchParams(params)

  return `${baseUrl}?${searchParams.toString()}`
}

/**
 * Get filename from Content-Disposition header
 */
export function getFilenameFromHeader(contentDisposition: string | null, defaultFilename = 'export.xlsx'): string {
  if (!contentDisposition) return defaultFilename

  const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)

  if (filenameMatch && filenameMatch[1]) {
    return filenameMatch[1].replace(/['"]/g, '')
  }

  return defaultFilename
}

/**
 * Create blob from base64 data
 */
export function base64ToBlob(base64Data: string, contentType: string): Blob {
  const binaryString = window.atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new Blob([bytes], { type: contentType })
}

/**
 * Download file from FileInfo object
 */
export function downloadFile(fileInfo: FileInfo): void {
  const { filename, contentType, base64Data } = fileInfo

  // Convert base64 to blob
  const blob = base64ToBlob(base64Data, contentType)

  // Create Object URL
  const url = URL.createObjectURL(blob)

  // Create link element and trigger download
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
