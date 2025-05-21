import type { CellContext } from '@tanstack/react-table'

import type { AdgroupSettingType } from '@/types/adgroupType'

const AdgroupNameCell = ({ getValue }: CellContext<AdgroupSettingType, any>) => {
  const value = getValue()

  return <div className='whitespace-normal break-words max-w-[300px] py-2'>{value}</div>
}

export default AdgroupNameCell
