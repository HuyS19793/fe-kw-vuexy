'use client'

import { useState } from 'react'

import Image from 'next/image'

import { Button, Card, CardContent } from '@mui/material'
import { useTranslations } from 'next-intl'

import { toast } from 'react-toastify'

import URLS from '@/configs/url'

const CredentialPage = () => {
  // *** HOOKS ***
  const t = useTranslations()

  // *** STATE ***
  const [loading, setLoading] = useState(false)

  const handleAuthenticate = async () => {
    setLoading(true)

    const res = await fetch(URLS.api.redirectX)

    const data = await res.json()

    setLoading(false)

    if (data.url) {
      const newWindow = window.open(data.url, '_blank')

      if (newWindow) {
        newWindow.focus()
      }
    } else {
      toast.error(t('Failed to authenticate'))
    }
  }

  return (
    <>
      <div className='flex items-center justify-center'>
        <Card className='w-80 bg-black text-white'>
          <CardContent className='flex flex-col items-center space-y-4 p-6'>
            {/* Logo */}
            <div className='w-20 h-20 relative'>
              <Image src='/images/x-logo.png' alt='X Logo' layout='fill' objectFit='contain' className='rounded-full' />
            </div>

            {/* Authenticate Button */}
            <Button className='w-full bg-white text-black font-bold' onClick={handleAuthenticate}>
              {loading ? t('Authenticating') : t('Sign in to X')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default CredentialPage
