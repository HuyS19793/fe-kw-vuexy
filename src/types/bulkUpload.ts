// types/bulkUpload.ts
export interface ValidationError {
  row?: number
  column?: string
  message: string
}

export interface UploadStatus {
  loading: boolean
  error: ValidationError[] | null
  success: boolean
}

export interface AccountInfo {
  id: string
  name: string
}

export interface FileInfo {
  file: File
  name: string
  size: number
}

export type UploadTabType = 'KW Filtering' | 'Genre Keyword'

export interface TemplateDownloadParams {
  accountId: string
  templateType: 'kw-filtering' | 'genre-keyword'
}

export interface FileUploadResponse {
  success: boolean
  errors?: ValidationError[]
  message?: string
}
