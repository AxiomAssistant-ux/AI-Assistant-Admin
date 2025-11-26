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
  const { signIn, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const messageSchema: yup.ObjectSchema<SignInRequest> = yup
    .object({
      email: yup
        .string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    })
    .required()

  useEffect(() => {
    document.body.classList.add('authentication-bg')

    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push('/dashboards')
    }

    return () => {
      document.body.classList.remove('authentication-bg')
    }
  }, [isAuthenticated, router])

  const { handleSubmit, control } = useForm<SignInRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(messageSchema) as Resolver<SignInRequest>,
    mode: 'onBlur', // Validate on blur for better UX
  })

  const handleLogin = async (data: SignInRequest) => {
    try {
      setLoading(true)
      setError(null)

      // Trim email before sending
      const signInData: SignInRequest = {
        email: data.email.trim(),
        password: data.password,
      }

      const result = await signIn(signInData, false) // false = user login

      if (!result.success) {
        setError(result.error || 'Sign in failed. Please check your credentials and try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
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
                      <a href="/" className="logo-dark">
                        <Image src={DarkLogo} height={32} alt="logo dark" />
                      </a>
                      <a href="/" className="logo-light">
                        <Image src={LightLogo} height={28} alt="logo light" />
                      </a>
                    </div>
                    <h4 className="fw-bold text-dark mb-2">
                      <span className="badge bg-primary me-2">User</span>
                      Welcome Back!
                    </h4>
                    <p className="text-muted">Sign in to your user account to continue</p>
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
                        label="Email Address"
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
                        className="btn btn-dark btn-lg fw-medium"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Signing in...' : 'Sign In'}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <p className="text-center mt-4 text-white text-opacity-50">
                Don&apos;t have an account?
                <Link href="/auth/sign-up" className="text-decoration-none text-white fw-bold ms-1">
              Contact Sales
                </Link>
              </p>
              <p className="text-center mt-2">
                <Link href="/auth/admin/sign-in" className="text-decoration-none text-white text-opacity-75">
                  Admin Sign In →
                </Link>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default SignIn
