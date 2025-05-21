'use client'

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Thiết lập staleTime mặc định để tránh refetch ngay lập tức trên client
        staleTime: 60 * 1000,
        refetchOnMount: false,
        retry: false
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Trên server: luôn tạo một query client mới
    return makeQueryClient()
  } else {
    // Trên browser: tạo một query client mới nếu chưa có
    if (!browserQueryClient) browserQueryClient = makeQueryClient()

    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
