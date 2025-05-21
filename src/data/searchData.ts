type SearchData = {
  id: string
  name: string
  url: string
  excludeLang?: boolean
  icon: string
  section: string
  shortcut?: string
}

const data: SearchData[] = [
  {
    id: '1',
    name: 'Setting',
    url: '/setting',
    icon: 'tabler-settings',
    section: 'Setting'
  },
  {
    id: '2',
    name: 'Keywords',
    url: '/keyword',
    icon: 'tabler-search',
    section: 'Keywords'
  },
  {
    id: '3',
    name: 'Account Setting',
    url: '/account-setting',
    icon: 'tabler-users',
    section: 'Account Setting'
  }
]

export default data
