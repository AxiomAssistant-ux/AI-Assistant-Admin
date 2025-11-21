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

const SignUp = () => {
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

      const result = await signUp(data, false) // false = user signup

      if (!result.success) {
        setError(result.error || 'Sign up failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
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
                        Sign Up
                      </h4>
                      <p className="text-muted">New to our platform? Create your user account now!</p>
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
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="checkbox-signin" required />
                          <label className="form-check-label" htmlFor="checkbox-signin">
                            I accept Terms and Conditions
                          </label>
                        </div>
                      </div>
                      <div className="mb-1 text-center d-grid">
                        <button
                          className="btn btn-dark btn-lg fw-medium"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Creating account...' : 'Sign Up'}
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
                <p className="text-center mt-2">
                  <Link href="/auth/admin/sign-up" className="text-decoration-none text-white text-opacity-75">
                    Create Admin Account →
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
