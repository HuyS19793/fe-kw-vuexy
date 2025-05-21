// import { redirect } from 'next/navigation'

import { uid } from 'uid'

import URLS from '@/configs/url'
import fetchServer from '@/libs/fetchServer'
import AllAccountSettingView from '@/views/all-account-setting'

async function getData() {
  const path = URLS.proxy.blacklistKeywords

  const response = await fetchServer(path)

  let data = response.data?.results || []

  data = data.map((keyword: any) => ({
    id: keyword.id || uid(),
    value: keyword.keyword_value
  }))

  return {
    statusCode: response.code,
    data,
    count: response.data?.count || 0
  }
}

const AllAccountSettingPage = async () => {
  const data = await getData()

  // if (data.statusCode === 401) {
  //   return redirect('/login')
  // }

  return (
    <>
      <AllAccountSettingView data={data.data} />
    </>
  )
}

export default AllAccountSettingPage
