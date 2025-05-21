import { Breadcrumbs, Typography } from '@mui/material'

import { useTranslations } from 'next-intl'

import Link from '@/components/Link'

import AdgroupSettingTable from './Table'
import type { AdgroupSettingTableProps } from '@/types/adgroupType'

const AdgroupSettingView = ({ data }: { data: AdgroupSettingTableProps }) => {
  // *** Hook ***
  const t = useTranslations()

  const accountCampaign = data.data[0] || {}

  const getNavigateCampaignSetting = () => {
    if (accountCampaign.accountId) {
      return `/campaign?account_id=${accountCampaign.accountId}`
    }

    return '/campaign'
  }

  return (
    <>
      <div className='flex gap-1 mb-8'>
        <Typography variant='h4' className='mb-0 me-10'>
          {t('Adgroup Setting')} |{' '}
        </Typography>
        <Breadcrumbs aria-label='breadcrumb' className=' self-center'>
          {/* Home Icon with Link */}
          <Link color='inherit' href='/' className='flex items-center gap-x-2'>
            <i className='tabler-home' />
          </Link>

          {accountCampaign.campaignName && (
            <>
              <Link color='inherit' href={getNavigateCampaignSetting()} className='flex items-center gap-x-2'>
                {accountCampaign.accountName}
              </Link>
              <Typography color='textPrimary'>{accountCampaign.campaignName}</Typography>
            </>
          )}
        </Breadcrumbs>
      </div>

      <AdgroupSettingTable data={data} />
    </>
  )
}

export default AdgroupSettingView
