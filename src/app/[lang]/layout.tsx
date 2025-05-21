import type { ReactNode } from 'react'

// Next Imports
// import { headers } from 'next/headers'

// Font Imports
import { Zen_Kaku_Gothic_New } from 'next/font/google'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Next intl imports
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

// Component Imports
import NextTopLoader from 'nextjs-toploader'

// Type Imports
import type { Locale } from '@/i18n/config'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import primaryColorConfig from '@/configs/primaryColorConfig'
import { LoadingProvider } from '@/contexts/loadingContext'

// import TranslationWrapper from '@/hocs/TranslationWrapper'

export const metadata = {
  title: {
    template: '%s | KWBooster',
    default: 'KW Booster - Automated Keyword Allocation Tool for Maximum Advertising Efficiency'
  },
  description:
    'KW Booster is an AI-driven tool for automated keyword allocation, optimizing advertising effectiveness with minimal effort. The tool enables targeting with trending keywords, offers ease of use.'
}

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin']
})

const RootLayout = async ({ children, params: { lang } }: { children: ReactNode; params: { lang: Locale } }) => {
  // console.log({ lang })

  // Vars
  // const headersList = headers()
  const messages = await getMessages()

  return (
    <html id='__next' lang={lang} dir='ltr'>
      <head>
        <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/site.webmanifest' />
      </head>
      <body className={`${zenKakuGothicNew.className} flex is-full min-bs-full flex-auto flex-col`}>
        <NextTopLoader color={primaryColorConfig[0].main} />
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>{children}</LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
