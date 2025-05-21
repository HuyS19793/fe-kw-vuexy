'use client'

import { useSearchParams } from 'next/navigation'

import CampaignSettingTable from './Table'
import AccountSelection from './AccountSelection'
import type { CampaignSettingTableProps } from '@/types/campaignType'
import type { AccountType } from '@/types/accountType'

type CampaignSettingViewProps = {
  accountData: AccountType[]
  campaignData: CampaignSettingTableProps
}

const CampaignSettingView = ({ accountData, campaignData }: CampaignSettingViewProps) => {
  // *** HOOKS ***
  const searchParams = useSearchParams()

  // *** GET SELECTED ACCOUNT INFO ***
  const accountId = searchParams.get('account_id')

  const selectedAccount = accountId ? accountData.find(account => account.id === accountId) : null

  const accountName = selectedAccount?.name || null

  // *** RENDER ***
  return (
    <>
      <div className='flex flex-col gap-8'>
        <AccountSelection accountData={accountData} />
        <CampaignSettingTable data={campaignData} accountId={accountId} accountName={accountName} />
      </div>
    </>
  )
}

export default CampaignSettingView
