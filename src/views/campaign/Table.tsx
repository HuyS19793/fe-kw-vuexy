// views/campaign/Table.tsx
'use client'

// React Imports
import { useMemo, useState } from 'react'

// Next Imports
import { useParams, useSearchParams } from 'next/navigation'

import type { ColumnDef } from '@tanstack/react-table'

import { useRouter } from 'nextjs-toploader/app'

import { Button } from '@mui/material'

import { useTranslations } from 'next-intl'

import { uid } from 'uid'

import moment from 'moment'

import { toast } from 'react-toastify'

import InspectionConditionCell from './cells/InspectionConditionCell'
import HolidaySuspensionCell from './cells/HolidaySuspensionCell'
import KeywordSettingStatusCell from './cells/KeywordSettingStatusCell'

// Type Imports
import type {
  CampaignSettingDataType,
  CampaignSettingTableProps,
  CampaignSettingType,
  inspectionConditionSettingType
} from '@/types/campaignType'
import type { UploadTabType } from '@/types/bulkUpload'

// Dialog Imports
import InspectionConditionDialog from './dialog/InspectionConditionDialog'
import DataTableComponent from '@/components/DataTableComponent'
import ConfirmDialogComponent from '@/components/ConfirmDialogComponent'
import { updateCampaignSetting, createCampaignSetting, deleteCampaignSetting } from '@/actions/campaign-setting'
import { createCampaignTableMeta } from '@/factories/campaignTableMetaFactory'
import { useSettingActions } from '@/hooks/useSettingActions'
import { useTableRows } from '@/hooks/useTableRows'
import { useDialogControl } from '@/hooks/useDialogControl'
import { DIALOG } from '@/utils/setting'
import { syncAccountX } from '@/actions/sync'

// Bulk Upload Components
import BulkUploadButton from '@/components/BulkUploadButton'
import BulkUploadDialog from '@/components/BulkUploadDialog'

declare module '@tanstack/table-core' {
  interface TableMeta<TData> {
    navigateAdgroupSettingPage?: (row: TData) => void
    toggleHolidaySuspension?: (row: TData, value: 'ON' | 'OFF') => void
    openInspectionConditionDialog?: (row: TData) => void
  }
}

interface CampaignSettingTableComponentProps {
  data: CampaignSettingTableProps
  accountId: string | null
  accountName: string | null
}

