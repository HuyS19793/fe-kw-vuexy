import themeConfig from '@/configs/themeConfig'

const getClientMode = () => {
  const keyStorage = `${themeConfig.templateName.toLowerCase().split(' ').join('-')}-mui-template-mode`

  const clientMode = localStorage?.getItem(keyStorage) || 'light'

  return clientMode
}

export default getClientMode
