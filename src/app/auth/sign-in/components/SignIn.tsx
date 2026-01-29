'use client'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import SmallLogo from '@/assets/images/logo-sm.png'
import TextFormInput from '@/components/from/TextFormInput'
import PasswordFormInput from '@/components/from/PasswordFormInput'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
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
    document.body.classList.add('authentication-bg', 'split-screen-auth')

    // Redirect if already authenticated
    if (isAuthenticated && user) {
      if (user.actor === 'org') {
        router.push('/dashboards')
      } else if (user.actor === 'platform') {
        router.push('/dashboard')
      }
    }

    return () => {
      document.body.classList.remove('authentication-bg', 'split-screen-auth')
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
    <div className="split-screen-container">

      {/* Left Side - Animated Background */}
      <div className="split-left">
        <div className="animated-background">
          <a
            href="https://assistant.axiomsolinc.com/"
            className="back-to-site-left"
          >
            <IconifyIcon icon="solar:arrow-left-linear" width={18} height={18} />
            <span>Back to site</span>
          </a>

          {/* Floating orbs */}
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>

          {/* Floating shapes */}
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>

          {/* Content overlay */}
          <div className="left-content">
            <div className="brand-section">
              <div className="brand-icon">
                <IconifyIcon icon="solar:widget-bold-duotone" width={48} height={48} />
              </div>
              <h2 className="brand-title">Welcome to AI Assistant</h2>
              <p className="brand-description">
                Streamline your workflow with intelligent automation and real-time insights
              </p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <IconifyIcon icon="solar:shield-check-bold" width={24} height={24} />
                </div>
                <div className="feature-text">
                  <h4>Secure & Reliable</h4>
                  <p>Enterprise-grade security for your data</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <IconifyIcon icon="solar:chart-bold" width={24} height={24} />
                </div>
                <div className="feature-text">
                  <h4>Real-time Analytics</h4>
                  <p>Make data-driven decisions instantly</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <IconifyIcon icon="solar:users-group-rounded-bold" width={24} height={24} />
                </div>
                <div className="feature-text">
                  <h4>Team Collaboration</h4>
                  <p>Work seamlessly with your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="split-right">
        <div className="form-container">
          <div className="form-wrapper">
            <div className="text-center mb-4">
              <div className="auth-logo mb-4">
                <Link href="/" className="logo-dark">
                  <Image src={SmallLogo} height={80} alt="logo dark" />
                </Link>
                <Link href="/" className="logo-light">
                  <Image src={SmallLogo} height={80} alt="logo light" />
                </Link>
              </div>
              <h3 className="fw-bold text-dark mb-2">Sign In</h3>
              <p className="text-muted">Enter your credentials to access your account</p>
            </div>

            {error && (
              <Alert variant="danger" className="modern-alert" dismissible onClose={() => setError(null)}>
                <div className="d-flex align-items-center gap-2">
                  <IconifyIcon icon="solar:danger-circle-bold" width={18} height={18} />
                  <span>{error}</span>
                </div>
              </Alert>
            )}

            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="mb-3">
                <TextFormInput
                  control={control}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="form-control modern-input"
                  label="Email Address"
                />
              </div>

              <div className="mb-3">
                <PasswordFormInput
                  control={control}
                  name="password"
                  placeholder="Enter your password"
                  className="form-control modern-input"
                  label="Password"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check mb-0">
                  <input type="checkbox" className="form-check-input" id="remember-me" />
                  <label className="form-check-label text-muted" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-primary fw-medium">
                  Forgot password?
                </Link>
              </div>

              <div className="d-grid mb-4">
                <button
                  className="btn btn-primary btn-lg fw-medium modern-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <IconifyIcon icon="solar:arrow-right-linear" width={20} height={20} className="ms-2" />
                    </>
                  )}
                </button>
              </div>

              {/* <div className="text-center">
                <p className="text-muted mb-2">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/sign-up" className="text-primary fw-semibold">
                    Contact Sales
                  </Link>
                </p>
                <p className="text-muted small mb-0">
                  <Link href="/auth/admin/sign-in" className="text-muted d-inline-flex align-items-center gap-1">
                    Platform Admin? Sign in here
                    <IconifyIcon icon="solar:arrow-right-linear" width={14} height={14} />
                  </Link>
                </p>
              </div> */}
            </form>
          </div>
        </div>
      </div>


    </div>
  )
}

export default SignIn