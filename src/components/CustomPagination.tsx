'use client'

import { useEffect, useState } from 'react'

import type { Theme } from '@mui/material'
import { Select, MenuItem, FormControl, InputLabel, Tooltip, useMediaQuery } from '@mui/material'
import { useTranslations } from 'next-intl'

import { useSettings } from '@/@core/hooks/useSettings'
import CustomIconButton from '@/@core/components/mui/IconButton'

interface CustomPaginationProps {
  count: number
  page: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
  onPageChange: (event: unknown, newPage: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
  disabled = false
}: CustomPaginationProps) => {
  // console.log('CustomPagination', page)

  const t = useTranslations()
  const { settings } = useSettings()
  const isDarkMode = settings.mode === 'dark'
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [pageOptions, setPageOptions] = useState<number[]>([])
  const totalPages = Math.ceil(count / rowsPerPage)

  // Calculate visible page numbers
  useEffect(() => {
    const generatePageOptions = () => {
      // Always show first page, last page, current page and some pages around current
      const visiblePages = new Set<number>()

      // Always add first and last page
      visiblePages.add(0) // First page (0-based index)

      if (totalPages > 1) {
        visiblePages.add(totalPages - 1) // Last page
      }

      // Add current page and pages around it
      for (let i = Math.max(0, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
        visiblePages.add(i)
      }

      // Convert to array and sort
      return Array.from(visiblePages).sort((a, b) => a - b)
    }

    setPageOptions(generatePageOptions())
  }, [page, totalPages, rowsPerPage])

  const handleSelectPage = (event: React.ChangeEvent<{ value: unknown }>) => {
    onPageChange(event, Number(event.target.value))
  }

  const handlePrevPage = () => {
    if (page > 0) {
      onPageChange(null, page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(null, page + 1)
    }
  }

  const handleFirstPage = () => {
    onPageChange(null, 0)
  }

  const handleLastPage = () => {
    onPageChange(null, totalPages - 1)
  }

  // Format functions to handle display text
  const getDisplayedRecordsText = () => {
    if (count === 0) return t('0 records')

    return t('{start}-{end} of {total}', {
      start: page * rowsPerPage + 1,
      end: Math.min((page + 1) * rowsPerPage, count),
      total: count
    })
  }

  return (
    <div
      className={`
        p-4 border-t
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        ${isMobile ? 'flex flex-col space-y-4' : 'flex items-center justify-between'}
      `}
    >
      {/* Rows per page & Info - Left side or top on mobile */}
      <div className={`flex ${isMobile ? 'flex-col space-y-3 w-full' : 'items-center space-x-4'}`}>
        <FormControl variant='outlined' size='small' className={isMobile ? 'w-full' : 'min-w-[140px]'}>
          <InputLabel id='rows-per-page-label'>{t('Rows per page')}</InputLabel>
          <Select
            labelId='rows-per-page-label'
            id='rows-per-page-select'
            value={rowsPerPage}
            onChange={onRowsPerPageChange as any}
            label={t('Rows per page')}
            disabled={disabled}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200
                }
              }
            }}
          >
            {rowsPerPageOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ${isMobile ? 'text-center' : ''}`}>
          {getDisplayedRecordsText()}
        </div>
      </div>

      {/* Page navigation - Right side or bottom on mobile */}
      <div className={`flex items-center ${isMobile ? 'justify-center w-full' : 'space-x-2'}`}>
        {/* First page button */}
        <Tooltip title={t('First page')}>
          <span>
            <CustomIconButton
              onClick={handleFirstPage}
              disabled={page === 0 || disabled}
              size='small'
              color='primary'
              aria-label={t('First page')}
              className={isDarkMode ? 'text-blue-400' : ''}
            >
              <i className='tabler-chevron-left-pipe' />
            </CustomIconButton>
          </span>
        </Tooltip>

        {/* Previous page button */}
        <Tooltip title={t('Previous page')}>
          <span>
            <CustomIconButton
              onClick={handlePrevPage}
              disabled={page === 0 || disabled}
              size='small'
              color='primary'
              aria-label={t('Previous page')}
              className={isDarkMode ? 'text-blue-400' : ''}
            >
              <i className='tabler-chevron-left' />
            </CustomIconButton>
          </span>
        </Tooltip>

        {/* Page selector */}
        <FormControl variant='outlined' size='small' className='min-w-[80px] mx-1'>
          <Select
            value={page}
            onChange={handleSelectPage as any}
            disabled={disabled}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300
                }
              }
            }}
            className={isDarkMode ? 'bg-gray-800 text-white' : ''}
          >
            {pageOptions.map(pageOption => {
              // Add ellipsis indicators
              const needsLeftEllipsis = pageOption > 0 && !pageOptions.includes(pageOption - 1)
              const needsRightEllipsis = pageOption < totalPages - 1 && !pageOptions.includes(pageOption + 1)

              return (
                <MenuItem key={pageOption} value={pageOption}>
                  {needsLeftEllipsis ? '... ' : ''}
                  {pageOption + 1}
                  {needsRightEllipsis ? ' ...' : ''}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        {/* Next page button */}
        <Tooltip title={t('Next page')}>
          <span>
            <CustomIconButton
              onClick={handleNextPage}
              disabled={page >= totalPages - 1 || disabled}
              size='small'
              color='primary'
              aria-label={t('Next page')}
              className={isDarkMode ? 'text-blue-400' : ''}
            >
              <i className='tabler-chevron-right' />
            </CustomIconButton>
          </span>
        </Tooltip>

        {/* Last page button */}
        <Tooltip title={t('Last page')}>
          <span>
            <CustomIconButton
              onClick={handleLastPage}
              disabled={page >= totalPages - 1 || disabled}
              size='small'
              color='primary'
              aria-label={t('Last page')}
              className={isDarkMode ? 'text-blue-400' : ''}
            >
              <i className='tabler-chevron-right-pipe' />
            </CustomIconButton>
          </span>
        </Tooltip>
      </div>

      {/* Mobile view pages info - makes it more visible */}
      {isMobile && (
        <div className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {t('Page {current} of {total}', { current: page + 1, total: totalPages })}
        </div>
      )}
    </div>
  )
}

export default CustomPagination
