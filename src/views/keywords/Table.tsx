'use client'

import { useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

import moment from 'moment'

import { Chip } from '@mui/material'

import type { GenreKeywordType, TrendKeywordTableProps } from '@/types/keywordType'
import DataTableComponent from '@/components/DataTableComponent'
import ExportButton from './ExportButton'

const GenreKeywordTable = ({ data }: { data: TrendKeywordTableProps }) => {
  // *** Column Definitions ***
  const columns = useMemo<ColumnDef<GenreKeywordType, any>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Keyword',
        cell: info => info.getValue()
      },
      {
        accessorKey: 'genre',
        header: 'Genre',
        cell: info => <Chip label={info.getValue()} color='primary' size='small' />
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: info => moment(info.getValue()).format('YYYY-MM-DD HH:mm')
      }
    ]
  }, [])

  return (
    <>
      <DataTableComponent columns={columns} rows={data.data} count={data.count} TableActionComponent={ExportButton} />
    </>
  )
}

export default GenreKeywordTable