const CampaignSettingTable: React.FC<CampaignSettingTableComponentProps> = ({ data, accountId, accountName }) => {
  // *** HOOKS ***
  const t = useTranslations()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { isPending, confirmDialog, closeConfirmDialog, handleApiAction, confirmAction } = useSettingActions()
  const { rows, rowSelected, setRowSelected } = useTableRows<CampaignSettingType>(data.data)
  const { isDialogOpen, toggleDialog } = useDialogControl()

  // *** STATE ***
  const [isSyncSubmitted, setIsSyncSubmitted] = useState<boolean>(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState<boolean>(false)

  const [alertMessage, setAlertMessage] = useState<string>(
    'キャンペーンと広告グループ情報が同期されていません。データ同期を押してください。'
  )

  // *** VARIABLES ***
  const canSync = data.canSync && accountId && !isSyncSubmitted

  // *** COLUMNS ***
  const columns = useMemo<ColumnDef<CampaignSettingType, any>[]>(() => {
    return [
      {
        accessorKey: 'id',
        header: 'Campaign ID',
        cell: info => info.getValue()
      },
      {
        accessorKey: 'name',
        header: 'Campaign Name',
        cell: info => info.getValue()
      },
      {
        accessorKey: 'isKeywordsSet',
        header: 'Adgroup Setting',
        cell: KeywordSettingStatusCell
      },
      {
        accessorKey: 'inspectionCondition',
        header: 'Inspection Condition',
        cell: InspectionConditionCell
      },
      {
        accessorKey: 'holidaySuspension',
        header: 'Holiday Suspension',
        cell: HolidaySuspensionCell
      }
    ]
  }, [])

  // Example usage:
  const tableMeta = createCampaignTableMeta({
    router,
    locale: locale as string,
    accountId,
    setRowSelected,
    toggleDialog,
    confirmAction,
    handleApiAction
  })

  // *** HANDLERS ***
  const handleSaveInspectionCondition = (setting: inspectionConditionSettingType): void => {
    if (!rowSelected || !accountId) return

    confirmAction(rowSelected.id, 'Save Inspection Condition?', 'Are you sure you want to save the changes?', () => {
      const dataSubmit = {
        id: rowSelected.campaignSettingId,
        account_id: accountId,
        campaign: rowSelected.id,
        formula_name: setting.name,
        avg_comparison_gte_1: setting.performanceAboveOne,
        avg_comparison_eq_0: setting.performanceZero,
        avg_performance_period: setting.calculationPeriod
      } as CampaignSettingDataType

      handleApiAction(
        async () => (dataSubmit.id ? await updateCampaignSetting(dataSubmit) : await createCampaignSetting(dataSubmit)),
        'Inspection Condition has been successfully updated',
        'Failed to update Inspection Condition'
      )

      toggleDialog(DIALOG.INSPECTION_CONDITION)
    })
  }

  const handleDeleteInspectionCondition = (): void => {
    if (!rowSelected) return

    confirmAction(
      rowSelected.id,
      'Delete Inspection Condition?',
      'Are you sure you want to delete the Inspection Condition?',
      () => {
        handleApiAction(
          async () => await deleteCampaignSetting(rowSelected.campaignSettingId),
          'Inspection Condition has been successfully deleted',
          'Failed to delete Inspection Condition'
        )

        toggleDialog(DIALOG.INSPECTION_CONDITION)
      }
    )
  }

  const handleRefetchData = (): void => {
    if (!accountId) return

    confirmAction(accountId || uid(), 'Refetch Data?', 'Are you sure you want to refetch the data?', () => {
      handleApiAction(
        async () => await syncAccountX(accountId),
        'Data has been successfully refetched',
        'Failed to refetch data',
        () => {
          setIsSyncSubmitted(true)
          setAlertMessage(`${moment().format('MM/DD HH:mm')}にデータの同期が完了しました。`)
        }
      )
    })
  }

  // Bulk Upload handlers
  const handleBulkUploadOpen = (): void => {
    setBulkUploadOpen(true)
  }

  const handleBulkUploadClose = (): void => {
    setBulkUploadOpen(false)
  }

  const handleUploadSuccess = (type: UploadTabType): void => {
    toast.success(t('settingsUpdateSuccess'))
    setBulkUploadOpen(false)

    // Refresh the data after successful upload
    router.refresh()
  }

  // *** RENDER ***
  return (
    <>
      <DataTableComponent
        rows={rows}
        count={data.count}
        columns={columns}
        tableMeta={tableMeta}
        alertMessage={data.canSync && accountId ? alertMessage : ''}
        TableActionComponent={() => (
          <div className='flex gap-4'>
            {canSync && (
              <Button
                variant='contained'
                color='primary'
                startIcon={<i className='tabler-refresh' />}
                onClick={handleRefetchData}
                disabled={isPending}
              >
                {t('Refetch Data')}
              </Button>
            )}

            <BulkUploadButton onClick={handleBulkUploadOpen} disabled={!accountId || isPending} />
          </div>
        )}
      />

      {/* Inspection Condition Dialog */}
      <InspectionConditionDialog
        openDialog={isDialogOpen(DIALOG.INSPECTION_CONDITION)}
        onClose={() => toggleDialog(DIALOG.INSPECTION_CONDITION)}
        data={rowSelected}
        onSave={handleSaveInspectionCondition}
        onDelete={handleDeleteInspectionCondition}
      />

      {/* Bulk Upload Dialog */}
      {accountId && accountName && (
        <BulkUploadDialog
          open={bulkUploadOpen}
          onClose={handleBulkUploadClose}
          accountId={accountId}
          accountName={accountName}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      <ConfirmDialogComponent confirmDialog={confirmDialog} onClose={closeConfirmDialog} />
    </>
  )
}

export default CampaignSettingTable
