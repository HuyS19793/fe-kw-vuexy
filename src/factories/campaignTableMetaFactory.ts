// factories/campaignTableMetaFactory.ts

import type { useRouter } from 'nextjs-toploader/app'

import type { useSettingActions } from '@/hooks/useSettingActions'
import { DIALOG } from '@/utils/setting'
import type { CampaignSettingDataType, CampaignSettingType } from '@/types/campaignType'
import { createCampaignSetting, updateCampaignSetting } from '@/actions/campaign-setting'

/**
 * Factory function to create table meta object with all actions for the CampaignSettingTable
 */
export function createCampaignTableMeta({
  router,
  locale,
  accountId,
  setRowSelected,
  toggleDialog,
  confirmAction,
  handleApiAction
}: {
  router: ReturnType<typeof useRouter>
  locale: string
  accountId: string | null
  setRowSelected: (row: CampaignSettingType | null) => void
  toggleDialog: (dialogId: string) => void
  confirmAction: ReturnType<typeof useSettingActions>['confirmAction']
  handleApiAction: ReturnType<typeof useSettingActions>['handleApiAction']
}) {
  /**
   * Creates a base data submission object from a row
   */
  const createBaseSubmitData = (row: CampaignSettingType): CampaignSettingDataType => {
    if (accountId === null) {
      throw new Error('Account ID cannot be null when creating campaign settings')
    }

    return {
      id: row.campaignSettingId,
      account_id: accountId,
      campaign: row.id
    }
  }

  /**
   * Handles the API action with proper error handling
   */
  const executeSettingAction = (dataSubmit: CampaignSettingDataType, successMessage: string, errorMessage: string) => {
    handleApiAction(
      async () => (dataSubmit.id ? await updateCampaignSetting(dataSubmit) : await createCampaignSetting(dataSubmit)),
      successMessage,
      errorMessage
    )
  }

  return {
    /**
     * Navigates to the adgroup setting page for a campaign
     */
    navigateAdgroupSettingPage: (row: CampaignSettingType) => {
      router.push(`/${locale}/adgroup/${accountId}/${row.id}`)
    },

    /**
     * Toggles the holiday suspension status for a campaign
     */
    toggleHolidaySuspension: (row: CampaignSettingType, value: 'ON' | 'OFF') => {
      console.log('toggleHolidaySuspension', row, value)

      const actionTitle = `${value === 'ON' ? 'Turn ON' : 'Turn OFF'} the Holiday Suspension?`

      confirmAction(row.id, actionTitle, 'Are you sure you want to save the changes?', () => {
        const dataSubmit = {
          ...createBaseSubmitData(row),
          sat_sun_flag: value
        }

        executeSettingAction(
          dataSubmit,
          'Holiday Suspension has been successfully updated',
          'Failed to update Holiday Suspension'
        )
      })
    },

    /**
     * Opens the inspection condition dialog for a campaign
     */
    openInspectionConditionDialog: (row: CampaignSettingType) => {
      setRowSelected(row)
      toggleDialog(DIALOG.INSPECTION_CONDITION)
    }
  }
}
