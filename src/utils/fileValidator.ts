// utils/fileValidator.ts
import type { ValidationError, FileValidationResult, KwFilteringRow, GenreKeywordRow } from '@/types/bulkUpload'

// List of valid genres
const VALID_GENRES = [
  'エンターテイメント',
  'アニメ・ゲーム',
  'スポーツ',
  '社会・政治・ニュース',
  'ライフスタイル・健康・フード',
  'その他'
]

// Validate KW Filtering data
export const validateKwFilteringData = (data: any[]): FileValidationResult => {
  const errors: ValidationError[] = []
  const validRows: KwFilteringRow[] = []

  // Check if data is empty
  if (!data || data.length === 0) {
    return {
      isValid: false,
      errors: [{ message: 'File is empty or invalid format' }]
    }
  }

  // Validate each row
  data.forEach((row, rowIndex) => {
    // Skip header row if present
    if (rowIndex === 0) return

    // Convert to zero-based row index for error reporting
    const displayRowIndex = rowIndex + 1

    // Validate Inspection Condition
    if (!row.inspectionCondition) {
      errors.push({
        row: displayRowIndex,
        column: '精査軸',
        message: 'Inspection condition is required'
      })
    } else if (!['CPA', 'CPC', 'CPM'].includes(row.inspectionCondition)) {
      errors.push({
        row: displayRowIndex,
        column: '精査軸',
        message: 'Inspection condition must be CPA, CPC, or CPM'
      })
    }

    // Validate Holiday Execution
    if (row.holidayExecution && !['ON', 'OFF'].includes(row.holidayExecution)) {
      errors.push({
        row: displayRowIndex,
        column: '休日実行',
        message: 'Holiday execution must be ON or OFF'
      })
    }

    // Validate Performance values are numbers
    if (row.performanceAboveOne && isNaN(parseFloat(row.performanceAboveOne.replace('%', '')))) {
      errors.push({
        row: displayRowIndex,
        column: '実績=1以上の場合、平均対比で○○%で停止',
        message: 'Must be a valid number or percentage'
      })
    }

    if (row.performanceZero && isNaN(parseFloat(row.performanceZero.replace('%', '')))) {
      errors.push({
        row: displayRowIndex,
        column: '実績=0の場合、平均対比で○○%で停止',
        message: 'Must be a valid number or percentage'
      })
    }

    // Validate calculation period is a number
    if (row.calculationPeriod && isNaN(parseInt(row.calculationPeriod))) {
      errors.push({
        row: displayRowIndex,
        column: '平均実績の計算期間 前○○日間',
        message: 'Must be a valid number'
      })
    }

    // Add to valid rows if no errors for this row
    if (!errors.some(err => err.row === displayRowIndex)) {
      validRows.push(row as KwFilteringRow)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    data: validRows.length > 0 ? validRows : undefined
  }
}

// Validate Genre Keyword data
export const validateGenreKeywordData = (data: any[]): FileValidationResult => {
  const errors: ValidationError[] = []
  const validRows: GenreKeywordRow[] = []

  // Check if data is empty
  if (!data || data.length === 0) {
    return {
      isValid: false,
      errors: [{ message: 'File is empty or invalid format' }]
    }
  }

  // Validate each row
  data.forEach((row, rowIndex) => {
    // Skip header row if present
    if (rowIndex === 0) return

    // Convert to zero-based row index for error reporting
    const displayRowIndex = rowIndex + 1

    // Validate Submit Flag
    if (row.submitFlag && !['ON', 'OFF'].includes(row.submitFlag)) {
      errors.push({
        row: displayRowIndex,
        column: '入稿フラグ',
        message: 'Submit flag must be ON or OFF'
      })
    }

    // Validate Include Genres
    const includeGenreColumns = [
      'includeGenre1',
      'includeGenre2',
      'includeGenre3',
      'includeGenre4',
      'includeGenre5',
      'includeGenre6'
    ]

    includeGenreColumns.forEach(colName => {
      if (row[colName] && !VALID_GENRES.includes(row[colName])) {
        errors.push({
          row: displayRowIndex,
          column: `設定ジャンル${colName.replace('includeGenre', '')}`,
          message: 'Invalid genre value'
        })
      }
    })

    // Validate Exclude Genres
    const excludeGenreColumns = ['excludeGenre1', 'excludeGenre2', 'excludeGenre3', 'excludeGenre4', 'excludeGenre5']

    excludeGenreColumns.forEach(colName => {
      if (row[colName] && !VALID_GENRES.includes(row[colName])) {
        errors.push({
          row: displayRowIndex,
          column: `除外ジャンル${colName.replace('excludeGenre', '')}`,
          message: 'Invalid genre value'
        })
      }
    })

    // Add to valid rows if no errors for this row
    if (!errors.some(err => err.row === displayRowIndex)) {
      validRows.push({
        ...row,
        includeGenres: includeGenreColumns.map(col => row[col]).filter(Boolean)
      } as GenreKeywordRow)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    data: validRows.length > 0 ? validRows : undefined
  }
}

// Helper to parse CSV content
export const parseCSV = (csvContent: string): string[][] => {
  // Simple CSV parser (for production, consider using a library like Papa Parse)
  return csvContent.split('\n').map(line => line.split(',').map(cell => cell.trim()))
}

// Helper to convert CSV data to object array
export const csvToObjectArray = (csvData: string[][], headers: string[]): any[] => {
  return csvData.slice(1).map(row => {
    const obj: Record<string, string> = {}

    headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })

    return obj
  })
}
