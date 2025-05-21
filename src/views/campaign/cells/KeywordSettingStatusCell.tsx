'use client'

import { Chip } from '@mui/material'

import type { CampaignSettingTableCellProps } from '@/types/campaignType'
import CustomIconButton from '@/@core/components/mui/IconButton'

const SettingButton = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => {
  return (
    <CustomIconButton
      size='small'
      aria-label='setting keyword'
      color='primary'
      variant='contained'
      onClick={onClick}
      disabled={disabled}
    >
      <i className='tabler-settings' />
    </CustomIconButton>
  )
}

const KeywordSettingStatusCell = (info: CampaignSettingTableCellProps) => {
  const row = info.row.original
  const meta = info.table.options.meta

  const value = row.adGroupSettingCount

  const splitValue = value.split('/')

  const current = Number(splitValue[0])
  const total = Number(splitValue[1])

  const isComplete = current === total && total !== 0

  // Check if we have an account selected before allowing navigation
  const hasAccount = meta?.hasAccount === true

  const handleClick = () => {
    if (meta?.navigateAdgroupSettingPage && hasAccount) {
      meta.navigateAdgroupSettingPage(row)
    }
  }

  return (
    <div>
      <div className='flex gap-3'>
        <Chip
          label={value}
          variant='tonal'
          icon={isComplete ? <i className='tabler-check' /> : <i className='tabler-checkbox' />}
          color={isComplete ? 'success' : 'default'}
        />
        <div>
          <SettingButton onClick={handleClick} disabled={!hasAccount} />
        </div>
      </div>
    </div>
  )
}

export default KeywordSettingStatusCell
