'use server'

// import { revalidatePath } from 'next/cache'

import URLS from '@/configs/url'
import mutateServer from '@/libs/mutateServer'

export const addKeyword = async (keyword: string) => {
  const path = URLS.proxy.blacklistKeywords

  try {
    const res = await mutateServer(path, {
      keyword_value: keyword
    })

    if (res.code === 201) {
      // revalidatePath(`/all-account-setting`)

      return { success: true }
    }

    // console.log('Failed to add keyword')

    return { success: false }
  } catch (error) {
    // console.log('Failed to add keyword')

    return { success: false }
  }
}

export const deleteKeyword = async (id: string) => {
  const path = `${URLS.proxy.blacklistKeywords}${id}/`

  try {
    const res = await mutateServer(
      path,
      {},
      {
        method: 'DELETE'
      }
    )

    // console.log(res)

    if (res.code === 204) {
      // revalidatePath(`/all-account-setting`)

      return { success: true }
    }

    // console.log('Failed to delete keyword')

    return { success: false }
  } catch (error) {
    console.log('Failed to delete keyword')

    return { success: false }
  }
}
