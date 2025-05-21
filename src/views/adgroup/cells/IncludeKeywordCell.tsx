import { Chip } from '@mui/material'

import CustomIconButton from '@/@core/components/mui/IconButton'
import type { AdgroupSettingTableCellProps } from '@/types/adgroupType'

const IncludeKeywordCell = (info: AdgroupSettingTableCellProps) => {
  const row = info.row.original
  const value = row.includeKeywords

  const meta = info.table.options.meta

  const handleClick = () => {
    if (meta?.openSettingKeyword) {
      meta.openSettingKeyword(row)
    }
  }

  const handleDelete = (keyword: string) => {
    if (meta?.deleteKeyword) {
      meta.deleteKeyword(row, keyword, 'includeKeywords')
    }
  }

  return (
    <div className='flex gap-2 max-w-[400px] overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400'>
      <CustomIconButton
        aria-label='edit genre'
        color='primary'
        variant='outlined'
        size='small'
        className='p-0.5'
        onClick={handleClick}
        style={{ minWidth: 'auto' }}
      >
        <i className='tabler-pencil' />
      </CustomIconButton>
      {value.map((keyword: string) => (
        <Chip
          key={keyword}
          label={keyword}
          color='primary'
          variant='tonal'
          size='small'
          onDelete={() => handleDelete(keyword)}
          deleteIcon={<i className='tabler-trash-x' />}
        />
      ))}
    </div>
  )
}

export default IncludeKeywordCell
