import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type TemplateType = 'kw-filtering' | 'genre-keyword'
type BulkType = 'rule' | 'genre'

/**
 * Maps frontend template types to API bulk types
 */
const mapTemplateToBulkType = (templateType: TemplateType): BulkType => {
  const mapping: Record<TemplateType, BulkType> = {
    'kw-filtering': 'rule',
    'genre-keyword': 'genre'
  }

  return mapping[templateType]
}

export async function GET(request: NextRequest, { params }: { params: { templateType: TemplateType } }) {
  try {
    const { templateType } = params
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 })
    }

    if (!['kw-filtering', 'genre-keyword'].includes(templateType)) {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 })
    }

    const bulkType = mapTemplateToBulkType(templateType)
    const baseUrl = process.env.API_URL

    if (!baseUrl) {
      return NextResponse.json({ error: 'API URL not configured' }, { status: 500 })
    }

    // Build API URL
    const apiUrl = `${baseUrl}/bulk-setting/template/download/?bulk_type=${bulkType}&account_id=${accountId}`

    // Make request to backend API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()

      console.error(`Template download failed: ${response.status} - ${errorText}`)

      return NextResponse.json(
        { error: `Failed to download template: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Get the file content
    const fileBuffer = await response.arrayBuffer()

    // Get filename from response headers or create default
    const contentDisposition = response.headers.get('content-disposition')
    let filename = `template_${templateType}_${accountId}.xlsx`

    if (contentDisposition) {
      const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)

      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    console.error('Template download error:', error)

    return NextResponse.json({ error: 'Internal server error during template download' }, { status: 500 })
  }
}
