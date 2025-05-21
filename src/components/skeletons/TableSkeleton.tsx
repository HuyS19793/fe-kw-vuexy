'use client'

import React from 'react'

import { Card } from '@mui/material'

// Define types for column configuration
interface ColumnConfig {
  widths?: string[]
  statusColumns?: number[]
  statusColors?: {
    [key: number]: string
    default?: string
  }
}

// Props interface for the TableSkeleton component
interface TableSkeletonProps {
  isDarkMode: boolean
  rowCount?: number
  headers?: string[]
  hasSearch?: boolean
  hasActions?: boolean
  hasPagination?: boolean
  columnConfig?: ColumnConfig
  className?: string
  title?: string | null
}

/**
 * Reusable Table Skeleton Component
 *
 * @param props - Component props
 * @param props.isDarkMode - Dark mode state from MUI settings
 * @param props.rowCount - Number of skeleton rows to display (default: 5)
 * @param props.headers - Array of column headers
 * @param props.hasSearch - Whether to show search bar (default: true)
 * @param props.hasActions - Whether to show action buttons (default: true)
 * @param props.hasPagination - Whether to show pagination (default: true)
 * @param props.columnConfig - Configuration for columns
 * @param props.className - Additional class names for the Card component
 * @param props.title - Optional title for the table
 */
const TableSkeleton: React.FC<TableSkeletonProps> = ({
  isDarkMode,
  rowCount = 5,
  headers = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5'],
  hasSearch = true,
  hasActions = true,
  hasPagination = true,
  columnConfig = {},
  className = '',
  title = null
}) => {
  // Default column configuration
  const defaultColumnConfig: ColumnConfig = {
    widths: headers.map(() => 'w-32'), // Default width for all columns
    statusColumns: [] // Columns that should be rendered as status indicators
  }

  // Merge default config with provided config
  const config: Required<ColumnConfig> = {
    widths: columnConfig.widths || defaultColumnConfig.widths || [],
    statusColumns: columnConfig.statusColumns || defaultColumnConfig.statusColumns || [],
    statusColors: columnConfig.statusColors || {
      default: isDarkMode ? 'bg-blue-800/30' : 'bg-blue-100'
    }
  }

  // Generate a status color for a column
  const getStatusColor = (colIndex: number): string | null => {
    if (!config.statusColumns.includes(colIndex)) return null

    // Use specific color if defined, otherwise use default
    return config.statusColors[colIndex] || config.statusColors.default || ''
  }

  return (
    <Card className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} transition-colors duration-200 ${className}`}>
      {/* Table Title (if provided) */}
      {title && (
        <div className='px-6 pt-6 pb-3'>
          <div
            className={`h-7 ${config.widths[0]} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}
          ></div>
        </div>
      )}

      {/* Table Filter/Header Area */}
      {(hasSearch || hasActions) && (
        <div
          className={`flex items-center justify-between p-4 ${!title ? 'border-t' : ''} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          {hasSearch && (
            <div className={`h-10 w-64 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
          )}
          {hasActions && (
            <div className='flex gap-2'>
              <div className={`h-9 w-24 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              {/* <div className={`h-9 w-9 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div> */}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className='relative'>
        <div className='overflow-auto'>
          <table className='w-full'>
            {/* Table Headers */}
            <thead>
              <tr className={isDarkMode ? 'bg-slate-700/30' : 'bg-gray-50'}>
                {headers.map((header, idx) => (
                  <th key={idx} className='p-4 text-left'>
                    <div
                      className={`h-5 ${config.widths[idx]} ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded animate-pulse`}
                    ></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Table Rows */}
              {[...Array(rowCount)].map((_, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`border-b ${isDarkMode ? 'border-gray-800 hover:bg-gray-900/30' : 'border-gray-100 hover:bg-gray-50'} transition-colors duration-150`}
                >
                  {headers.map((_, colIdx) => {
                    const statusColor = getStatusColor(colIdx)

                    return (
                      <td key={colIdx} className='p-4'>
                        <div
                          className={`h-5 ${config.widths[colIdx]} ${statusColor || (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')}
                          ${statusColor ? 'h-6 rounded-full' : 'rounded'} animate-pulse`}
                        ></div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {hasPagination && (
          <div
            className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}
          >
            <div className={`h-8 w-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            <div className='flex gap-2'>
              <div className={`h-8 w-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              <div className={`h-8 w-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              <div className={`h-8 w-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default TableSkeleton
