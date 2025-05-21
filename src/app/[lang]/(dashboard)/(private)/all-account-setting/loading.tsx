'use client'

import React from 'react'

import { Box, Card, CardHeader, CardContent, Divider } from '@mui/material'

import { useSettings } from '@/@core/hooks/useSettings'

interface ExcludeKeywordsSkeletonProps {
  chipCount?: number
}

const ExcludeKeywordsSkeleton: React.FC<ExcludeKeywordsSkeletonProps> = ({ chipCount = 8 }) => {
  const { settings } = useSettings()
  const isDarkMode = settings.mode === 'dark'

  // Dynamic color classes based on dark/light mode
  const bgColor = isDarkMode ? 'bg-gray-700' : 'bg-gray-200'

  return (
    <Card>
      <CardHeader title={<div className={`h-8 w-48 ${bgColor} rounded animate-pulse`}></div>} />

      <CardContent className='space-y-2'>
        {/* Input field and button area */}
        <Box className='flex items-center mb-4'>
          {/* Text field skeleton */}
          <div className={`h-10 flex-grow mr-2 ${bgColor} rounded animate-pulse`}></div>

          {/* Button skeleton */}
          <div className={`h-10 w-20 ml-2 ${bgColor} rounded animate-pulse`}></div>
        </Box>

        <Divider className='my-4' />

        {/* Keywords chips area */}
        <Box className='flex flex-wrap gap-3 mt-10'>
          {/* Generate multiple chip skeletons */}
          {[...Array(chipCount)].map((_, index) => (
            <div
              key={index}
              className={`h-8 w-24 ${bgColor} rounded-full animate-pulse`}
              style={{ animationDelay: `${index * 0.05}s` }} // Staggered animation
            ></div>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ExcludeKeywordsSkeleton
