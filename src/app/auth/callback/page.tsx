// assistant-app/app/auth/callback/page.tsx

'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardBody, Spinner, Alert } from 'react-bootstrap'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Verifying your account...')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Invalid callback: missing token')
      setTimeout(() => router.push('/auth/sign-in'), 3000)
      return
    }

    exchangeToken(token)
  }, [searchParams, router])

  const exchangeToken = async (redirectToken: string) => {
    try {
      setStatus('Exchanging verification token...')

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.company.com/api/v1'
      
      const response = await fetch(`${API_BASE_URL}/auth/org/token/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirect_token: redirectToken }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Token exchange failed' }))
        throw new Error(errorData.detail || 'Invalid or expired token')
      }

      const data = await response.json()

      // Save auth data to localStorage
      localStorage.setItem('access_token', data.access_token)
      
      const expiryTimestamp = Date.now() + (data.expires_in * 1000)
      localStorage.setItem('token_expires_at', expiryTimestamp.toString())

      setStatus('Loading your account...')

      // Fetch user data
      const userResponse = await fetch(`${API_BASE_URL}/auth/org/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      })

      if (!userResponse.ok) {
        throw new Error('Failed to load user data')
      }

      const userData = await userResponse.json()
      localStorage.setItem('user', JSON.stringify({
        actor: 'org',
        id: userData.org_user._id,
        email: userData.org_user.email,
        name: userData.org_user.name,
        org_id: userData.org_user.org_id,
        is_admin: userData.org_user.is_admin,
        role_name: userData.org_user.role_name,
        status: userData.org_user.status,
        features: userData.org_user.features,
        organization: userData.organization || null,
      }))

      // Redirect based on user status
      if (data.user_status === 'pending_onboard') {
        setStatus('Redirecting to onboarding...')
        router.push('/onboarding')
      } else if (data.user_status === 'active') {
        setStatus('Redirecting to dashboard...')
        router.push('/dashboards')
      } else {
        throw new Error('Invalid user status')
      }

    } catch (err) {
      console.error('Token exchange error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setTimeout(() => router.push('/auth/sign-in'), 5000)
    }
  }

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