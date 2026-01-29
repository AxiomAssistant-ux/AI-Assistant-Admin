'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardBody, Form, Button, Alert } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { authApi } from '@/api/auth'
import { Suspense } from 'react'

// Schema
const schema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
}).required()

type FormData = yup.InferType<typeof schema>

const AcceptInvitationContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invitationData, setInvitationData] = useState<{
    email: string
    name: string
    organization_name: string
  } | null>(null)

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  // Verify invitation token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid invitation link')
        setVerifying(false)
        return
      }

      try {
        const response = await authApi.verifyInvitation(token)
        setInvitationData(response)
        setError(null)
      } catch (err: any) {
        const errorMessage = err?.response?.data?.detail || 'Invalid or expired invitation'
        setError(errorMessage)
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError('Invalid invitation token')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await authApi.acceptInvitation({
        invite_token: token,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      })

      // Save token
      localStorage.setItem('access_token', response.access_token)

      // Redirect to dashboard (auth context will fetch user data)
      router.push('/dashboards')
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Failed to accept invitation'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Verifying...</span>
          </div>
          <p className="text-muted">Verifying your invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitationData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Card className="border-0 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
          <CardBody className="p-5">
            <div className="text-center mb-4">
              <IconifyIcon
                icon="solar:close-circle-bold-duotone"
                width={64}
                height={64}
                className="text-danger mb-3"
              />
              <h4 className="fw-bold text-dark mb-2">Invalid Invitation</h4>
              <p className="text-muted">{error}</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={() => router.push('/auth/sign-in')}
            >
              Go to Sign In
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
      <div className="account-pages py-5">

    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card className="border-0 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <CardBody className="p-5">
          <div className="text-center mb-4">
            <IconifyIcon
              icon="solar:letter-opened-bold-duotone"
              width={64}
              height={64}
              className="text-primary mb-3"
            />
            <h4 className="fw-bold text-dark mb-2">Welcome to {invitationData?.organization_name}!</h4>
            <p className="text-muted">
              Set your password to complete your account setup
            </p>
          </div>

          {invitationData && (
            <div className="mb-4 p-3 bg-light rounded">
              <div className="d-flex align-items-start gap-2 mb-2">
                <IconifyIcon icon="solar:user-bold-duotone" width={20} height={20} className="text-primary mt-1" />
                <div>
                  <div className="small text-muted">Name</div>
                  <div className="fw-semibold">{invitationData.name}</div>
                </div>
              </div>
              <div className="d-flex align-items-start gap-2">
                <IconifyIcon icon="solar:letter-bold-duotone" width={20} height={20} className="text-primary mt-1" />
                <div>
                  <div className="small text-muted">Email</div>
                  <div className="fw-semibold">{invitationData.email}</div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>New Password <span className="text-danger">*</span></Form.Label>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <>
                    <Form.Control
                      {...field}
                      type="password"
                      placeholder="Enter your new password"
                      isInvalid={!!errors.newPassword}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.newPassword?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
              <Form.Text className="text-muted">
                Must be at least 8 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <>
                    <Form.Control
                      {...field}
                      type="password"
                      placeholder="Confirm your new password"
                      isInvalid={!!errors.confirmPassword}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Setting up your account...
                </>
              ) : (
                <>
                  Complete Setup & Sign In
                  <IconifyIcon icon="solar:arrow-right-linear" width={20} height={20} className="ms-2" />
                </>
              )}
            </Button>
          </Form>

          <div className="mt-4 pt-3 border-top text-center">
            <p className="text-muted small mb-0">
              Already have an account?{' '}
              <a href="/auth/sign-in" className="text-decoration-none">
                Sign In
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
    </div>
  )
}

const AcceptInvitationPage = () => {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  )
}

export default AcceptInvitationPage