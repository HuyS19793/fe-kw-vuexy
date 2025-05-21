import type { CellContext } from '@tanstack/react-table'

export type AdgroupSettingType = {
  id: string
  accountId: string
  accountName: string
  campaignId: string
  campaignName: string
  adgroupId: string
  adgroupName: string
  adgroupSettingId: number
  isKeywordSubmission: boolean
  genres: string[]
  excludedGenres: string[]
  includeKeywords: string[]
  excludeKeywords: string[]
}

export type AdgroupSettingDataType = {
  id: number
  campaign_id: string
  adgroup: string
  genre_include?: string[]
  genre_exclude?: string[]
  keyword_include_default?: string[]
  keyword_exclude_default?: string[]
  submit_flag?: 'ON' | 'OFF'
}

export type AdgroupDataType = {
  twitter_adgroup_id: string
  adgroup_name: string
  campaign: string
  adgroup_setting: AdgroupSettingDataType
}

export type AdgroupSettingTableProps = {
  data: AdgroupSettingType[]
  count: number
}

export type inspectionConditionSettingType = {
  name: string
  performanceAboveOne: number
  performanceZero: number
  calculationPeriod: number
}

export type AdgroupSettingTableCellProps = CellContext<AdgroupSettingType, any>

export type SettingDialogType = 'ADGROUP_SETTING' | ''
