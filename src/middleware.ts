// import createMiddleware from 'next-intl/middleware'

// import { routing } from './i18n/routing'

// export default createMiddleware(routing)

// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(jp|en)/:path*']
// }

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import createIntlMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import themeConfig from './configs/themeConfig'

const intlMiddleware = createIntlMiddleware(routing)

export default async function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname

  // health check endpoint
  if (pathName === '/ping') {
    return NextResponse.next()
  }

  if (pathName === '' || pathName === '/') {
    const homepagePath = `/${routing.defaultLocale}/${themeConfig.homePageUrl}`

    return NextResponse.redirect(new URL(homepagePath, req.nextUrl.origin))
  }

  if (pathName === '/en' || pathName === '/jp') {
    const currentLocale = pathName.replace('/', '')

    const homepagePath = `/${currentLocale}/${themeConfig.homePageUrl}`

    return NextResponse.redirect(new URL(homepagePath, req.nextUrl.origin))
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
