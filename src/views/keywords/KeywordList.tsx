import KeywordFilter from './KeywordFilter'
import GenreKeywordTable from './Table'
import type { TrendKeywordTableProps } from '@/types/keywordType'

const KeywordListView = ({ data }: { data: TrendKeywordTableProps }) => {
  return (
    <div className='flex flex-col gap-8'>
      <KeywordFilter />
      <GenreKeywordTable data={data} />
    </div>
  )
}

export default KeywordListView
