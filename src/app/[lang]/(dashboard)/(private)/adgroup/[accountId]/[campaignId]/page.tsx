import { redirect } from 'next/navigation'

import AdgroupSettingView from '@/views/adgroup'

import type { SearchParamType } from '@/types/SearchParamType'
import URLS from '@/configs/url'
import fetchServer from '@/libs/fetchServer'
import type { AdgroupDataType } from '@/types/adgroupType'

type AdgroupSettingParamsType = {
  params: {
    accountId: string
    campaignId: string
  }
  searchParams: SearchParamType
}

async function getAccount(accountId: string) {
  const path = `${URLS.proxy.accounts}${accountId}`
  const res = await fetchServer(path)

  // console.log(res)

  return res?.data || {}
}

async function getData(setting: AdgroupSettingParamsType) {
  const { params, searchParams } = setting

  const { accountId, campaignId } = params

  const account = await getAccount(accountId)

  // console.log(account)

  const { search, page, limit } = searchParams

  let path = URLS.proxy.adgroups

  const paramsObj = {
    campaign_id: campaignId,
    search: search || '',
    page: page || 1,
    limit: limit || 10
  } as Record<string, string>

  const searchParamsStr = new URLSearchParams(paramsObj).toString()

  path += `?${searchParamsStr}`

  const res = await fetchServer(path, {
    next: {
      tags: ['adgroups', accountId, campaignId]
    }
  })

  let adgroups = res.data?.results || []

  // console.log('Adgroups:', adgroups)

  if (adgroups.length > 0) {
    adgroups = adgroups.map((adgroup: AdgroupDataType) => {
      const { id, submit_flag, genre_include, genre_exclude, keyword_include_default, keyword_exclude_default } =
        adgroup.adgroup_setting || {}

      return {
        id: adgroup.twitter_adgroup_id,
        accountId: account.twitter_account_id,
        accountName: account.account_name,
        campaignId,
        campaignName: adgroup.campaign,
        adgroupId: adgroup.twitter_adgroup_id,
        adgroupName: adgroup.adgroup_name,
        adgroupSettingId: id || null,
        isKeywordSubmission: submit_flag === 'ON',
        genres: genre_include || [],
        excludedGenres: genre_exclude || [],
        includeKeywords: keyword_include_default || [],
        excludeKeywords: keyword_exclude_default || []
      }
    })
  }

  return {
    statusCode: res.code,
    data: adgroups,
    count: res.data?.count || 0
  }
}

const AdgroupSettingPage = async ({ params, searchParams }: AdgroupSettingParamsType) => {
  const data = await getData({ params, searchParams })

  if (data.statusCode === 404) {
    return redirect('/404')
  }

  // if (data.statusCode === 401) {
  //   return redirect('/login')
  // }

  return (
    <div>
      <AdgroupSettingView data={data} />
    </div>
  )
}

export default AdgroupSettingPage
