'use client'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import TextFormInput from '@/components/from/TextFormInput'
import PasswordFormInput from '@/components/from/PasswordFormInput'
import { useAuth } from '@/context/useAuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row, Alert } from 'react-bootstrap'
import { useForm, type Resolver } from 'react-hook-form'
import * as yup from 'yup'
import type { SignInRequest } from '@/types/auth'

const PlatformSignIn = () => {
  const router = useRouter()
  const { signIn, isAuthenticated, user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const messageSchema: yup.ObjectSchema<SignInRequest> = yup
    .object({
      email: yup
        .string()
        .trim()
        .min(1, 'Email or username is required')
        .required('Email or username is required'),
      password: yup
        .string()
        .min(1, 'Password is required')
        .required('Password is required'),
    })
    .required()

  useEffect(() => {
    document.body.classList.add('authentication-bg')

    // 🔴 FIX: Check both authentication AND actor type
    if (isAuthenticated && user) {
      // Platform admin should go to platform dashboard
      if (user.actor === 'platform') {
        router.push('/dashboard')
      }
      // Org user accidentally on this page? Send to org dashboard
      else if (user.actor === 'org') {
        router.push('/dashboards')
      }
    }

    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [isAuthenticated, user, router])

  const { handleSubmit, control } = useForm<SignInRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(messageSchema) as Resolver<SignInRequest>,
    mode: 'onBlur',
  })

  const handleLogin = async (data: SignInRequest) => {
    try {
      setLoading(true)
      setError(null)

      const signInData: SignInRequest = {
        email: data.email.trim(),
        password: data.password,
      }

      const result = await signIn(signInData, true) // true = platform admin login

      if (!result.success) {
        setError(result.error || 'Platform admin sign in failed. Please check your credentials and try again.')
      }
      // Success case: signIn() in AuthContext will handle the redirect
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      console.error('Platform admin login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="">
      <div className="account-pages py-5">
        <div className="container">
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="border-0 shadow-lg">
                <CardBody className="p-5">
                  <div className="text-center">
                    <div className="mx-auto mb-4 text-center auth-logo">
                      <Link href="/" className="logo-dark">
                        <Image src={DarkLogo} height={32} alt="logo dark" />
                      </Link>
                      <Link href="/" className="logo-light">
                        <Image src={LightLogo} height={28} alt="logo light" />
                      </Link>
                    </div>
                    <h4 className="fw-bold text-dark mb-2">
                      <span className="badge bg-danger me-2">Platform Admin</span>
                      Welcome Back!
                    </h4>
                    <p className="text-muted">Sign in to the platform administration panel</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mt-3" dismissible onClose={() => setError(null)}>
                      {error}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit(handleLogin)} className="mt-4">
                    <div className="mb-3">
                      <TextFormInput
                        control={control}
                        name="email"
                        type="text"
                        placeholder="Enter your email or username"
                        className="form-control"
                        label="Email or Username"
                      />
                    </div>
                    <div className="mb-3">
                      <PasswordFormInput
                        control={control}
                        name="password"
                        placeholder="Enter your password"
                        className="form-control"
                        label="Password"
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input type="checkbox" className="form-check-input" id="remember-me" />
                      <label className="form-check-label" htmlFor="remember-me">
                        Remember me
                      </label>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-danger btn-lg fw-medium"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Platform Admin Sign In'}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <Row className="mt-4">
                <Col xs={12} className="text-center">
                  <p className="text-white text-opacity-50 mb-0">
                    <Link href="/auth/sign-in" className="text-decoration-none text-white text-opacity-75">
                      ← Back to Org User Sign In
                    </Link>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default PlatformSignIn