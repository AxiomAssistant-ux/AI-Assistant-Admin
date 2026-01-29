'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import Image from 'next/image'
import * as yup from 'yup'
import TextFormInput from '@/components/from/TextFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row, Alert } from 'react-bootstrap'
import { authApi } from '@/api/auth'

const ForgotPassword = () => {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.body.classList.add('authentication-bg')
        return () => {
            document.body.classList.remove('authentication-bg')
        }
    }, [])

    const messageSchema = yup.object({
        email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    })

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(messageSchema),
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        setError(null)
        try {
            const response = await authApi.forgotPassword(data.email)
            setSuccess(true)
        } catch (err: any) {
            // Show generic error to prevent email enumeration
            setError('An error occurred. Please try again later.')
            console.error('Password reset error:', err)
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
                                        <h4 className="fw-bold text-dark mb-2">Forgot Password?</h4>
                                        <p className="text-muted">
                                            Enter your email address and we&apos;ll send you instructions to reset your password.
                                        </p>
                                    </div>

                                    {success ? (
                                        <Alert variant="success" className="mt-4">
                                            <div className="d-flex align-items-start">
                                                <i className="mdi mdi-check-circle me-2" style={{ fontSize: '20px' }}></i>
                                                <div>
                                                    <strong>Email Sent!</strong>
                                                    <p className="mb-0 mt-1">
                                                        If an account exists for that email, we&apos;ve sent password reset instructions. 
                                                        Please check your inbox and spam folder.
                                                    </p>
                                                </div>
                                            </div>
                                        </Alert>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                                            {error && (
                                                <Alert variant="danger" className="mb-3">
                                                    <i className="mdi mdi-alert-circle me-2"></i>
                                                    {error}
                                                </Alert>
                                            )}
                                            <div className="mb-3">
                                                <TextFormInput
                                                    control={control}
                                                    name="email"
                                                    placeholder="Enter your email"
                                                    className="form-control"
                                                    label="Email Address"
                                                />
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
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        'Send Reset Link'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="text-center mt-4">
                                        <p className="text-muted mb-0">
                                            Remember your password?{' '}
                                            <Link href="/auth/sign-in" className="text-primary fw-semibold text-decoration-none">
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword