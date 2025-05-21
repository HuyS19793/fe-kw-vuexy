export type GenreKeywordType = {
  id: string
  name: string
  genre: string
  createdAt: string
}

export interface TrendKeywordTableProps {
  data: GenreKeywordType[]
  count: number
}

export type BlacklistKeywordType = {
  id: string
  value: string
}

// app/types.ts

export interface ExportTrendKeywordParams {
  search?: string
  from_date?: string
  to_date?: string
  category_name?: string
}

export interface ExportTrendKeywordResponse {
  success: boolean
  fileInfo?: {
    filename: string
    contentType: string
    base64Data: string
  }
  error?: string
}
