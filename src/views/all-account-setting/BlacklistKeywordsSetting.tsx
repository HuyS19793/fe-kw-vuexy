'use client'

import type { KeyboardEvent } from 'react'
import { useState } from 'react'

import { Box, Button, Card, CardContent, CardHeader, Chip, Divider } from '@mui/material'

import { useTranslations } from 'next-intl'

import CustomTextField from '@/@core/components/mui/TextField'
import ConfirmDialogComponent from '@/components/ConfirmDialogComponent'
import { addKeyword, deleteKeyword } from '@/actions/all-account-setting'
import type { BlacklistKeywordType } from '@/types/keywordType'
import { useSettingActions } from '@/hooks/useSettingActions'

const BlacklistKeywordsSetting = ({ data }: { data: BlacklistKeywordType[] }) => {
  // *** HOOKS ***
  const t = useTranslations()

  // *** STATE ***
  const [inputValue, setInputValue] = useState('')
  const [confirmButtonText, setConfirmButtonText] = useState('Agree')
  const { confirmDialog, closeConfirmDialog, handleApiAction, confirmAction } = useSettingActions()

  // *** FUNCTIONS ***
  const handleAddKeyword = () => {
    const trimmedValue = inputValue.trim()

    const keywordExists = data.find(keyword => keyword.value === trimmedValue)

    if (trimmedValue && !keywordExists) {
      setConfirmButtonText('Exclude')

      confirmAction('add-keyword', 'Confirm Changes', 'Are you sure you want to add this keyword?', async () => {
        handleApiAction(
          async () => await addKeyword(trimmedValue),
          'Keyword added successfully',
          'Failed to add keyword'
        )

        setInputValue('')
      })
    }
  }

  const handleDeleteKeyword = (id: string) => {
    setConfirmButtonText('Agree')

    confirmAction('delete-keyword', 'Confirm Changes', 'Are you sure you want to delete this keyword?', async () => {
      handleApiAction(async () => await deleteKeyword(id), 'Keyword deleted successfully', 'Failed to delete keyword')
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  return (
    <>
      <Card>
        {/* Add spacing between Card sections */}
        <CardHeader title={t('Exclude Keywords')} />
        <CardContent className='space-y-2'>
          {/* Add spacing between CardContent sections */}
          <Box className='flex items-center mb-4'>
            {/* Increase bottom margin */}
            <CustomTextField
              placeholder={t('Input keyword and press Enter to add')}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className='flex-grow mr-2' // Tailwind CSS classes
            />
            <Button
              variant='contained'
              color='primary'
              endIcon={<i className='tabler-icon tabler-plus' />}
              onClick={handleAddKeyword}
              className='ml-2'
            >
              {t('Add')}
            </Button>
          </Box>
          <Divider className='my-4' /> {/* Tailwind CSS class */}
          <Box className='flex flex-wrap gap-3 mt-10'>
            {/* Increase gap between chips */}
            {data.map(keyword => (
              <Chip
                key={keyword.id}
                label={keyword.value}
                color='primary'
                variant='outlined'
                onDelete={() => handleDeleteKeyword(keyword.id)}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <ConfirmDialogComponent
        confirmDialog={confirmDialog}
        onClose={closeConfirmDialog}
        confirmButtonText={confirmButtonText}
      />
    </>
  )
}

export default BlacklistKeywordsSetting
