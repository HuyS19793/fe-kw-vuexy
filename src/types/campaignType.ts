import type { CellContext } from '@tanstack/react-table'

export type CampaignSettingType = {
  id: string
  name: string
  accountId: string
  accountName: string
  campaignSettingId: number
  adGroupSettingCount: string
  inspectionCondition: string
  holidaySuspension: string
  performanceConfig?: {
    formula: string
    performanceAboveOne: number
    performanceZero: number
    calculationPeriod: number
  }
}

export type CampaignDataType = {
  twitter_campaign_id: string
  campaign_name: string
  twitter_account: string
  ad_groups_setting_count: string
  campaign_setting: CampaignSettingDataType
}

export type CampaignSettingDataType = {
  id: number
  campaign: string
  account_id: string
  sat_sun_flag?: 'ON' | 'OFF'
  avg_performance_period?: number
  avg_comparison_gte_1?: number
  avg_comparison_eq_0?: number
  formula_name?: string
}

export type CampaignSettingTableProps = {
  canSync?: boolean
  data: CampaignSettingType[]
  count: number
}

export type inspectionConditionSettingType = {
  name: string
  performanceAboveOne: number
  performanceZero: number
  calculationPeriod: number
}

export type CampaignSettingTableCellProps = CellContext<CampaignSettingType, any>
