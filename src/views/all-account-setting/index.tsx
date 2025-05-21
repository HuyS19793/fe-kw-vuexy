// import AccountSetting from './AccountSettingList'
import type { BlacklistKeywordType } from '@/types/keywordType'
import BlacklistKeywordsSetting from './BlacklistKeywordsSetting'

const AllAccountSettingView = ({ data }: { data: BlacklistKeywordType[] }) => {
  return (
    <>
      <BlacklistKeywordsSetting data={data} />
    </>
  )
}

export default AllAccountSettingView
