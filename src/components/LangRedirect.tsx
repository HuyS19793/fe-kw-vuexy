'use client'

import { redirect, usePathname } from 'next/navigation'

import { i18n } from '@/i18n/config'
import themeConfig from '@/configs/themeConfig'

const LangRedirect = () => {
  const pathname = usePathname()

  console.log({ pathname })

  if (pathname === '/' || pathname === '' || i18n.locales.includes(pathname.replace('/', '') as 'jp' | 'en')) {
    redirect(`/${i18n.defaultLocale}${themeConfig.homePageUrl}`)
  }

  const redirectUrl = `/${i18n.defaultLocale}${pathname}`

  redirect(redirectUrl)
}

export default LangRedirect
