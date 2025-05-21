'use client'

// Core imports
import { useRef, useState, useMemo, useEffect } from 'react'

import { useTranslations } from 'next-intl'

// MUI components
import { Button, Chip, Divider, FormGroup, Grid } from '@mui/material'

// Custom components
import CustomTextField from '@/@core/components/mui/TextField'
import DialogComponent from '@/components/DialogComponent'

// Types
import type { AdgroupSettingType } from '@/types/adgroupType'

interface KeywordSettingDialogProps {
  openDialog: boolean
  onClose: () => void
  data: AdgroupSettingType | null
  onSave: (keywordSetting: KeywordSetting) => void
}

interface KeywordSetting {
  include: string[]
  exclude: string[]
}

/**
 * Dialog component for managing keyword inclusion and exclusion settings
 */
const KeywordSettingDialog = ({ openDialog, onClose, data, onSave }: KeywordSettingDialogProps) => {
  // Hooks
  const t = useTranslations()

  // Refs
  const includeKeywordRef = useRef<HTMLInputElement>(null)
  const excludeKeywordRef = useRef<HTMLInputElement>(null)

  // State
  const [keywordSetting, setKeywordSetting] = useState<KeywordSetting>({
    include: [],
    exclude: []
  })

  // Initialize keywords when dialog opens with data
  useEffect(() => {
    if (openDialog && data) {
      setKeywordSetting({
        include: data.includeKeywords || [],
        exclude: data.excludeKeywords || []
      })
    }
  }, [data, openDialog])

  // Memoized derived state
  const { overlappingKeywords, hasOverlap, isDataChanged } = useMemo(() => {
    // Find keywords that appear in both include and exclude lists
    const overlapping = keywordSetting.include.filter(keyword => keywordSetting.exclude.includes(keyword))

    // Determine if data has changed from the original
    const hasChanged = data
      ? JSON.stringify(data.includeKeywords) !== JSON.stringify(keywordSetting.include) ||
        JSON.stringify(data.excludeKeywords) !== JSON.stringify(keywordSetting.exclude)
      : false

    return {
      overlappingKeywords: overlapping,
      hasOverlap: overlapping.length > 0,
      isDataChanged: hasChanged
    }
  }, [keywordSetting, data])

  // Exit early if no data is provided
  if (!data) return null

  // Handlers
  const addKeyword = (value: string, type: 'include' | 'exclude'): boolean => {
    const trimmedValue = value.trim()

    if (trimmedValue && !keywordSetting[type].includes(trimmedValue)) {
      setKeywordSetting(prev => ({
        ...prev,
        [type]: [...prev[type], trimmedValue]
      }))

      return true
    }

    return false
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, type: 'include' | 'exclude') => {
    if (e.key === 'Enter') {
      const ref = type === 'include' ? includeKeywordRef : excludeKeywordRef

      if (ref.current && addKeyword(ref.current.value, type)) {
        ref.current.value = ''
      }
    }
  }

  const handleAddButton = (type: 'include' | 'exclude') => {
    const ref = type === 'include' ? includeKeywordRef : excludeKeywordRef

    if (ref.current && addKeyword(ref.current.value, type)) {
      ref.current.value = ''
    }
  }

  const handleDelete = (keyword: string, type: 'include' | 'exclude') => {
    setKeywordSetting(prev => ({
      ...prev,
      [type]: prev[type].filter(k => k !== keyword)
    }))
  }

  const handleClearAll = () => {
    setKeywordSetting({ include: [], exclude: [] })
  }

  // UI Components
  const renderKeywordSection = (type: 'include' | 'exclude', label: string, color: 'primary' | 'secondary') => {
    const ref = type === 'include' ? includeKeywordRef : excludeKeywordRef

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className='flex items-end is-full flex-wrap sm:flex-nowrap gap-4 min-w-[500px]'>
            <FormGroup className='w-full'>
              <CustomTextField
                ref={ref}
                fullWidth
                label={t(label)}
                InputLabelProps={{
                  className: `font-semibold text-${color}`
                }}
                placeholder={t('Input keyword and press Enter to add')}
                onKeyDown={e => handleKeyPress(e, type)}
                color={color}
                autoFocus={type === 'include'}
              />
            </FormGroup>
            <div className='min-w-[100px] flex justify-end'>
              <Button variant='outlined' color={color} className='w-full' onClick={() => handleAddButton(type)}>
                {t('Add')}
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className='flex gap-3 flex-wrap'>
          {keywordSetting[type].map(keyword => (
            <Chip
              key={keyword}
              label={keyword}
              variant='tonal'
              color={overlappingKeywords.includes(keyword) ? 'error' : color}
              onDelete={() => handleDelete(keyword, type)}
              deleteIcon={<i className='tabler-trash-x' />}
            />
          ))}
        </Grid>
      </Grid>
    )
  }

  const isButtonDisabled = keywordSetting.include.length === 0 && keywordSetting.exclude.length === 0

  return (
    <DialogComponent
      open={openDialog}
      onClose={onClose}
      title={t('Keyword Setting')}
      Body={
        <>
          {renderKeywordSection('include', 'Include Keywords', 'primary')}
          <Divider className='my-4' />
          {renderKeywordSection('exclude', 'Exclude Keywords', 'secondary')}
        </>
      }
      ExtraActions={
        <Button color='error' variant='outlined' onClick={handleClearAll} disabled={isButtonDisabled}>
          {t('Clear All')}
        </Button>
      }
      Actions={
        <Button
          variant='contained'
          endIcon={<i className='tabler-device-floppy' />}
          onClick={() => onSave(keywordSetting)}
          disabled={!isDataChanged || hasOverlap}
        >
          {t('Save')}
        </Button>
      }
    />
  )
}

export default KeywordSettingDialog
