'use client'

import { Card, Grid } from '@mui/material' // Import MUI components

import { useSettings } from '@/@core/hooks/useSettings'
import TableSkeleton from '@/components/skeletons/TableSkeleton'

// Account Selection Skeleton
const AccountSelectionSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <Card className='p-6 space-y-6 relative'>
      <Grid container spacing={6} className='mb-3'>
        <Grid item xs={12}>
          {/* Title Skeleton */}
          <div className={`h-7 w-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2 animate-pulse`}></div>
          {/* Subtitle Skeleton */}
          <div className={`h-5 w-72 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </Grid>
      </Grid>

      {/* Account Autocomplete Skeleton */}
      <div className='mb-4'>
        <div className={`h-10 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      </div>
    </Card>
  )
}

export default function Loading() {
  const { settings } = useSettings()
  const isDarkMode = settings.mode === 'dark'

  return (
    <div className='flex flex-col gap-8 w-full'>
      <AccountSelectionSkeleton isDarkMode={isDarkMode} />

      {/* Campaign Setting Table */}
      <TableSkeleton
        isDarkMode={isDarkMode}
        headers={['Campaign ID', 'Campaign Name', 'Adgroup Setting', 'Inspection Condition', 'Holiday Suspension']}
        rowCount={5}
        columnConfig={{
          widths: ['w-24', 'w-48', 'w-20', 'w-20', 'w-20'],
          statusColumns: [2, 3, 4],
          statusColors: {
            2: isDarkMode ? 'bg-green-800/30' : 'bg-green-100',
            3: isDarkMode ? 'bg-blue-800/30' : 'bg-blue-100',
            4: isDarkMode ? 'bg-amber-800/30' : 'bg-amber-100'
          }
        }}
      />
    </div>
  )
}
