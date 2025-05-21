'use client'

import { Chip } from '@mui/material'

import type { CampaignSettingTableCellProps } from '@/types/campaignType'
import CustomIconButton from '@/@core/components/mui/IconButton'

const SettingButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <CustomIconButton size='small' aria-label='setting keyword' color='primary' variant='contained' onClick={onClick}>
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

  const handleClick = () => {
    if (meta?.navigateAdgroupSettingPage) {
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
          <SettingButton onClick={handleClick} />
        </div>
      </div>
    </div>
  )
}

export default KeywordSettingStatusCell
