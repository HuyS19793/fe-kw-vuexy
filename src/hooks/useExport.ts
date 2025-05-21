// utils/useExport.ts
import { useState, useCallback } from 'react'

import type { ExportTrendKeywordParams, ExportState, ExportOptions } from '@/types/exportType'
import { downloadFile } from '@/utils/export'
import { exportTrendKeyword } from '@/actions/trend-keyword'

/**
 * React hook để quản lý logic export trend keyword
 */
export function useExportTrendKeyword(defaultOptions?: ExportOptions) {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    error: null
  })

  const exportData = useCallback(
    async (params: ExportTrendKeywordParams, options?: ExportOptions) => {
      // Kết hợp default options và options được truyền vào
      const mergedOptions = { ...defaultOptions, ...options }

      const { onStart, onSuccess, onError, onComplete } = mergedOptions

      // Cập nhật trạng thái bắt đầu
      setState({ isExporting: true, error: null })
      onStart?.()

      try {
        // Gọi action export
        const result = await exportTrendKeyword(params)

        if (result.success && result.fileInfo) {
          // Download file
          downloadFile(result.fileInfo)

          // Gọi callback thành công
          onSuccess?.(result.fileInfo)

          return result.fileInfo
        } else {
          // Xử lý lỗi từ API
          const errorMessage = result.error || 'Export failed with unknown error'

          setState(prev => ({ ...prev, error: errorMessage }))
          onError?.(new Error(errorMessage))
          throw new Error(errorMessage)
        }
      } catch (error) {
        // Xử lý lỗi
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

        setState(prev => ({ ...prev, error: errorMessage }))
        onError?.(error instanceof Error ? error : new Error(errorMessage))
        throw error
      } finally {
        // Đặt lại trạng thái và gọi callback hoàn thành
        setState(prev => ({ ...prev, isExporting: false }))
        onComplete?.()
      }
    },
    [defaultOptions]
  )

  return {
    ...state,
    exportData
  }
}
