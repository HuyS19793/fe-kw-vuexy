import { Switch } from '@mui/material'

import type { CampaignSettingTableCellProps } from '@/types/campaignType'

const HolidaySuspensionCell = (info: CampaignSettingTableCellProps) => {
  const row = info.row.original

  const value = row.holidaySuspension

  const meta = info.table.options.meta

  const handleClick = () => {
    if (meta?.toggleHolidaySuspension) {
      meta.toggleHolidaySuspension(row, value === 'ON' ? 'OFF' : 'ON')
    }
  }

  return (
    <div>
      {/* <Button variant='tonal' color={value === 'OFF' ? 'error' : 'success'} size='small' onClick={handleClick}>
        {value}
      </Button> */}
      <div>
        <Switch
          name='holidaySuspension'
          checked={value === 'ON'}
          className='transform scale-125'
          onChange={handleClick}
        />
      </div>
    </div>
  )
}

export default HolidaySuspensionCell
