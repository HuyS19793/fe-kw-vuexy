import { headers } from 'next/headers'

import { verify } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'

// Helper function to verify JWT
async function verifyOidcToken(encodedJwt: string) {
  // Replace with actual ALB ARN
  const EXPECTED_ALB_ARN = process.env.ALB_ARN

  // Replace with actual region or read from ENV (process.env.AWS_REGION)
  const REGION = process.env.AWS_REGION

  // Split the header part
  const jwtHeaderPart = encodedJwt.split('.')[0]

  const decodedHeaderJson = JSON.parse(Buffer.from(jwtHeaderPart, 'base64').toString('utf-8'))

  // Step 1: Check signer
  if (decodedHeaderJson.signer !== EXPECTED_ALB_ARN) {
    // throw new Error('Invalid Signer')
    console.log('Invalid Signer')
  }

  // Step 2: Get kid and fetch public key
  const { kid } = decodedHeaderJson

  // if (!kid) throw new Error('Missing kid in JWT header')

  if (!kid) {
    console.log('Missing kid in JWT header')
  }

  const url = `https://public-keys.auth.elb.${REGION}.amazonaws.com/${kid}`
  const res = await fetch(url)

  if (!res.ok) {
    // throw new Error(`Failed to fetch public key for kid: ${kid}`)
    console.log(`Failed to fetch public key for kid: ${kid}`)
  }

  const publicKey = await res.text()

  // Step 3: Verify the entire JWT using the public key (ES256)
  return verify(encodedJwt, publicKey, { algorithms: ['ES256'] })
}

async function decodeToken(encodedJwt: string) {
  return jwtDecode(encodedJwt)
}

async function getEmployeeId() {
  const accessToken = headers().get('x-amzn-oidc-accesstoken')

  if (!accessToken) {
    return ''
  }

  const decodePayload = (await decodeToken(accessToken)) as { username: string }

  if (!decodePayload.username) {
    return ''
  }

  const usernameSplit = decodePayload.username.split('_')

  return usernameSplit[usernameSplit.length - 1]
}

export { verifyOidcToken, decodeToken, getEmployeeId }
