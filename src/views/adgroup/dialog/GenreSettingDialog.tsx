'use client'

// Core imports
import { useEffect, useMemo, useState } from 'react'

import { useTranslations } from 'next-intl'

// MUI components
import { Button, Checkbox, FormControlLabel, Typography } from '@mui/material'

// Custom components and hooks
import DialogComponent from '@/components/DialogComponent'
import { useGenreOptions } from '@/hooks/useOptions'

// Types
import type { AdgroupSettingType } from '@/types/adgroupType'

// Styles
import tableStyles from '@core/styles/table.module.css'

interface GenreSettingDialogProps {
  openDialog: boolean
  onClose: () => void
  data: AdgroupSettingType | null
  onSave: (genreSetting: { include: string[]; exclude: string[] }) => void
}

interface GenreSetting {
  include: string[]
  exclude: string[]
}

/**
 * Dialog component for managing genre inclusion and exclusion settings
 */
const GenreSettingDialog = ({ openDialog, onClose, data, onSave }: GenreSettingDialogProps) => {
  // Hooks
  const t = useTranslations()
  const genreOptions = useGenreOptions()

  // State
  const [genreSetting, setGenreSetting] = useState<GenreSetting>({
    include: [],
    exclude: []
  })

  // Load data when dialog opens with new data
  useEffect(() => {
    if (data) {
      setGenreSetting({
        include: [...data.genres],
        exclude: [...data.excludedGenres]
      })
    }
  }, [data])

  // Memoized calculation to determine if data has changed
  const isDataChanged = useMemo(() => {
    if (!data) return false

    // Check if lengths are different
    if (
      data.genres.length !== genreSetting.include.length ||
      data.excludedGenres.length !== genreSetting.exclude.length
    ) {
      return true
    }

    // Check if any items have been added or removed
    const hasIncludeChanges =
      data.genres.some(g => !genreSetting.include.includes(g)) ||
      genreSetting.include.some(g => !data.genres.includes(g))

    const hasExcludeChanges =
      data.excludedGenres.some(g => !genreSetting.exclude.includes(g)) ||
      genreSetting.exclude.some(g => !data.excludedGenres.includes(g))

    return hasIncludeChanges || hasExcludeChanges
  }, [data, genreSetting])

  // Handlers
  const handleSelectAllInclude = () => {
    const allSelected = genreSetting.include.length === genreOptions.length

    setGenreSetting({
      include: allSelected ? [] : [...genreOptions],
      exclude: allSelected ? genreSetting.exclude : []
    })
  }

  const handleSelect = (type: 'include' | 'exclude', genre: string, checked: boolean) => {
    if (type === 'include') {
      setGenreSetting(prev => ({
        include: checked ? [...prev.include, genre] : prev.include.filter(g => g !== genre),
        exclude: prev.exclude.filter(g => g !== genre)
      }))
    } else {
      setGenreSetting(prev => ({
        include: prev.include.filter(g => g !== genre),
        exclude: checked ? [...prev.exclude, genre] : prev.exclude.filter(g => g !== genre)
      }))
    }
  }

  const handleSave = () => onSave(genreSetting)

  // UI Components
  const renderGenreTable = () => (
    <div className='overflow-x-auto mx-6'>
      <table className={tableStyles.table}>
        <tbody>
          <tr className='border-bs-0'>
            <th />
            <th>
              <FormControlLabel
                className='capitalize'
                control={
                  <Checkbox
                    id='select-all-genre'
                    checked={genreSetting.include.length === genreOptions.length}
                    onChange={handleSelectAllInclude}
                  />
                }
                label={t('All Include')}
              />
            </th>
            <th />
          </tr>

          {genreOptions.map(genre => (
            <GenreTableRow
              key={genre}
              genre={genre}
              includeChecked={genreSetting.include.includes(genre)}
              excludeChecked={genreSetting.exclude.includes(genre)}
              onToggle={handleSelect}
              t={t}
            />
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <DialogComponent
      open={openDialog}
      onClose={onClose}
      title={data?.adgroupName || 'Genre Setting'}
      Body={renderGenreTable()}
      Actions={
        <Button
          variant='contained'
          endIcon={<i className='tabler-device-floppy' />}
          onClick={handleSave}
          disabled={!isDataChanged}
        >
          {t('Save')}
        </Button>
      }
    />
  )
}

// Helper component for table rows
interface GenreTableRowProps {
  genre: string
  includeChecked: boolean
  excludeChecked: boolean
  onToggle: (type: 'include' | 'exclude', genre: string, checked: boolean) => void
  t: (key: string) => string
}

const GenreTableRow = ({ genre, includeChecked, excludeChecked, onToggle, t }: GenreTableRowProps) => {
  const id = genre.toLowerCase().replace(/\s+/g, '-')

  return (
    <tr className='border-be'>
      <td>
        <Typography className='font-bold whitespace-nowrap flex-grow min-is-[225px]' color='text.primary'>
          {genre}
        </Typography>
      </td>
      <td>
        <FormControlLabel
          className='capitalize text-primary'
          control={
            <Checkbox
              id={`include-${id}`}
              checked={includeChecked}
              onChange={e => onToggle('include', genre, e.target.checked)}
            />
          }
          label={t('Include')}
        />
      </td>
      <td>
        <FormControlLabel
          className='capitalize text-error'
          control={
            <Checkbox
              id={`exclude-${id}`}
              color='error'
              checked={excludeChecked}
              onChange={e => onToggle('exclude', genre, e.target.checked)}
            />
          }
          label={t('Exclude')}
        />
      </td>
    </tr>
  )
}

export default GenreSettingDialog
