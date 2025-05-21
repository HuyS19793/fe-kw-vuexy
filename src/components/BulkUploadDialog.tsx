// components/BulkUploadDialog.tsx
import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Typography, Box } from '@mui/material'
import { useTranslations } from 'next-intl'

import GenreKeywordTab from './tabs/GenreKeywordTab'
import KwFilteringTab from './tabs/KwFilteringTab'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import type { UploadTabType } from '@/types/bulkUpload'

interface BulkUploadDialogProps {
  open: boolean
  onClose: () => void
  accountName: string
  accountId: string
  onUploadSuccess: (tabType: UploadTabType) => void
}

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
}

const TabPanel: React.FC<TabPanelProps> = props => {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onClose,
  accountName,
  accountId,
  onUploadSuccess
}) => {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState<number>(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle className='pr-10'>
        <Typography variant='h6'>
          {t('bulkSettingsUpload')} - {accountName} ({accountId})
        </Typography>
        <DialogCloseButton onClick={onClose}>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent className='min-h-[400px]'>
        <Tabs value={activeTab} onChange={handleTabChange} className='mb-6' aria-label='bulk upload tabs'>
          <Tab label={t('kwFilteringHolidayExecution')} id='tab-kw-filtering' aria-controls='tabpanel-kw-filtering' />
          <Tab label={t('genreKeywordSettings')} id='tab-genre-keyword' aria-controls='tabpanel-genre-keyword' />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <KwFilteringTab accountId={accountId} accountName={accountName} onUploadSuccess={onUploadSuccess} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <GenreKeywordTab accountId={accountId} accountName={accountName} onUploadSuccess={onUploadSuccess} />
        </TabPanel>
      </DialogContent>
    </Dialog>
  )
}

export default BulkUploadDialog
