import { Chip } from '@mui/material'

import CustomIconButton from '@/@core/components/mui/IconButton'
import type { AdgroupSettingTableCellProps } from '@/types/adgroupType'

const SettingGenreCell = (info: AdgroupSettingTableCellProps) => {
  const row = info.row.original
  const meta = info.table.options.meta
  const value = row.genres || ''

  const handleEdit = () => {
    if (meta?.openSettingGenre) {
      meta.openSettingGenre(row)
    }
  }

  const handleDelete = (genre: string) => {
    if (meta?.deleteGenre) {
      meta.deleteGenre(row, genre, 'genres')
    }
  }

  return (
    <div className='flex gap-2'>
      <CustomIconButton
        aria-label='edit genre'
        variant='outlined'
        color='primary'
        size='small'
        className='p-0.5'
        onClick={handleEdit}
      >
        <i className='tabler-pencil' />
      </CustomIconButton>
      {value.map((genre: string) => (
        <Chip
          key={genre}
          label={genre}
          color='primary'
          size='small'
          onDelete={() => handleDelete(genre)}
          deleteIcon={<i className='tabler-trash-x' />}
        />
      ))}
    </div>
  )
}

export default SettingGenreCell
