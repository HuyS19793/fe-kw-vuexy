export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-0',
    light: '#8F85F3',
    main: '#7367F0',
    dark: '#675DD8'
  },
  {
    name: 'primary-1',
    light: '#FF84FF',
    main: '#DA6EFC',
    dark: '#AE58C9'
  },
  {
    name: 'primary-2',
    light: '#429847',
    main: '#2C652F',
    dark: '#235126'
  },
  {
    name: 'primary-3',
    light: '#4EB0B1',
    main: '#0D9394',
    dark: '#096B6C'
  },
  {
    name: 'primary-4',
    light: '#FFC25A',
    main: '#FFAB1D',
    dark: '#BA7D15'
  },
  {
    name: 'primary-5',
    light: '#F0718D',
    main: '#EB3D63',
    dark: '#AC2D48'
  }
]

export default primaryColorConfig
