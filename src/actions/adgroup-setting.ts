'use server'

// import { revalidateTag } from 'next/cache'

import URLS from '@/configs/url'
import mutateServer from '@/libs/mutateServer'
import type { AdgroupSettingDataType } from '@/types/adgroupType'

export const createAdgroupSetting = async (data: AdgroupSettingDataType) => {
  const path = URLS.proxy.adgroupSetting

  try {
    // console.log('data', data)

    const res = await mutateServer(path, data, {
      method: 'POST'
    })

    // console.log('res', res)

    if (res.code === 201) {
      // revalidateTag(data.campaign_id)

      return { success: true }
    }

    return { success: false }
  } catch (error) {
    // console.log('Failed to add keyword')

    return { success: false }
  }
}

export const updateAdgroupSetting = async (data: AdgroupSettingDataType) => {
  const path = `${URLS.proxy.adgroupSetting}${data.id}/`

  try {
    // console.log('data', data)

    const res = await mutateServer(path, data, {
      method: 'PATCH'
    })

    // console.log('res', res)

    if (res.code === 200) {
      // revalidateTag(data.campaign_id)

      return { success: true }
    }

    return { success: false }
  } catch (error) {
    // console.log('Failed to add keyword')

    return { success: false }
  }
}

export const deleteAdgroupSetting = async (id: number) => {
  const path = `${URLS.proxy.adgroupSetting}${id}/`

  try {
    const res = await mutateServer(path, null, {
      method: 'DELETE'
    })

    if (res.code === 204) {
      // revalidateTag(campaignId)

      return { success: true }
    }

    return { success: false }
  } catch (error) {
    // console.log('Failed to delete keyword')

    return { success: false }
  }
}
