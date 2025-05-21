import URLS from '@/configs/url'
import inspectionConditionData from '@/data/inspectionConditionData'
import fetchServer from '@/libs/fetchServer'
import { getEmployeeId } from '@/libs/auth'

// Views
import CampaignSettingView from '@/views/campaign'

// Types
import type { SearchParamType } from '@/types/SearchParamType'
import type { AccountDataType, AccountType } from '@/types/accountType'
import type {
  CampaignDataType,
  CampaignSettingType,
  CampaignSettingDataType,
  CampaignSettingTableProps
} from '@/types/campaignType'

// Constants
const DEFAULT_PAGE = '1'
const DEFAULT_LIMIT = '10'
const DEFAULT_EMPTY_STRING = ''
const DEFAULT_NUMBER_VALUE = 0
const FLAG_OFF = 'OFF'

// Types
type CampaignSettingParamsType = SearchParamType & {
  account_id: string
}

type GetDataResponse = {
  statusCode: number
  accounts: AccountType[]
  campaigns: CampaignSettingTableProps
}

const findInspectionData = (formulaName: string) => {
  for (const [inspection, performanceObj] of Object.entries(inspectionConditionData)) {
    // Kiểm tra nếu giá trị tồn tại trong các tùy chọn
    if (Object.values(performanceObj || {}).includes(formulaName)) {
      return {
        inspection,
        formulaKey:
          Object.entries(performanceObj || {}).find(([_, value]) => value === formulaName)?.[0] || DEFAULT_EMPTY_STRING
      }
    }
  }

  return { inspection: DEFAULT_EMPTY_STRING, formulaKey: DEFAULT_EMPTY_STRING }
}

async function getAccounts(): Promise<{ statusCode: number; accounts: AccountType[] }> {
  let path = URLS.proxy.accounts
  const employeeId = await getEmployeeId()

  if (employeeId) {
    path += `?employee_id=${employeeId}`
  }

  // console.log(path)

  const res = await fetchServer(path)

  // console.log('Accounts:', res)

  const responseData = res.data || []

  const accounts =
    responseData.length > 0
      ? responseData.map((account: AccountDataType) => ({
          id: account.twitter_account_id,
          name: account.account_name
        }))
      : []

  return {
    statusCode: res.code,
    accounts
  }
}

function transformCampaignData(campaignData: CampaignDataType[], account?: AccountType): CampaignSettingType[] {
  return campaignData.map((campaign: CampaignDataType) => {
    const { id, sat_sun_flag, formula_name, avg_comparison_gte_1, avg_comparison_eq_0, avg_performance_period } =
      campaign?.campaign_setting || ({} as CampaignSettingDataType)

    const { inspection, formulaKey } = findInspectionData(formula_name || DEFAULT_EMPTY_STRING)

    return {
      id: campaign.twitter_campaign_id,
      name: campaign.campaign_name,
      accountId: account?.id || '',
      accountName: account?.name || '',
      adGroupSettingCount: campaign.ad_groups_setting_count,
      holidaySuspension: sat_sun_flag || FLAG_OFF,
      inspectionCondition: inspection,
      campaignSettingId: id || 0,
      performanceConfig: {
        formula: formulaKey,
        performanceAboveOne: avg_comparison_gte_1 ?? DEFAULT_NUMBER_VALUE,
        performanceZero: avg_comparison_eq_0 ?? DEFAULT_NUMBER_VALUE,
        calculationPeriod: avg_performance_period ?? DEFAULT_NUMBER_VALUE
      }
    }
  })
}

async function fetchCampaigns(
  accountId: string,
  searchParams: Record<string, string>,
  account?: AccountType
): Promise<CampaignSettingTableProps> {
  const queryParams = new URLSearchParams(searchParams).toString()
  const campaignsPath = `${URLS.proxy.campaigns}?${queryParams}`

  const campaignRes = await fetchServer(campaignsPath, {
    next: { tags: ['campaigns', accountId] }
  })

  // console.log('Campaigns:', campaignRes)

  const canSync = campaignRes.data?.syncable || false
  const campaignResults = campaignRes.data?.results || []
  const transformedData = transformCampaignData(campaignResults, account)

  return {
    canSync,
    data: transformedData,
    count: campaignRes.data?.count || 0
  }
}

async function getData(searchParams: CampaignSettingParamsType): Promise<GetDataResponse> {
  const { account_id: accountId, search, page, limit } = searchParams

  // Fetch accounts
  const { statusCode, accounts } = await getAccounts()

  let campaigns: CampaignSettingTableProps = {
    data: [],
    count: 0
  }

  if (accountId) {
    const account = accounts.find(acc => acc.id === accountId)

    const paramsObj = {
      account_id: accountId,
      search: search || DEFAULT_EMPTY_STRING,
      page: page || DEFAULT_PAGE,
      limit: limit || DEFAULT_LIMIT
    }

    campaigns = await fetchCampaigns(accountId, paramsObj, account)
  }

  return {
    statusCode,
    accounts,
    campaigns
  }
}

const SettingPage = async ({ searchParams }: { searchParams: CampaignSettingParamsType }) => {
  const { accounts, campaigns } = await getData(searchParams)

  return <CampaignSettingView accountData={accounts} campaignData={campaigns} />
}

export default SettingPage
