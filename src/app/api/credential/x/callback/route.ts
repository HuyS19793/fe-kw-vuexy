import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import URLS from '@/configs/url'
import fetchServer from '@/libs/fetchServer'

export async function GET(req: NextRequest) {
  // Get parameters from the request
  const url = new URL(req.url)
  const params = url.searchParams

  const oAuthToken = params.get('oauth_token')
  const oAuthVerifier = params.get('oauth_verifier')

  if (!oAuthToken || !oAuthVerifier) {
    return NextResponse.json({
      message: 'Invalid parameters'
    })
  }

  const path = `${URLS.proxy.getTokenX}?oauth_token=${oAuthToken}&oauth_verifier=${oAuthVerifier}`

  const res = await fetchServer(path)

  // console.log(res)

  // return NextResponse.json(res)

  if (res.code !== 200) {
    return NextResponse.json({
      message: 'Failed to authenticate'
    })
  }

  const { redirect, twitter_user_id } = res.data || {}

  if (twitter_user_id) {
    // Crawl account, campaign, adgroup
    await fetchServer(`${URLS.proxy.crawlX}${twitter_user_id}/?dimension=account`)

    await fetchServer(`${URLS.proxy.crawlX}${twitter_user_id}/?dimension=campaign`)

    await fetchServer(`${URLS.proxy.crawlX}${twitter_user_id}/?dimension=adgroup`)
  }

  // Redirect to the URL
  if (!redirect) {
    return NextResponse.json({
      message: 'Failed to redirect'
    })
  }

  return NextResponse.redirect(redirect)
}
