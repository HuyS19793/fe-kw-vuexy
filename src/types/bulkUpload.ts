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
  preview?: string
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

export interface FilePreviewData {
  headers: string[]
  rows: string[][]
  totalRows: number
}

export interface KwFilteringRow {
  accountId: string
  accountName: string
  campaignId: string
  campaignName: string
  inspectionCondition: string
  inspectionPoint: string
  performanceAboveOne: string
  performanceZero: string
  calculationPeriod: string
  holidayExecution: string
}

export interface GenreKeywordRow {
  accountId: string
  accountName: string
  campaignId: string
  campaignName: string
  adgroupId: string
  adgroupName: string
  submitFlag: string
  includeGenres: string[]
  excludeGenres: string[]
  includeKeywords: string
  excludeKeywords: string
}

export interface FileValidationResult {
  isValid: boolean
  errors: ValidationError[]
  data?: KwFilteringRow[] | GenreKeywordRow[]
}
