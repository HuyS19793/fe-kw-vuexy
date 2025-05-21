'use server'

import { cookies } from 'next/headers'

const setAccessToken = (token: string, exp: string) => {
  cookies().set('access_token', token, { path: '/' })
  cookies().set('access_token_exp', exp, { path: '/' })
}

const getAccessToken = () => {
  const accessToken = cookies().get('access_token')

  if (!accessToken) {
    return null
  }

  return accessToken.value
}

const getTokenExp = () => {
  return cookies().get('access_token_exp')
}

export { setAccessToken, getAccessToken, getTokenExp }
