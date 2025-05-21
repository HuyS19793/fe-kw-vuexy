'use client'

import * as React from 'react'

import { useSearchParams } from 'next/navigation'

import type { ListChildComponentProps } from 'react-window'
import { FixedSizeList } from 'react-window'
import { Card, Grid, Typography, ListItem, ListItemText, CircularProgress } from '@mui/material'

import { useTranslations } from 'next-intl'

import { useLoading } from '@/contexts/loadingContext'
import { useSettings } from '@/@core/hooks/useSettings'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import CustomTextField from '@/@core/components/mui/TextField'
import type { AccountType } from '@/types/accountType'

// Type definitions
type VirtualizedListboxProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

type OuterElementTypeProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode
}

type AccountSelectionProps = {
  accountData: AccountType[]
}

type AccountSelectionWithDarkModeProps = AccountSelectionProps

// Component for virtualized list
const VirtualizedListbox = React.forwardRef<HTMLDivElement, VirtualizedListboxProps>(
  function VirtualizedListbox(props, ref) {
    const { children, ...other } = props
    const itemCount = React.Children.count(children)
    const itemSize = 48
    const { settings } = useSettings()
    const isDarkMode = settings.mode === 'dark'

    return (
      <div ref={ref} {...other}>
        <FixedSizeList
          width='100%'
          height={Math.min(8 * itemSize, itemCount * itemSize)}
          itemCount={itemCount}
          itemSize={itemSize}
          overscanCount={5}
          className={`scroll-smooth ${isDarkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}
        >
          {({ index, style }: ListChildComponentProps) => (
            <div style={{ ...style, overflow: 'hidden' }}>{React.Children.toArray(children)[index]}</div>
          )}
        </FixedSizeList>
      </div>
    )
  }
)

// OUTERLISTITEMCOMPONENT to fix scroll issues
const OuterElementContext = React.createContext<Record<string, unknown>>({})

const OuterElementType = React.forwardRef<HTMLDivElement, OuterElementTypeProps>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext)

  return <div ref={ref} {...props} {...outerProps} />
})

OuterElementType.displayName = 'OuterElementType'

// Dark Mode styles component
interface DarkModeStylesProps {
  isDarkMode: boolean
}

const DarkModeStyles: React.FC<DarkModeStylesProps> = ({ isDarkMode }) => {
  return isDarkMode ? (
    <style jsx global>{`
      .custom-scrollbar-dark::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar-dark::-webkit-scrollbar-track {
        background: #1e2736;
      }
      .custom-scrollbar-dark::-webkit-scrollbar-thumb {
        background: #3a4659;
        border-radius: 4px;
      }
      .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
        background: #4c5e76;
      }
      .custom-scrollbar-light::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar-light::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      .custom-scrollbar-light::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
      }
      .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
      }
    `}</style>
  ) : null
}

// Main component
const AccountSelection: React.FC<AccountSelectionProps> = ({ accountData }) => {
  // *** HOOKS ***
  const t = useTranslations()
  const searchParams = useSearchParams()
  const { isPending, updateSearchParams } = useLoading()
  const { settings } = useSettings()
  const isDarkMode = settings.mode === 'dark'

  // *** STATE ***
  const [open, setOpen] = React.useState<boolean>(false)
  const [filteredOptions, setFilteredOptions] = React.useState<AccountType[]>([])
  const [inputValue, setInputValue] = React.useState<string>('')

  // *** MEMOIZED VALUES ***
  const accountId = searchParams.get('account_id')

  const accountSelected = React.useMemo(
    () => accountData.find(account => account.id === accountId) || null,
    [accountData, accountId]
  )

  // Update filtered options when input changes
  React.useEffect(() => {
    if (!inputValue) {
      setFilteredOptions(accountData)

      return
    }

    const lowercasedInput = inputValue.toLowerCase()

    const filtered = accountData.filter(
      account =>
        account.name.toLowerCase().includes(lowercasedInput) || account.id.toLowerCase().includes(lowercasedInput)
    )

    setFilteredOptions(filtered)
  }, [accountData, inputValue])

  // *** FUNCTIONS ***
  const handleSelectAccount = (account: AccountType | null): void => {
    if (!account) return
    updateSearchParams({ account_id: account.id })
  }

  // Type for render option props coming from MUI Autocomplete
  interface AutocompleteOptionProps extends React.HTMLAttributes<HTMLLIElement> {
    key?: string
  }

  // *** RENDER ***
  return (
    <Card className={`p-6 space-y-6 relative ${isDarkMode ? 'bg-[#283144]' : ''}`}>
      <Grid container spacing={6} className='mb-3'>
        <Grid item xs={12}>
          <Typography variant='h4' className='mbe-1'>
            {t('Account Selection')}
          </Typography>
          <Typography>{t('Select account and setting your campaigns')}</Typography>
        </Grid>
      </Grid>

      <div className='mb-4'>
        <CustomAutocomplete
          fullWidth
          disableListWrap
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          ListboxComponent={VirtualizedListbox as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
          ListboxProps={{
            style: { maxHeight: 'none' }
          }}
          options={filteredOptions}
          loading={isPending}
          loadingText={<CircularProgress size={20} />}
          defaultValue={accountSelected}
          onChange={(event, newValue) => handleSelectAccount(newValue as AccountType)}
          onInputChange={(event, newValue) => {
            setInputValue(newValue || '')
          }}
          id='select-account'
          getOptionLabel={(option: AccountType) => `${option.name} (${option.id})`}
          isOptionEqualToValue={(option: AccountType, value: AccountType) => option.id === value.id}
          renderInput={params => (
            <CustomTextField {...params} size='small' placeholder={t('Select Account')} disabled={isPending} />
          )}
          renderOption={(props: AutocompleteOptionProps, option: AccountType) => {
            // Extract key from props
            const { key, ...otherProps } = props

            return (
              <ListItem
                {...otherProps}
                key={option.id}
                component='li'
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-[#3a4659]' : 'hover:bg-gray-100'
                }`}
              >
                <ListItemText
                  primary={option.name}
                  secondary={option.id}
                  primaryTypographyProps={{
                    className: `font-medium ${isDarkMode ? 'text-white' : ''}`
                  }}
                  secondaryTypographyProps={{
                    className: `text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                  }}
                />
              </ListItem>
            )
          }}
          disabled={isPending}
        />
      </div>
    </Card>
  )
}

// Wrapper component with dark mode styles
const AccountSelectionWithDarkMode: React.FC<AccountSelectionWithDarkModeProps> = props => {
  const { settings } = useSettings()
  const isDarkMode = settings.mode === 'dark'

  return (
    <>
      <DarkModeStyles isDarkMode={isDarkMode} />
      <AccountSelection {...props} />
    </>
  )
}

// Add display names for React DevTools
VirtualizedListbox.displayName = 'VirtualizedListbox'
AccountSelection.displayName = 'AccountSelection'
AccountSelectionWithDarkMode.displayName = 'AccountSelectionWithDarkMode'

// Memoize component to prevent unnecessary re-renders
export default React.memo(AccountSelectionWithDarkMode)
