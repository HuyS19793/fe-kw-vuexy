// Next Imports

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@/i18n/config'

// Component Imports
import LangRedirect from '@components/LangRedirect'

// Config Imports
import { i18n } from '@/i18n/config'

// ℹ️ We've to create this array because next.js makes request with `_next` prefix for static/asset files
const invalidLangs = ['_next']

const TranslationWrapper = (params: { lang: Locale } & ChildrenType) => {
  const doesLangExist = i18n.locales.includes(params.lang)

  // ℹ️ This doesn't mean MISSING, it means INVALID
  const isInvalidLang = invalidLangs.includes(params.lang)

  console.log({ params, doesLangExist, isInvalidLang })

  return doesLangExist || isInvalidLang ? params.children : <LangRedirect />
}

export default TranslationWrapper
