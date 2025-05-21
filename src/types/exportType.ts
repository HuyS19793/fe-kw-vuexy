// utils/types.ts
export interface ExportParams {
  search?: string
  from_date?: string
  to_date?: string
  category_name?: string
  [key: string]: string | undefined
}

export interface FileInfo {
  filename: string
  contentType: string
  base64Data: string
}

export interface ExportResult {
  success: boolean
  error?: string
  fileInfo?: FileInfo
}

export interface ExportState {
  isExporting: boolean
  error: string | null
}

export interface ExportOptions {
  apiUrl?: string
  getToken?: () => string | Promise<string>
  onStart?: () => void
  onSuccess?: (fileInfo: FileInfo) => void
  onError?: (error: Error) => void
  onComplete?: () => void
}

// Đảm bảo type này tương thích với ExportTrendKeywordParams
export type { ExportParams as ExportTrendKeywordParams }
export type { ExportResult as ExportTrendKeywordResponse }
