'use client'

import { useSettings } from '@/@core/hooks/useSettings'
import TableSkeleton from '@/components/skeletons/TableSkeleton'

// Keyword Filter Skeleton
const KeywordFilterSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <div
      className={`${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-slate-900/30' : 'bg-white border-gray-100 shadow-md'}
      border rounded-lg p-6 max-w-lg mx-auto min-w-[500px] animate-pulse transition-colors duration-200`}
    >
      <div className='mb-6'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            {/* Date Range Picker Skeleton */}
            <div className='mb-2'>
              <div className={`h-4 w-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
              <div className={`h-10 w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
            </div>
          </div>
          <div className='flex items-center'>
            {/* Reset Button Skeleton */}
            <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} mt-2`}></div>
          </div>
        </div>
      </div>

      {/* Genre Checkboxes Skeleton */}
      <div className='mb-6'>
        <div className='grid grid-cols-2 gap-1'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex items-center gap-2 py-1'>
              <div className={`w-4 h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 w-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Button Skeleton */}
      <div className='flex justify-end space-x-4'>
        <div className={`h-10 w-28 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
      </div>
    </div>
  )
}

export default function Loading() {
  const { settings } = useSettings()
  const isDarkMode = settings.mode === 'dark'

  return (
    <div className='flex flex-col gap-8 w-full'>
      <KeywordFilterSkeleton isDarkMode={isDarkMode} />

      <TableSkeleton
        isDarkMode={isDarkMode}
        headers={['Keyword', 'Genre', 'Created At']}
        rowCount={8}
        columnConfig={{
          widths: ['w-36', 'w-20', 'w-32'],
          statusColumns: [1],
          statusColors: {
            1: isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'
          }
        }}
      />
    </div>
  )
}
