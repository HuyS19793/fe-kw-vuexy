import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Lấy tất cả headers từ request
  const headersObj: Record<string, string> = {}

  request.headers.forEach((value: string, key: string) => {
    headersObj[key] = value
  })

  // Lấy cookies từ header 'cookie'
  const cookieHeader: string | null = request.headers.get('cookie')
  const cookiesObj: Record<string, string> = {}

  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [key, ...valParts] = cookie.split('=')

      if (key && valParts.length > 0) {
        cookiesObj[key.trim()] = valParts.join('=').trim()
      }
    })
  }

  // Trả về JSON chứa headers và cookies
  return NextResponse.json({
    headers: headersObj,
    cookies: cookiesObj
  })
}
