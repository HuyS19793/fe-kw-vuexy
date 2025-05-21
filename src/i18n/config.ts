export const i18n = {
  defaultLocale: 'jp',
  locales: ['en', 'jp']
} as const

export type Locale = (typeof i18n)['locales'][number]
