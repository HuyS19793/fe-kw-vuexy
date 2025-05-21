'use server'

// import { revalidateTag } from 'next/cache'

import URLS from '@/configs/url'
import mutateServer from '@/libs/mutateServer'
import type { CampaignSettingDataType } from '@/types/campaignType'

export const createCampaignSetting = async (data: CampaignSettingDataType) => {
  const path = URLS.proxy.campaignSetting

  try {
    // console.log('data', data)

    const res = await mutateServer(path, data, {
      method: 'POST'
    })

    // console.log('res', res)

    if (res.code === 201) {
      // revalidateTag(data.account_id)

      return { success: true }
    }

    return { success: false }
  } catch (error) {
    // console.log('Failed to add keyword')

    return { success: false }
  }
}

export const updateCampaignSetting = async (data: CampaignSettingDataType) => {
  const path = `${URLS.proxy.campaignSetting}${data.id}/`

  try {
    // console.log('data', data)

    const res = await mutateServer(path, data, {
      method: 'PATCH'
    })

    // console.log('res', res)

    if (res.code === 200) {
      // revalidateTag(data.account_id)

      return { success: true }
    }

    return { success: false }
  } catch (error) {
    // console.log('Failed to add keyword')

    return { success: false }
  }
}

export const deleteCampaignSetting = async (id: number) => {
  const path = `${URLS.proxy.campaignSetting}${id}/`

  try {
    const res = await mutateServer(path, null, {
      method: 'DELETE'
    })

    if (res.code === 204) {
      // revalidateTag(accountId)

      return { success: true }
    }

    return { success: false }
  } catch (error) {
    // console.log('Failed to delete keyword')

    return { success: false }
  }
}
