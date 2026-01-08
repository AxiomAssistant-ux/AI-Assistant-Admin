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

const SignIn = () => {
  const router = useRouter()
  const { signIn, isAuthenticated, user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const messageSchema: yup.ObjectSchema<SignInRequest> = yup
    .object({
      email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
      password: yup
        .string()
        .min(1, 'Password is required')
        .required('Password is required'),
    })
    .required()

  useEffect(() => {
    document.body.classList.add('authentication-bg')

    // Redirect if already authenticated
    if (isAuthenticated && user) {
      if (user.actor === 'org') {
        router.push('/dashboards')
      } else if (user.actor === 'platform') {
        router.push('/dashboard')
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

      const result = await signIn(data, false) // false = org user

      if (!result.success) {
        setError(result.error || 'Sign in failed. Please check your credentials.')
      }
      // Success handled by context (auto-redirect)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      console.error('Login error:', err)
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
                    <h4 className="fw-bold text-dark mb-2">Welcome Back!</h4>
                    <p className="text-muted">Sign in to your organization account</p>
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
                        type="email"
                        placeholder="Enter your email"
                        className="form-control"
                        label="Email"
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

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check mb-0">
                        <input type="checkbox" className="form-check-input" id="remember-me" />
                        <label className="form-check-label" htmlFor="remember-me">
                          Remember me
                        </label>
                      </div>
                      <Link href="/auth/reset-password" className="text-muted ms-3">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-primary btn-lg fw-medium"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <Row className="mt-4">
                <Col xs={12} className="text-center">
                  <p className="text-white text-opacity-75 mb-2">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/sign-up" className="text-decoration-none text-white fw-bold">
                      Contact Sales
                    </Link>
                  </p>
                  <p className="text-white text-opacity-50 mb-0">
                    <Link href="/auth/admin/sign-in" className="text-decoration-none text-white text-opacity-75">
                      Platform Admin? Sign in here →
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

export default SignIn