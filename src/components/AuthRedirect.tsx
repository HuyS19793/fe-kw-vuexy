'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Type Imports
import type { Locale } from '@/i18n/config'

// Config Imports
import themeConfig from '@configs/themeConfig'
import { getLocalizedUrl } from '@/i18n/utils'

// Util Imports

const AuthRedirect = ({ lang }: { lang: Locale }) => {
  const pathname = usePathname()

  // ℹ️ Bring me `lang`
  const redirectUrl = `/${lang}/login?redirectTo=${pathname}`
  const login = `/${lang}/login`
  const homePage = getLocalizedUrl(themeConfig.homePageUrl, lang)

  return redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
}

export default AuthRedirect
