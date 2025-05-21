// factories/adgroupTableMetaFactory.ts

import { DIALOG } from '@/utils/setting'
import type { AdgroupSettingDataType, AdgroupSettingType } from '@/types/adgroupType'
import { createAdgroupSetting, updateAdgroupSetting } from '@/actions/adgroup-setting'

/**
 * Factory function to create table meta object with all actions for the AdgroupSettingTable
 */
export function createAdgroupTableMeta({
  setRowSelected,
  toggleDialog,
  confirmAction,
  handleApiAction
}: {
  setRowSelected: (row: AdgroupSettingType | null) => void
  toggleDialog: (dialogId: string) => void
  confirmAction: (id: string, title: string, content: string, action: () => void) => void
  handleApiAction: (
    action: () => Promise<{ success: boolean }>,
    successMessage: string,
    errorMessage: string
  ) => Promise<void>
}) {
  /**
   * Creates a base data submission object from a row
   */
  const createBaseSubmitData = (row: AdgroupSettingType): AdgroupSettingDataType => ({
    id: row.adgroupSettingId,
    adgroup: row.adgroupId,
    campaign_id: row.campaignId
  })

  /**
   * Handles the API action with proper error handling
   */
  const executeSettingAction = (dataSubmit: AdgroupSettingDataType, successMessage: string, errorMessage: string) => {
    handleApiAction(
      async () => (dataSubmit.id ? await updateAdgroupSetting(dataSubmit) : await createAdgroupSetting(dataSubmit)),
      successMessage,
      errorMessage
    )
  }

  return {
    /**
     * Toggles the keyword submission status for an adgroup
     */
    toggleKeywordSubmission: (row: AdgroupSettingType, value: boolean) => {
      const actionTitle = `Turn ${value ? 'ON' : 'OFF'} the Keyword Submission?`

      confirmAction(row.id, actionTitle, 'Are you sure you want to save the changes?', () => {
        const dataSubmit = {
          ...createBaseSubmitData(row),
          submit_flag: value ? ('ON' as const) : ('OFF' as const)
        }

        executeSettingAction(
          dataSubmit,
          'Keyword Submission has been successfully updated',
          'Failed to update Keyword Submission'
        )
      })
    },

    /**
     * Opens the genre setting dialog for an adgroup
     */
    openSettingGenre: (row: AdgroupSettingType) => {
      setRowSelected(row)
      toggleDialog(DIALOG.GENRE_SETTING)
    },

    /**
     * Deletes a genre from an adgroup's settings
     */
    deleteGenre: (row: AdgroupSettingType, genre: string, type: 'genres' | 'excludedGenres') => {
      confirmAction(row.id, 'Delete Genre?', 'Are you sure you want to delete the genre?', () => {
        const dataSubmit = {
          ...createBaseSubmitData(row),
          ...(type === 'genres'
            ? { genre_include: row.genres.filter(g => g !== genre) }
            : { genre_exclude: row.excludedGenres.filter(g => g !== genre) })
        }

        executeSettingAction(dataSubmit, 'Genre has been successfully deleted', 'Failed to delete Genre')
      })
    },

    /**
     * Opens the keyword setting dialog for an adgroup
     */
    openSettingKeyword: (row: AdgroupSettingType) => {
      setRowSelected(row)
      toggleDialog(DIALOG.KEYWORD_SETTING)
    },

    /**
     * Deletes a keyword from an adgroup's settings
     */
    deleteKeyword: (row: AdgroupSettingType, keyword: string, type: 'includeKeywords' | 'excludeKeywords') => {
      confirmAction(row.id, 'Delete Keyword?', 'Are you sure you want to delete the keyword?', () => {
        const dataSubmit = {
          ...createBaseSubmitData(row),
          ...(type === 'includeKeywords'
            ? { keyword_include_default: row.includeKeywords.filter(k => k !== keyword) }
            : { keyword_exclude_default: row.excludeKeywords.filter(k => k !== keyword) })
        }

        executeSettingAction(dataSubmit, 'Keyword has been successfully deleted', 'Failed to delete Keyword')
      })
    }
  }
}
