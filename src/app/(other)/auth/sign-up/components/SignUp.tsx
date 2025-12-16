'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import TextFormInput from '@/components/from/TextFormInput'
import PasswordFormInput from '@/components/from/PasswordFormInput'
import { useAuth } from '@/context/useAuthContext'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import * as yup from 'yup'
import { Card, CardBody, Col, Row, Alert, FormCheck, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from 'react-bootstrap'
import type { SignUpRequest } from '@/types/auth'

type SignUpFormData = SignUpRequest & {
  acceptedTerms: boolean
}

const SignUp = () => {
  const router = useRouter()
  const { signUp, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

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

  const messageSchema: yup.ObjectSchema<SignUpFormData> = yup
    .object({
      username: yup
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(64, 'Username must be less than 64 characters')
        .matches(
          /^[a-zA-Z0-9_-]+$/,
          'Username can only contain letters, numbers, underscores, and hyphens'
        )
        .required('Username is required'),
      email: yup
        .string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
        )
        .required('Password is required'),
      confirm_password: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
      acceptedTerms: yup
        .boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('You must accept the terms and conditions'),
    })
    .required()

  const { handleSubmit, control, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      acceptedTerms: false,
    },
    resolver: yupResolver(messageSchema) as Resolver<SignUpFormData>,
  })

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Extract only the fields needed for the API (exclude acceptedTerms)
      const signUpData: SignUpRequest = {
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        confirm_password: data.confirm_password,
      }

      const result = await signUp(signUpData, false) // false = user signup

      if (!result.success) {
        setError(result.error || 'Sign up failed. Please try again.')
        return
      }

      // For user signup, OTP is sent - show success message
      if (result.data) {
        const expiresMinutes = Math.ceil((result.data.expires_in || 600) / 60)
        setSuccess(
          `Verification code sent! Please check your email (${result.data.email}) for the OTP code. The code expires in ${expiresMinutes} minute${expiresMinutes !== 1 ? 's' : ''}.`
        )
        // Optionally redirect to OTP verification page or show OTP input
        // For now, just show success message
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div className="">
        <div className="account-pages py-5">
          <div className="container">
            <Row className=" justify-content-center">
              <Col md={6} lg={5}>
                <Card className=" border-0 shadow-lg">
                  <CardBody className=" p-5">
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
                        <span className="badge bg-primary me-2">User</span>
                        Contact Sales
                      </h4>
                      <p className="text-muted">New to our platform? Create your user account now!</p>
                    </div>

                    {error && (
                      <Alert variant="danger" className="mt-3" dismissible onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}

                    {success && (
                      <Alert variant="success" className="mt-3" dismissible onClose={() => setSuccess(null)}>
                        {success}
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit(handleSignUp)} className="mt-4">
                      <div className="mb-3">
                        <TextFormInput
                          control={control}
                          name="username"
                          placeholder="Enter your username"
                          className="form-control"
                          label="Username"
                        />
                      </div>
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
                          placeholder="Enter your password (min 8 characters)"
                          className="form-control"
                          label="Password"
                        />
                      </div>
                      <div className="mb-3">
                        <PasswordFormInput
                          control={control}
                          name="confirm_password"
                          placeholder="Confirm your password"
                          className="form-control"
                          label="Confirm Password"
                        />
                      </div>
                      <div className="mb-3">
                        <Controller
                          name="acceptedTerms"
                          control={control}
                          render={({ field }) => (
                            <div>
                              <FormCheck
                                type="checkbox"
                                id="checkbox-terms"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                isInvalid={!!errors.acceptedTerms}
                                label={
                                  <span style={{ fontSize: "0.9rem" }}>
                                    I agree to receive recurring automated text messages at the phone
                                    number provided. Msg & data rates may apply. Msg frequency varies.
                                    Reply HELP for help and STOP to end. View our{' '}
                                    <a
                                      href="https://axiom-assistant-frontend.vercel.app/terms"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-underline"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a
                                      href="https://axiom-assistant-frontend.vercel.app/privacy"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-underline"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Privacy Policy
                                    </a>

                                  </span>
                                }
                              />
                              {errors.acceptedTerms && (
                                <div className="invalid-feedback d-block">
                                  {errors.acceptedTerms.message}
                                </div>
                              )}
                            </div>
                          )}
                        />
                      </div>
                      <div className="mb-1 text-center d-grid">
                        <button
                          className="btn btn-dark btn-lg fw-medium"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Creating account...' : 'Contact Sales'}
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
                <p className="text-center mt-4 text-white text-opacity-50">
                  I already have an account&nbsp;
                  <Link href="/auth/sign-in" className="text-decoration-none text-white fw-bold">
                    Sign In
                  </Link>
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </div>

    </>
  )
}

export default SignUp