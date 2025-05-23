// src/utils/fileValidator.ts
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

// Valid inspection conditions
const VALID_INSPECTION_CONDITIONS = ['CPA', 'CPC', 'CPM']

// Valid flag values
const VALID_FLAGS = ['ON', 'OFF']

// Required headers for KW Filtering
const REQUIRED_KW_FILTERING_HEADERS = [
  'アカウントID',
  'アカウント名',
  'キャンペーンID',
  'キャンペーン名',
  '精査軸',
  '精査ポイント',
  '実績=1以上の場合、平均対比で○○%で停止',
  '実績=0の場合、平均対比で○○%で停止',
  '平均実績の計算期間 前○○日間',
  '休日実行'
]

// Required headers for Genre Keyword
const REQUIRED_GENRE_KEYWORD_HEADERS = [
  'アカウントID',
  'アカウント名',
  'キャンペーンID',
  'キャンペーン名',
  '広告グループID',
  '広告グループ名',
  '入稿フラグ',
  '設定ジャンル1',
  '設定ジャンル2',
  '設定ジャンル3',
  '設定ジャンル4',
  '設定ジャンル5',
  '設定ジャンル6',
  '除外ジャンル1',
  '除外ジャンル2',
  '除外ジャンル3',
  '除外ジャンル4',
  '除外ジャンル5',
  '固定キーワード設定',
  '固定キーワード除外'
]

/**
 * Validate KW Filtering data
 */
