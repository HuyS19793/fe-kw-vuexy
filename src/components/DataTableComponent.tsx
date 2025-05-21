'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import type { TextFieldProps } from '@mui/material'
import { Card } from '@mui/material'
import type { Column, FilterFn } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import classNames from 'classnames'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import { useTranslations } from 'next-intl'

import CustomTextField from '@/@core/components/mui/TextField'
import ChevronRight from '@/@menu/svg/ChevronRight'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useLoading } from '@/contexts/loadingContext'
import TableLoader from './TableLoader'
import CustomPagination from './CustomPagination'

// Style Imports
import styles from '@core/styles/table.module.css'
import { useSettings } from '@/@core/hooks/useSettings'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  alertMessage = '',
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  disabled?: boolean
  alertMessage?: string
} & TextFieldProps) => {
  // States
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const onSearch = () => {
    const value = inputRef.current?.value

    if (value !== undefined) {
      onChange(value)
    }
  }

  return (
    <div className='flex flex-col'>
      {alertMessage && <p className='mb-2 text-red-500'>{alertMessage}</p>}
      <div className='flex gap-2'>
        <CustomTextField {...props} ref={inputRef} defaultValue={value} />
        <CustomIconButton
          aria-label='search'
          color='primary'
          variant='contained'
          onClick={onSearch}
          disabled={props.disabled}
        >
          <i className='tabler-search' />
        </CustomIconButton>
      </div>
    </div>
  )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

type DataTableComponentProps = {
  rows: any[]
  count?: number
  columns: any[]
  columnPinnings?: string[]
  isDataChanged?: boolean
  onReset?: () => void
  onSubmit?: () => void
  tableMeta?: any
  TableActionComponent?: React.FC
  alertMessage?: string
}

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = (column: Column<any>, isDarkMode: boolean): CSSProperties => {
  const isPinned = column.getIsPinned()

  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px rgba(0, 0, 0, 0.5) inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px rgba(0, 0, 0, 0.5) inset'
        : '0 2px 6px rgba(0, 0, 0, 0.2)', // General shadow for other columns
    backgroundColor: isPinned === 'left' ? (isDarkMode ? 'rgb(37, 41, 60)' : 'rgb(245, 245, 245)') : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(), 
    zIndex: isPinned ? 1 : 0
  }
}

const DataTableComponent = ({
  rows = [],
  count = 0,
  columns = [],
  columnPinnings = [],
  tableMeta = {},
  TableActionComponent = () => null,
  alertMessage = ''
}: DataTableComponentProps) => {
  // *** Hooks ***
  const t = useTranslations()
  const searchParams = useSearchParams()
  const { settings } = useSettings()
  const { isPending, updateSearchParams } = useLoading()

  // *** VARIABLES ***
  const isDarkMode = settings.mode === 'dark'
  const search = searchParams.get('search') || ''
  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) - 1 : 0
  const rowsPerPage = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : 10

  const table = useReactTable({
    data: rows,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    initialState: {
      columnPinning: {
        left: columnPinnings,
        right: []
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: tableMeta
  })

  // *** FUNCTIONS ***
  const handleSearch = (value: string) => {
    if (value === search) return

    updateSearchParams({
      search: value || null,
      page: value ? '1' : null // Reset to page 1 on new search
    })
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    updateSearchParams({
      page: String(newPage + 1)
    })
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    updateSearchParams({
      limit: value,
      page: '1' // Reset to first page when changing rows per page
    })
  }

  // *** RENDER ***
  return (
    <Card>
      <div className='flex items-center justify-between p-4 border-b border-primaryLight'>
        <DebouncedInput
          value={search}
          onChange={value => handleSearch(String(value))}
          placeholder={t('Search all columns')}
          disabled={isPending}
          alertMessage={alertMessage}
        />
        <TableActionComponent />
      </div>

      <div className='relative'>
        {/* Beautiful loading overlay */}
        {isPending && <TableLoader isDarkMode={isDarkMode} />}

        <div className='overflow-auto max-h-[600px]'>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const { column } = header

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ ...getCommonPinningStyles(column, isDarkMode) }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={classNames('whitespace-nowrap font-bold', {
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(t(header.column.columnDef.header), header.getContext())}
                            {{
                              asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                              desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {t('No data available')}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => {
                        const { column } = cell

                        return (
                          <td key={cell.id} style={{ ...getCommonPinningStyles(column, isDarkMode) }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Replace TablePagination with CustomPagination */}
        <CustomPagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          count={count || table.getFilteredRowModel().rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          disabled={isPending}
        />
      </div>
    </Card>
  )
}

export default DataTableComponent
