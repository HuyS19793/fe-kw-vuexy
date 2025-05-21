// components/ExportButton.tsx
'use client'

import { useSearchParams } from 'next/navigation'

import { useTranslations } from 'next-intl'
import { Button } from '@mui/material'

import { useExportTrendKeyword } from '@/hooks/useExport'
import type { ExportTrendKeywordParams } from '@/types/exportType'

interface ExportButtonProps {
  defaultParams?: ExportTrendKeywordParams
}

export default function ExportButton({ defaultParams }: ExportButtonProps) {
  // *** HOOKS ***
  const t = useTranslations()
  const searchParams = useSearchParams()

  // Sử dụng custom hook cho export
  const { isExporting, error, exportData } = useExportTrendKeyword({
    onStart: () => console.log('Export started'),
    onSuccess: fileInfo => console.log(`File ${fileInfo.filename} downloaded successfully!`),
    onError: error => console.error('Export error:', error)
  })

  async function handleExport() {
    try {
      // Tạo params từ props hoặc dùng URL search params
      const params: ExportTrendKeywordParams = defaultParams || {
        search: searchParams.get('search') || '',
        from_date: searchParams.get('from_date') || '',
        to_date: searchParams.get('to_date') || '',
        category_name: searchParams.get('category_name') || ''
      }

      // Thực hiện export bằng hook
      await exportData(params)
    } catch (error) {
      // Lỗi đã được xử lý trong hook
      console.error('Export failed:', error)
    }
  }

  return (
    <div>
      <div>
        <Button
          variant='contained'
          color='primary'
          startIcon={
            isExporting ? (
              <svg
                className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            ) : (
              <i className='tabler-download' />
            )
          }
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? t('Exporting') : t('Download')}
        </Button>
      </div>

      {error && <div className='mt-2 text-red-500 text-sm'>{error}</div>}
    </div>
  )
}
