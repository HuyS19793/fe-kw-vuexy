// context/LoadingContext.tsx
'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useTransition } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import { useRouter } from 'nextjs-toploader/app'

interface LoadingContextType {
  isPending: boolean
  startLoadingTransition: (callback: () => void) => void
  navigateTo: (url: string) => void
  updateSearchParams: (params: Record<string, string | null>) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Utility to create a new URL search params string
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      // Convert current search params to an object
      const currentParams = Object.fromEntries(searchParams.entries())

      // Create a new object with updated params
      const newParams = { ...currentParams }

      // Update or remove params based on the input
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          delete newParams[key]
        } else {
          newParams[key] = value
        }
      })

      return new URLSearchParams(newParams).toString()
    },
    [searchParams]
  )

  // General function to wrap any operation in a transition
  const startLoadingTransition = useCallback(
    (callback: () => void) => {
      startTransition(callback)
    },
    [startTransition]
  )

  // Navigate to a specific URL with loading state
  const navigateTo = useCallback(
    (url: string) => {
      startTransition(() => {
        router.push(url)
      })
    },
    [router, startTransition]
  )

  // Update search params with loading state
  const updateSearchParams = useCallback(
    (params: Record<string, string | null>) => {
      startTransition(() => {
        const queryString = createQueryString(params)

        router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
      })
    },
    [createQueryString, pathname, router, startTransition]
  )

  return (
    <LoadingContext.Provider
      value={{
        isPending,
        startLoadingTransition,
        navigateTo,
        updateSearchParams
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext)

  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }

  return context
}
