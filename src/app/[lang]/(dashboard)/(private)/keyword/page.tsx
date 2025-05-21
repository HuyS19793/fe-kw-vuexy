import URLS from '@/configs/url'
import fetchServer from '@/libs/fetchServer'

import KeywordListView from '@/views/keywords/KeywordList'

type KeywordParamsType = {
  category_name: string
  from_date: string
  to_date: string
  search: string
  page: string
  limit: string
}

async function getData(searchParams: KeywordParamsType) {
  const { search, category_name, from_date, to_date, page, limit } = searchParams

  let path = URLS.proxy.keywords

  const paramsObj = {
    search: search || '',
    from_date: from_date || '',
    to_date: to_date || '',
    page: page || 1,
    limit: limit || 10
  } as Record<string, string>

  if (category_name) {
    paramsObj.category_name = category_name
  } else {
    delete paramsObj.category_name
  }

  path += `?${new URLSearchParams(paramsObj).toString()}`

  const response = await fetchServer(path)

  return {
    statusCode: response.code,
    data:
      response.data?.results?.map((keyword: any) => ({
        id: keyword.id,
        name: keyword.keyword_value,
        genre: keyword.category_name,
        createdAt: keyword.created_at
      })) || [],
    count: response.data?.count || 0
  }
}

const KeywordPage = async ({ searchParams }: { searchParams: KeywordParamsType }) => {
  const data = await getData(searchParams)

  return (
    <>
      <KeywordListView data={data} />
    </>
  )
}

export default KeywordPage
