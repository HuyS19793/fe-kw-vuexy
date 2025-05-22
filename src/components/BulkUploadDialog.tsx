// components/BulkUploadDialog.tsx
import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Chip
} from '@mui/material'
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
  onUpload: (file: File) => Promise<void>
  isLoading: boolean
  onCancel: () => void
}

const TabPanel: React.FC<TabPanelProps> = props => {
  const { children, value, index, onUpload, isLoading, onCancel, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      className='h-full'
    >
      {value === index && <Box className='pt-4 h-full'>{children}</Box>}
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
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const [resetFunctions, setResetFunctions] = useState<{
    kwFiltering?: () => void
    genreKeyword?: () => void
  }>({})

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setActiveTab(newValue)
  }

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate success
      onUploadSuccess(activeTab === 0 ? 'KW Filtering' : 'Genre Keyword')
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    // Reset all states before closing
    if (resetFunctions.kwFiltering) {
      resetFunctions.kwFiltering()
    }

    if (resetFunctions.genreKeyword) {
      resetFunctions.genreKeyword()
    }

    // Clear selected file
    setSelectedFile(null)

    // Close dialog
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
      fullScreen={isSmallScreen}
      scroll='paper'
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
          height: isSmallScreen ? '100%' : '90vh'
        }
      }}
    >
      {/* Enhanced Header with Prominent Account Info */}
      <DialogTitle className='pr-10 pb-2'>
        <Box className='flex justify-between items-start'>
          <Box>
            <Typography variant='h6' component='div' className='flex items-center mb-1'>
              <i className='tabler-upload text-primary-500 text-xl mr-2' />
              {t('bulkSettingsUpload')}
            </Typography>

            {/* Enhanced Account Information */}
            <Box
              className='mt-1 p-2 rounded-md flex items-center'
              sx={{
                bgcolor: theme.palette.primary.main + '10',
                border: `1px solid ${theme.palette.primary.main}30`
              }}
            >
              <i className='tabler-building text-primary-600 text-lg mr-2' />
              <div>
                <Typography variant='subtitle1' component='span' className='font-semibold' color='primary'>
                  {accountName}
                </Typography>
                <Chip
                  size='small'
                  label={accountId}
                  variant='outlined'
                  color='primary'
                  className='ml-2'
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </div>
            </Box>
          </Box>
        </Box>
        <DialogCloseButton onClick={handleClose}>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label='bulk upload tabs'
        className='border-b px-6'
        variant='fullWidth'
      >
        <Tab
          label={t('kwFilteringHolidayExecution')}
          id='tab-kw-filtering'
          aria-controls='tabpanel-kw-filtering'
          icon={<i className='tabler-filter-check text-lg' />}
          iconPosition='start'
        />
        <Tab
          label={t('genreKeywordSettings')}
          id='tab-genre-keyword'
          aria-controls='tabpanel-genre-keyword'
          icon={<i className='tabler-category text-lg' />}
          iconPosition='start'
        />
      </Tabs>

      <DialogContent className='h-[calc(100%-180px)] p-0'>
        {' '}
        {/* Adjusted for bottom action bar */}
        <div className='h-full overflow-auto px-6 py-4'>
          <TabPanel value={activeTab} index={0} onUpload={handleUpload} isLoading={isUploading} onCancel={handleClose}>
            <KwFilteringTab
              accountId={accountId}
              accountName={accountName}
              onUploadSuccess={onUploadSuccess}
              onFileSelected={handleFileSelect}
              hideUploadButton={true}
              registerResetFunction={resetFn => {
                setResetFunctions(prev => ({ ...prev, kwFiltering: resetFn }))
              }}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1} onUpload={handleUpload} isLoading={isUploading} onCancel={handleClose}>
            <GenreKeywordTab
              accountId={accountId}
              accountName={accountName}
              onUploadSuccess={onUploadSuccess}
              registerResetFunction={resetFn => {
                setResetFunctions(prev => ({ ...prev, genreKeyword: resetFn }))
              }}
            />
          </TabPanel>
        </div>
      </DialogContent>

      {/* Bottom Action Bar with Upload and Cancel Buttons */}
      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          padding: 2,
          justifyContent: 'flex-end',
          gap: 2
        }}
      >
        <Button variant='outlined' onClick={handleClose} startIcon={<i className='tabler-x' />}>
          {t('Cancel')}
        </Button>
        <Button
          variant='contained'
          color='primary'
          disabled={!selectedFile || isUploading}
          onClick={handleUpload}
          startIcon={isUploading ? null : <i className='tabler-upload' />}
          sx={{ minWidth: 120 }}
        >
          {isUploading ? (
            <>
              <span className='mr-2'>{t('Uploading')}</span>
              <span className='animate-pulse'>...</span>
            </>
          ) : (
            t('Upload')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BulkUploadDialog
