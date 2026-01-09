'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardBody, Spinner, Alert } from 'react-bootstrap'
import { authApi } from '@/api/auth'

// Helper to clean MongoDB format
function cleanMongoDBFormat(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (obj.$oid) return obj.$oid
  if (obj.$date) return obj.$date
  if (Array.isArray(obj)) return obj.map(item => cleanMongoDBFormat(item))
  if (typeof obj === 'object') {
    const cleaned: any = {}
    for (const key in obj) {
      cleaned[key] = cleanMongoDBFormat(obj[key])
    }
    return cleaned
  }
  return obj
}

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Verifying your account...')

  const exchangeToken = useCallback(async (redirectToken: string) => {
    try {
      setStatus('Exchanging verification token...')

      // Step 1: Exchange token
      const tokenResponse = await authApi.exchangeRedirectToken(redirectToken)
      
      console.log('✅ Token exchange response:', tokenResponse)

      // Step 2: Save token immediately
      localStorage.setItem('access_token', tokenResponse.access_token)
      const expiryTimestamp = Date.now() + (tokenResponse.expires_in * 1000)
      localStorage.setItem('token_expires_at', expiryTimestamp.toString())

      setStatus('Loading your account...')

      // Step 3: Fetch user data
      const userResponse = await authApi.getCurrentOrgUser()
      const cleanedUser = cleanMongoDBFormat(userResponse)
      
      console.log('✅ User data fetched:', cleanedUser)

      // Step 4: Transform and save user
      const userOut = {
        actor: 'org' as const,
        id: cleanedUser.org_user._id,
        _id: cleanedUser.org_user._id,
        email: cleanedUser.org_user.email,
        name: cleanedUser.org_user.name,
        org_id: cleanedUser.org_user.org_id,
        is_admin: cleanedUser.org_user.is_admin,
        role_name: cleanedUser.org_user.role_name,
        role: cleanedUser.org_user.role_name || '',
        status: cleanedUser.org_user.status,
        features: cleanedUser.org_user.features || [],
        organization: cleanedUser.organization || null,
      }

      localStorage.setItem('user', JSON.stringify(userOut))

      console.log('✅ User saved to localStorage:', {
        status: userOut.status,
        hasOrg: !!userOut.org_id,
      })

      // Step 5: Redirect based on user status
      if (tokenResponse.user_status === 'pending_onboard' || !cleanedUser.org_user.org_id) {
        setStatus('Redirecting to onboarding...')
        router.push('/onboarding?step=org')
      } else if (tokenResponse.user_status === 'active') {
        setStatus('Redirecting to dashboard...')
        router.push('/dashboards')
      } else {
        throw new Error('Invalid user status')
      }

    } catch (err: any) {
      console.error('❌ Token exchange error:', err)
      setError(err?.response?.data?.detail || err.message || 'Authentication failed')
      setTimeout(() => router.push('/auth/sign-in'), 5000)
    }
  }, [router])

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Invalid callback: missing token')
      setTimeout(() => router.push('/auth/sign-in'), 3000)
      return
    }

    exchangeToken(token)
  }, [searchParams, router, exchangeToken])

  if (error) {
    return (
      <div className="account-pages py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <Card className="border-0 shadow-lg">
                <CardBody className="p-5 text-center">
                  <Alert variant="danger">{error}</Alert>
                  <p className="text-muted">Redirecting to sign in page...</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="account-pages py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card className="border-0 shadow-lg">
              <CardBody className="p-5 text-center">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <h5 className="mb-2">{status}</h5>
                <p className="text-muted">Please wait while we set up your account...</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}