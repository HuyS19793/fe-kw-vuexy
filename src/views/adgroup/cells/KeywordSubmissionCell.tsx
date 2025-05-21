import { Switch } from '@mui/material'

import type { AdgroupSettingTableCellProps } from '@/types/adgroupType'

const KeywordSubmissionCell = (info: AdgroupSettingTableCellProps) => {
  const row = info.row.original

  const value = row.isKeywordSubmission

  // console.log(value)

  const meta = info.table.options.meta

  const handleClick = () => {
    if (meta?.toggleKeywordSubmission) {
      meta.toggleKeywordSubmission(row, !value)
    }
  }

  return (
    <div className='flex justify-center items-center h-full'>
      <Switch name='isKeywordSubmission' checked={value} className='transform scale-125' onChange={handleClick} />
    </div>
  )
}

export default KeywordSubmissionCell
