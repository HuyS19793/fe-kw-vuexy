import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { decodeToken } from '@/libs/auth'

export async function GET(req: NextRequest) {
  const accessToken = headers().get('x-amzn-oidc-accesstoken')

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token not found' }, { status: 401 })
  }

  const decodePayload = await decodeToken(accessToken)

  return NextResponse.json(decodePayload)
}
