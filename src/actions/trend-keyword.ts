// actions/trend-keyword.ts
'use server'

import URLS from '@/configs/url'
import type { ExportTrendKeywordParams, ExportTrendKeywordResponse } from '@/types/exportType'
import { createSearchParams, getFilenameFromHeader } from '@/utils/export'

export async function exportTrendKeyword(params: ExportTrendKeywordParams): Promise<ExportTrendKeywordResponse> {
  try {
    // Xây dựng URL với query params
    const queryParams = createSearchParams(params)

    // URL của API export
    const apiUrl = `${process.env.API_URL}${URLS.proxy.exportKeywords}?${queryParams.toString()}`

    // Gọi API với method GET
    const response = await fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Export failed with status: ${response.status}`)
    }

    // Lấy filename từ header
    const contentDisposition = response.headers.get('content-disposition')
    const filename = getFilenameFromHeader(contentDisposition, 'keywords.csv')

    // Lấy content type
    const contentType =
      response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    // Chuyển response thành ArrayBuffer rồi sang base64
    const buffer = await response.arrayBuffer()
    const base64Data = Buffer.from(buffer).toString('base64')

    return {
      success: true,
      fileInfo: {
        filename,
        contentType,
        base64Data
      }
    }
  } catch (error) {
    console.error('Export error:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
