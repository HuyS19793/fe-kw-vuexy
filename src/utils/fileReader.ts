// src/utils/fileReader.ts
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export type ParsedFileData = {
  headers: string[]
  rows: string[][]
  totalRows: number
}

/**
 * Reads and parses a file based on its type (CSV or Excel)
 */
export async function readAndParseFile(file: File): Promise<ParsedFileData> {
  const fileType = file.name.split('.').pop()?.toLowerCase()

  if (fileType === 'csv') {
    return parseCSVFile(file)
  } else if (['xlsx', 'xls'].includes(fileType || '')) {
    return parseExcelFile(file)
  } else {
    throw new Error('Unsupported file type. Please upload CSV or Excel files.')
  }
}

/**
 * Parses a CSV file
 */
async function parseCSVFile(file: File): Promise<ParsedFileData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      encoding: 'Shift_JIS',
      complete: results => {
        const rows = results.data as string[][]

        if (rows.length === 0) {
          reject(new Error('Empty file'))

          return
        }

        const headers = rows[0]
        const dataRows = rows.slice(1).filter(row => row.some(cell => cell.trim() !== ''))

        resolve({
          headers,
          rows: dataRows,
          totalRows: dataRows.length
        })
      },
      error: error => {
        reject(new Error(`Error parsing CSV: ${error.message}`))
      }
    })
  })
}

/**
 * Parses an Excel file
 */
async function parseExcelFile(file: File): Promise<ParsedFileData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      try {
        console.log('Reading Excel file...')
        const data = new Uint8Array(e.target?.result as ArrayBuffer)

        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellText: false
        })

        // Log workbook info for debugging
        console.log('Workbook sheets:', workbook.SheetNames)

        // Assume first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        console.log('Reading from sheet:', firstSheetName)

        // Try with different options if default fails
        let rows

        try {
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as string[][]
        } catch (err) {
          console.warn('First conversion attempt failed, trying with different options', err)
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true }) as string[][]
        }

        console.log('Rows parsed:', rows.length)

        if (rows.length > 0) {
          console.log('Sample first row:', rows[0])
        }

        if (rows.length === 0) {
          reject(new Error('Empty file'))

          return
        }

        const headers = rows[0]
        const dataRows = rows.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''))

        resolve({
          headers,
          rows: dataRows,
          totalRows: dataRows.length
        })
      } catch (error) {
        console.error('Excel parsing error:', error)
        reject(new Error(`Error parsing Excel file: ${error instanceof Error ? error.message : String(error)}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Converts parsed data to objects with header keys
 */
export function convertParsedDataToObjects(data: ParsedFileData): Record<string, string>[] {
  return data.rows.map(row => {
    const obj: Record<string, string> = {}

    data.headers.forEach((header, index) => {
      obj[header] = row[index] || ''
    })

    return obj
  })
}
