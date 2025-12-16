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
import { useForm, type Resolver } from 'react-hook-form'
import * as yup from 'yup'
import { Card, CardBody, Col, Row, Alert } from 'react-bootstrap'
import type { SignUpRequest } from '@/types/auth'

const AdminSignUp = () => {
  const router = useRouter()
  const { signUp, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  const messageSchema: yup.ObjectSchema<SignUpRequest> = yup
    .object({
      username: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(64, 'Username must be less than 64 characters')
        .required('Username is required'),
      email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
      password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .required('Password is required'),
      confirm_password: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    })
    .required()

  const { handleSubmit, control } = useForm<SignUpRequest>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(messageSchema) as Resolver<SignUpRequest>,
  })

  const handleSignUp = async (data: SignUpRequest) => {
    try {
      setLoading(true)
      setError(null)

      const result = await signUp(data, true) // true = admin signup

      if (!result.success) {
        setError(result.error || 'Admin sign up failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Admin signup error:', err)
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
                        <span className="badge bg-danger me-2">Admin</span>
                        Sign Up
                      </h4>
                      <p className="text-muted">Create your admin account. Only authorized personnel.</p>
                    </div>

                    {error && (
                      <Alert variant="danger" className="mt-3" dismissible onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit(handleSignUp)} className="mt-4">
                      <div className="mb-3">
                        <TextFormInput
                          control={control}
                          name="username"
                          placeholder="Enter admin username"
                          className="form-control"
                          label="Admin Username"
                        />
                      </div>
                      <div className="mb-3">
                        <TextFormInput
                          control={control}
                          name="email"
                          type="email"
                          placeholder="Enter admin email"
                          className="form-control"
                          label="Admin Email"
                        />
                      </div>
                      <div className="mb-3">
                        <PasswordFormInput
                          control={control}
                          name="password"
                          placeholder="Enter password (min 8 characters)"
                          className="form-control"
                          label="Password"
                        />
                      </div>
                      <div className="mb-3">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkbox-signin" required />
                          <label className="form-check-label" htmlFor="checkbox-signin">
                            I agree to receive recurring automated text messages at the phone
                            number provided. Msg & data rates may apply. Msg frequency varies.
                            Reply HELP for help and STOP to end. View our{' '}
                            <a
                              href="https://assistant.axiomsolinc.com/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-underline"
                              style={{ cursor: 'pointer' }}
                            >
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a
                              href="https://assistant.axiomsolinc.com/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-underline"
                              style={{ cursor: 'pointer' }}
                            >
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>
                      <div className="mb-1 text-center d-grid">
                        <button
                          className="btn btn-danger btn-lg fw-medium"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Creating admin account...' : 'Admin Sign Up'}
                        </button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
                <p className="text-center mt-4 text-white text-opacity-50">
                  I already have an admin account&nbsp;
                  <Link href="/auth/admin/sign-in" className="text-decoration-none text-white fw-bold">
                    Sign In
                  </Link>
                </p>
                <p className="text-center mt-2">
                  <Link href="/auth/sign-up" className="text-decoration-none text-white text-opacity-75">
                    ← Create User Account Instead
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

export default AdminSignUp

