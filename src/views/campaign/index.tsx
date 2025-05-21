import CampaignSettingTable from './Table'
import AccountSelection from './AccountSelection'
import type { CampaignSettingTableProps } from '@/types/campaignType'
import type { AccountType } from '@/types/accountType'

type CampaignSettingViewProps = {
  accountData: AccountType[]
  campaignData: CampaignSettingTableProps
}

const CampaignSettingView = ({ accountData, campaignData }: CampaignSettingViewProps) => {
  // *** RENDER ***
  return (
    <>
      <div className='flex flex-col gap-8'>
        <AccountSelection accountData={accountData} />
        <CampaignSettingTable data={campaignData} />
      </div>
    </>
  )
}

export default CampaignSettingView
