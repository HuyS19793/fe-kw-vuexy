'use client'

import { redirect, usePathname } from 'next/navigation'

const Error = () => {
  // const params = useParams()

  const pathname = usePathname()

  if (pathname === '/under-maintenance') {
    return null
  }

  return redirect('/under-maintenance')
}

export default Error
