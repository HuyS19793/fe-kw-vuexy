import type { ReactNode } from 'react'

import { Button } from '@mui/material'

import { useTranslations } from 'next-intl'

import type { CampaignSettingTableCellProps } from '@/types/campaignType'

export const getColor = (value: string) => {
  switch (value) {
    case 'CPA':
      return 'success'
    case 'CPC':
      return 'warning'
    case 'CPM':
      return 'info'
    default:
      return ''
  }
}

export const InspectionConditionButton = ({
  value,
  onClick,
  size = 'small',
  children,
  variant = 'contained',
  ...props
}: {
  value: string
  size?: 'small' | 'medium' | 'large' | undefined
  variant?: 'text' | 'outlined' | 'contained' | undefined
  onClick: () => void
  children?: ReactNode
}) => {
  return (
    <Button variant={variant} color={getColor(value) || 'inherit'} size={size} onClick={onClick} {...props}>
      {children}
    </Button>
  )
}

const InspectionConditionCell = (info: CampaignSettingTableCellProps) => {
  const t = useTranslations()

  const row = info.row.original
  const value = row.inspectionCondition
  const meta = info.table.options.meta

  const handleClick = () => {
    if (meta?.openInspectionConditionDialog) {
      meta.openInspectionConditionDialog(row)
    }
  }

  return (
    <div>
      <InspectionConditionButton value={value} onClick={handleClick}>
        {value || t('Not Set')}
      </InspectionConditionButton>
    </div>
  )
}

export default InspectionConditionCell