export const validateKwFilteringData = (data: Record<string, string>[]): FileValidationResult => {
  const errors: ValidationError[] = []
  const validRows: KwFilteringRow[] = []

  console.log('Starting KW Filtering validation with rows:', data.length)

  if (data.length > 0) {
    console.log('First row sample:', data[0])
  }

  // Check if data is empty
  if (!data || data.length === 0) {
    console.error('Empty data detected')

    return {
      isValid: false,
      errors: [{ message: 'File is empty or invalid format' }]
    }
  }

  // Check if all required headers are present
  const firstRowKeys = Object.keys(data[0] || {})

  console.log('Available headers:', firstRowKeys)

  // More flexible header check that accepts English alternatives
  const getMissingHeaders = () => {
    return REQUIRED_KW_FILTERING_HEADERS.filter(header => {
      // Check for exact Japanese match
      if (firstRowKeys.includes(header)) {
        return false
      }

      // Check for English alternatives
      const englishAlternatives = {
        アカウントID: ['Account ID', 'AccountID'],
        アカウント名: ['Account Name', 'AccountName'],
        キャンペーンID: ['Campaign ID', 'CampaignID'],
        キャンペーン名: ['Campaign Name', 'CampaignName'],
        精査軸: ['Inspection Condition', 'InspectionCondition'],
        精査ポイント: ['Inspection Point', 'InspectionPoint'],
        '実績=1以上の場合、平均対比で○○%で停止': ['Performance Above One', 'StopPercentageAboveOne'],
        '実績=0の場合、平均対比で○○%で停止': ['Performance Zero', 'StopPercentageZero'],
        '平均実績の計算期間 前○○日間': ['Calculation Period', 'CalculationPeriod'],
        休日実行: ['Holiday Execution', 'HolidayExecution']
      }

      const alternatives = englishAlternatives[header as keyof typeof englishAlternatives] || []

      return !alternatives.some(alt => firstRowKeys.includes(alt))
    })
  }

  const missingHeaders = getMissingHeaders()

  if (missingHeaders.length > 0) {
    console.error('Missing headers:', missingHeaders)

    return {
      isValid: false,
      errors: [
        {
          message: `Missing required headers: ${missingHeaders.join(', ')}. Please use the correct template.`
        }
      ]
    }
  }

  // Map Japanese column names to English properties
  const columnMapping = {
    アカウントID: 'accountId',
    アカウント名: 'accountName',
    キャンペーンID: 'campaignId',
    キャンペーン名: 'campaignName',
    精査軸: 'inspectionCondition',
    精査ポイント: 'inspectionPoint',
    '実績=1以上の場合、平均対比で○○%で停止': 'performanceAboveOne',
    '実績=0の場合、平均対比で○○%で停止': 'performanceZero',
    '平均実績の計算期間 前○○日間': 'calculationPeriod',
    休日実行: 'holidayExecution'
  }

  // Validate each row
  data.forEach((row, rowIndex) => {
    // Convert to zero-based row index for error reporting (add 2 to account for header row and Excel 1-based indexing)
    const displayRowIndex = rowIndex + 2

    // Create standardized row object
    const standardRow: Partial<KwFilteringRow> = {}

    // Map data using column mapping
    Object.entries(columnMapping).forEach(([jpColumn, engProperty]) => {
      standardRow[engProperty as keyof KwFilteringRow] = row[jpColumn] || ''
    })

    // Validate Inspection Condition
    if (!standardRow.inspectionCondition) {
      errors.push({
        row: displayRowIndex,
        column: '精査軸',
        message: 'Inspection condition is required'
      })
    } else if (!VALID_INSPECTION_CONDITIONS.includes(standardRow.inspectionCondition)) {
      errors.push({
        row: displayRowIndex,
        column: '精査軸',
        message: `Inspection condition must be ${VALID_INSPECTION_CONDITIONS.join(', ')}`
      })
    }

    // Validate Holiday Execution
    if (standardRow.holidayExecution && !VALID_FLAGS.includes(standardRow.holidayExecution)) {
      errors.push({
        row: displayRowIndex,
        column: '休日実行',
        message: 'Holiday execution must be ON or OFF'
      })
    }

    // Validate Performance values are numbers
    if (standardRow.performanceAboveOne) {
      const numValue = parseFloat(standardRow.performanceAboveOne.replace('%', ''))

      if (isNaN(numValue)) {
        errors.push({
          row: displayRowIndex,
          column: '実績=1以上の場合、平均対比で○○%で停止',
          message: 'Must be a valid number or percentage'
        })
      }
    }

    if (standardRow.performanceZero) {
      const numValue = parseFloat(standardRow.performanceZero.replace('%', ''))

      if (isNaN(numValue)) {
        errors.push({
          row: displayRowIndex,
          column: '実績=0の場合、平均対比で○○%で停止',
          message: 'Must be a valid number or percentage'
        })
      }
    }

    // Validate calculation period is a number
    if (standardRow.calculationPeriod && isNaN(parseInt(standardRow.calculationPeriod))) {
      errors.push({
        row: displayRowIndex,
        column: '平均実績の計算期間 前○○日間',
        message: 'Must be a valid number'
      })
    }

    // Add to valid rows if no errors for this row
    if (!errors.some(err => err.row === displayRowIndex)) {
      validRows.push(standardRow as KwFilteringRow)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    data: validRows.length > 0 ? validRows : undefined
  }
}

/**
 * Validate Genre Keyword data
 */
export const validateGenreKeywordData = (data: Record<string, string>[]): FileValidationResult => {
  const errors: ValidationError[] = []
  const validRows: GenreKeywordRow[] = []

  // Check if data is empty
  if (!data || data.length === 0) {
    return {
      isValid: false,
      errors: [{ message: 'File is empty or invalid format' }]
    }
  }

  // Check if all required headers are present
  const missingHeaders = REQUIRED_GENRE_KEYWORD_HEADERS.filter(header => !Object.keys(data[0] || {}).includes(header))

  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      errors: [{ message: '[header]が間違っています。再度記入してください。' }]
    }
  }

  // Map Japanese column names to English properties
  const columnMapping = {
    アカウントID: 'accountId',
    アカウント名: 'accountName',
    キャンペーンID: 'campaignId',
    キャンペーン名: 'campaignName',
    広告グループID: 'adgroupId',
    広告グループ名: 'adgroupName',
    入稿フラグ: 'submitFlag',
    設定ジャンル1: 'includeGenre1',
    設定ジャンル2: 'includeGenre2',
    設定ジャンル3: 'includeGenre3',
    設定ジャンル4: 'includeGenre4',
    設定ジャンル5: 'includeGenre5',
    設定ジャンル6: 'includeGenre6',
    除外ジャンル1: 'excludeGenre1',
    除外ジャンル2: 'excludeGenre2',
    除外ジャンル3: 'excludeGenre3',
    除外ジャンル4: 'excludeGenre4',
    除外ジャンル5: 'excludeGenre5',
    固定キーワード設定: 'includeKeywords',
    固定キーワード除外: 'excludeKeywords'
  }

  // Validate each row
  data.forEach((row, rowIndex) => {
    // Convert to zero-based row index for error reporting (add 2 to account for header row and Excel 1-based indexing)
    const displayRowIndex = rowIndex + 2

    // Create standardized row object with all expected properties
    const standardRow: Record<string, any> = {}

    // Map data using column mapping
    Object.entries(columnMapping).forEach(([jpColumn, engProperty]) => {
      standardRow[engProperty] = row[jpColumn] || ''
    })

    // Validate Submit Flag
    if (standardRow.submitFlag && !VALID_FLAGS.includes(standardRow.submitFlag)) {
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

    includeGenreColumns.forEach((colName, idx) => {
      if (standardRow[colName] && !VALID_GENRES.includes(standardRow[colName])) {
        errors.push({
          row: displayRowIndex,
          column: `設定ジャンル${idx + 1}`,
          message: 'Invalid genre value'
        })
      }
    })

    // Validate Exclude Genres
    const excludeGenreColumns = ['excludeGenre1', 'excludeGenre2', 'excludeGenre3', 'excludeGenre4', 'excludeGenre5']

    excludeGenreColumns.forEach((colName, idx) => {
      if (standardRow[colName] && !VALID_GENRES.includes(standardRow[colName])) {
        errors.push({
          row: displayRowIndex,
          column: `除外ジャンル${idx + 1}`,
          message: 'Invalid genre value'
        })
      }
    })

    // Create proper GenreKeywordRow object with includeGenres array
    const genreKeywordRow: Partial<GenreKeywordRow> = {
      accountId: standardRow.accountId,
      accountName: standardRow.accountName,
      campaignId: standardRow.campaignId,
      campaignName: standardRow.campaignName,
      adgroupId: standardRow.adgroupId,
      adgroupName: standardRow.adgroupName,
      submitFlag: standardRow.submitFlag,
      includeKeywords: standardRow.includeKeywords,
      excludeKeywords: standardRow.excludeKeywords,
      includeGenres: includeGenreColumns.map(col => standardRow[col]).filter(Boolean),
      excludeGenres: excludeGenreColumns.map(col => standardRow[col]).filter(Boolean)
    }

    // Add to valid rows if no errors for this row
    if (!errors.some(err => err.row === displayRowIndex)) {
      validRows.push(genreKeywordRow as GenreKeywordRow)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    data: validRows.length > 0 ? validRows : undefined
  }
}
