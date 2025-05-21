import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import URLS from '@/configs/url'
import fetchServer from '@/libs/fetchServer'

export async function GET(req: NextRequest) {
  const res = await fetchServer(URLS.proxy.redirectX)

  if (res.code !== 200) {
    return NextResponse.json({
      message: 'Failed to fetch data'
    })
  }

  const url = res.data?.authenticate_endpoint || ''

  if (!url) {
    return NextResponse.json({
      message: 'Failed to authenticate'
    })
  }

  return NextResponse.json({
    url
  })
}
