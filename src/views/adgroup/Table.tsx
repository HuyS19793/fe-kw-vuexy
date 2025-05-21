'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import type { ColumnDef } from '@tanstack/react-table'

import ExcludeKeywordCell from './cells/ExcludeKeywordCell'
import IncludeKeywordCell from './cells/IncludeKeywordCell'
import SettingGenreCell from './cells/SettingGenreCell'
import KeywordSubmissionCell from './cells/KeywordSubmissionCell'
import ExcludedGenreCell from './cells/ExcludedGenreCell'

// Type Imports
import type { AdgroupSettingTableProps, AdgroupSettingType } from '@/types/adgroupType'

// Dialog Imports
import GenreSettingDialog from './dialog/GenreSettingDialog'
import KeywordSettingDialog from './dialog/KeywordSettingDialog'
import DataTableComponent from '@/components/DataTableComponent'
import ConfirmDialogComponent from '@/components/ConfirmDialogComponent'
import { createAdgroupSetting, updateAdgroupSetting } from '@/actions/adgroup-setting'
import { useDialogControl } from '@/hooks/useDialogControl'
import { DIALOG } from '@/utils/setting'
import { useTableRows } from '@/hooks/useTableRows'
import { useSettingActions } from '@/hooks/useSettingActions'
import { createAdgroupTableMeta } from '@/factories/adgroupTableMetaFactory'
import AdgroupNameCell from './cells/AdgroupNameCell'

declare module '@tanstack/table-core' {
  interface TableMeta<TData> {
    openSettingGenre?: (row: TData) => void
    deleteGenre?: (row: TData, genre: string, type: 'genres' | 'excludedGenres') => void
    openSettingKeyword?: (row: TData) => void
    deleteKeyword?: (row: TData, keyword: string, type: 'includeKeywords' | 'excludeKeywords') => void
    toggleKeywordSubmission?: (row: TData, value: boolean) => void
  }
}

const AdgroupSettingTable = ({ data }: { data: AdgroupSettingTableProps }) => {
  // Hooks
  const { handleApiAction, confirmAction, confirmDialog, closeConfirmDialog } = useSettingActions()

  const { rows, rowSelected, setRowSelected } = useTableRows<AdgroupSettingType>(data.data)

  const { toggleDialog, isDialogOpen } = useDialogControl()

  // Table Columns
  const columns = useMemo<ColumnDef<AdgroupSettingType, any>[]>(() => {
    return [
      {
        accessorKey: 'isKeywordSubmission',
        cell: KeywordSubmissionCell,
        header: 'Keyword Submission',
        size: 132
      },
      {
        accessorKey: 'adgroupId',
        cell: info => info.getValue(),
        header: 'AdGroup ID',
        size: 123
      },
      {
        accessorKey: 'adgroupName',
        cell: AdgroupNameCell,
        header: 'AdGroup Name'
      },
      {
        accessorKey: 'campaignName',
        cell: info => info.getValue(),
        header: 'Campaign Name'
      },
      {
        accessorKey: 'genres',
        accessorFn: row => row.genres.join(', '),
        cell: SettingGenreCell,
        header: 'Setting Genre'
      },
      {
        accessorKey: 'excludedGenres',
        accessorFn: row => row.excludedGenres.join(', '),
        cell: ExcludedGenreCell,
        header: 'Excluded Genre'
      },
      {
        accessorKey: 'includeKeywords',
        accessorFn: row => row.includeKeywords.join(', '),
        cell: IncludeKeywordCell,
        header: 'Include Default Keywords'
      },
      {
        accessorKey: 'excludeKeywords',
        accessorFn: row => row.excludeKeywords.join(', '),
        cell: ExcludeKeywordCell,
        header: 'Exclude Default Keywords'
      }
    ]
  }, [])

  // Table Meta
  const tableMeta = createAdgroupTableMeta({
    setRowSelected,
    toggleDialog,
    confirmAction,
    handleApiAction
  })

  // Handlers
  const handleSaveGenreSetting = (genreSetting: { include: string[]; exclude: string[] }) => {
    if (!rowSelected) {
      toggleDialog(DIALOG.GENRE_SETTING)

      return
    }

    confirmAction(rowSelected.id, 'Save Genre Setting?', 'Are you sure you want to save the changes?', () => {
      const dataSubmit = {
        id: rowSelected.adgroupSettingId,
        adgroup: rowSelected.adgroupId,
        campaign_id: rowSelected.campaignId,
        genre_include: genreSetting.include,
        genre_exclude: genreSetting.exclude
      }

      handleApiAction(
        async () => (dataSubmit.id ? await updateAdgroupSetting(dataSubmit) : await createAdgroupSetting(dataSubmit)),
        'Genre Setting has been successfully updated',
        'Failed to update Genre Setting'
      )

      toggleDialog(DIALOG.GENRE_SETTING)
    })
  }

  const handleSaveKeywordSetting = (keywordSetting: { include: string[]; exclude: string[] }) => {
    if (!rowSelected) {
      toggleDialog(DIALOG.KEYWORD_SETTING)

      return
    }

    confirmAction(rowSelected.id, 'Save Keyword Setting?', 'Are you sure you want to save the changes?', () => {
      const dataSubmit = {
        id: rowSelected.adgroupSettingId,
        adgroup: rowSelected.adgroupId,
        campaign_id: rowSelected.campaignId,
        keyword_include_default: keywordSetting.include,
        keyword_exclude_default: keywordSetting.exclude
      }

      handleApiAction(
        async () => (dataSubmit.id ? await updateAdgroupSetting(dataSubmit) : await createAdgroupSetting(dataSubmit)),
        'Keyword Setting has been successfully updated',
        'Failed to update Keyword Setting'
      )

      toggleDialog(DIALOG.KEYWORD_SETTING)
    })
  }

  // *** RENDER ***
  return (
    <>
      <DataTableComponent
        rows={rows}
        count={data.count}
        columns={columns}
        tableMeta={tableMeta}
        columnPinnings={['isKeywordSubmission', 'adgroupId', 'adgroupName']}
      />

      <GenreSettingDialog
        data={rowSelected}
        openDialog={isDialogOpen(DIALOG.GENRE_SETTING)}
        onClose={() => toggleDialog(DIALOG.GENRE_SETTING)}
        onSave={handleSaveGenreSetting}
      />

      <KeywordSettingDialog
        data={rowSelected}
        openDialog={isDialogOpen(DIALOG.KEYWORD_SETTING)}
        onClose={() => toggleDialog(DIALOG.KEYWORD_SETTING)}
        onSave={handleSaveKeywordSetting}
      />

      <ConfirmDialogComponent confirmDialog={confirmDialog} onClose={closeConfirmDialog} />
    </>
  )
}

export default AdgroupSettingTable
