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

const AdminSignIn = () => {
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

      const result = await signIn(signInData, true) // true = admin login

      if (!result.success) {
        setError(result.error || 'Admin sign in failed. Please check your credentials and try again.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      console.error('Admin login error:', err)
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
                      <span className="badge bg-danger me-2">Admin</span>
                      Welcome Back!
                    </h4>
                    <p className="text-muted">Sign in to your admin account to continue</p>
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
                        {loading ? 'Signing in...' : 'Admin Sign In'}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <p className="text-center mt-4">
                <Link href="/auth/sign-in" className="text-decoration-none text-white text-opacity-75">
                  ← Back to User Sign In
                </Link>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default AdminSignIn

