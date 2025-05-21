'use server'

import URLS from '@/configs/url'
import fetchServer from '@/libs/fetchServer'

export const syncAccountX = async (accountId: string) => {
  if (!accountId) {
    return { success: false }
  }

  const path = `${URLS.proxy.syncAccountX}${accountId}`

  // path += `${accountId}?dimension=campaign`
  const campaignPath = `${path}?dimension=campaign`
  const adgroupPath = `${path}?dimension=adgroup`

  try {
    const resCampaign = await fetchServer(campaignPath)
    const resAdgroup = await fetchServer(adgroupPath)

    if (resCampaign.code === 200 && resAdgroup.code === 200) {
      return { success: true }
    }

    return { success: false }
  } catch (error) {
    return { success: false }
  }
}
