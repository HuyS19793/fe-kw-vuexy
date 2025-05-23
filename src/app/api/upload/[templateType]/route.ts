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

export async function POST(request: NextRequest, { params }: { params: { templateType: TemplateType } }) {
  try {
    const { templateType } = params

    if (!['kw-filtering', 'genre-keyword'].includes(templateType)) {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 })
    }

    // Get form data from request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload Excel or CSV files.' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const bulkType = mapTemplateToBulkType(templateType)
    const baseUrl = process.env.API_URL

    if (!baseUrl) {
      return NextResponse.json({ error: 'API URL not configured' }, { status: 500 })
    }

    // Prepare form data for backend API
    const backendFormData = new FormData()

    backendFormData.append('file', file)
    backendFormData.append('bulk_type', bulkType)

    // Make request to backend API
    const apiUrl = `${baseUrl}/bulk-setting/upload/`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json'

        // Don't set Content-Type header for FormData - let browser set it with boundary
      },
      body: backendFormData
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error(`File upload failed: ${response.status}`, responseData)

      // Handle different error cases
      switch (response.status) {
        case 400:
          return NextResponse.json(
            {
              error: 'Validation error',
              details: responseData.message || 'Invalid file format or content',
              success: false
            },
            { status: 400 }
          )
        case 401:
          return NextResponse.json(
            {
              error: 'Unauthorized',
              details: 'Authentication required',
              success: false
            },
            { status: 401 }
          )
        case 500:
          return NextResponse.json(
            {
              error: 'Server error',
              details: responseData.message || 'Could not upload file: Access Denied',
              success: false
            },
            { status: 500 }
          )
        default:
          return NextResponse.json(
            {
              error: 'Upload failed',
              details: responseData.message || 'Unknown error occurred',
              success: false
            },
            { status: response.status }
          )
      }
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'File uploaded successfully',
        data: responseData
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('File upload error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error during file upload',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}
