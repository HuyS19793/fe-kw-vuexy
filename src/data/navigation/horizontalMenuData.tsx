// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Settings',
    icon: 'tabler-settings',
    href: '/campaign'
  },
  {
    label: 'Get Keywords',
    icon: 'tabler-search',
    href: '/keyword'
  },
  {
    label: 'All Account Settings',
    icon: 'tabler-automation',
    href: '/all-account-setting'
  },
  {
    label: 'Crendential',
    icon: 'tabler-brand-twitter',
    href: '/credential'
  }
]

export default horizontalMenuData
