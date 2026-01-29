'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import Image from 'next/image'
import * as yup from 'yup'
import TextFormInput from '@/components/from/TextFormInput'
import PasswordInput from '@/components/from/PasswordFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Card, CardBody, Col, Row, Alert, Spinner } from 'react-bootstrap'
import { authApi } from '@/api/auth'

const ResetPassword = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [verifying, setVerifying] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)
    const [userEmail, setUserEmail] = useState<string>('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        document.body.classList.add('authentication-bg')
        return () => {
            document.body.classList.remove('authentication-bg')
        }
    }, [])

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Invalid or missing reset token')
                setVerifying(false)
                return
            }

            try {
                const response = await authApi.verifyResetToken(token)
                setUserEmail(response.email)
                setTokenValid(true)
            } catch (err: any) {
                setError(err.message || 'This reset link is invalid or has expired')
                setTokenValid(false)
            } finally {
                setVerifying(false)
            }
        }

        verifyToken()
    }, [token])

    const passwordSchema = yup.object({
        new_password: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .required('Please enter a new password'),
        confirm_password: yup
            .string()
            .oneOf([yup.ref('new_password')], 'Passwords must match')
            .required('Please confirm your password'),
    })

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(passwordSchema),
    })

    const onSubmit = async (data: any) => {
        if (!token) {
            setError('Invalid reset token')
            return
        }

        setLoading(true)
        setError(null)

        try {
            await authApi.resetPassword(token, data.new_password, data.confirm_password)
            setSuccess(true)
            
            // Redirect to sign in after 3 seconds
            setTimeout(() => {
                router.push('/auth/sign-in')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    // Loading state while verifying token
    if (verifying) {
        return (
            <div className="">
                <div className="account-pages py-5">
                    <div className="container">
                        <Row className="justify-content-center">
                            <Col md={6} lg={5}>
                                <Card className="border-0 shadow-lg">
                                    <CardBody className="p-5 text-center">
                                        <Spinner animation="border" variant="primary" className="mb-3" />
                                        <p className="text-muted">Verifying reset link...</p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }

    // Invalid token state
    if (!tokenValid) {
        return (
            <div className="">
                <div className="account-pages py-5">
                    <div className="container">
                        <Row className="justify-content-center">
                            <Col md={6} lg={5}>
                                <Card className="border-0 shadow-lg">
                                    <CardBody className="p-5">
                                        <div className="text-center mb-4">
                                            <div className="mx-auto mb-4 text-center auth-logo">
                                                <Link href="/" className="logo-dark">
                                                    <Image src={DarkLogo} height={32} alt="logo dark" />
                                                </Link>
                                                <Link href="/" className="logo-light">
                                                    <Image src={LightLogo} height={28} alt="logo light" />
                                                </Link>
                                            </div>
                                            <h4 className="fw-bold text-danger mb-2">Invalid Reset Link</h4>
                                        </div>

                                        <Alert variant="danger">
                                            <i className="mdi mdi-alert-circle me-2"></i>
                                            {error || 'This password reset link is invalid or has expired.'}
                                        </Alert>

                                        <div className="d-grid gap-2">
                                            <Link 
                                                href="/auth/forgot-password" 
                                                className="btn btn-primary btn-lg fw-medium"
                                            >
                                                Request New Reset Link
                                            </Link>
                                            <Link 
                                                href="/auth/sign-in" 
                                                className="btn btn-outline-secondary"
                                            >
                                                Back to Sign In
                                            </Link>
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

    // Success state
    if (success) {
        return (
            <div className="">
                <div className="account-pages py-5">
                    <div className="container">
                        <Row className="justify-content-center">
                            <Col md={6} lg={5}>
                                <Card className="border-0 shadow-lg">
                                    <CardBody className="p-5">
                                        <div className="text-center mb-4">
                                            <div className="mx-auto mb-4 text-center auth-logo">
                                                <Link href="/" className="logo-dark">
                                                    <Image src={DarkLogo} height={32} alt="logo dark" />
                                                </Link>
                                                <Link href="/" className="logo-light">
                                                    <Image src={LightLogo} height={28} alt="logo light" />
                                                </Link>
                                            </div>
                                            <div className="text-success mb-3">
                                                <i className="mdi mdi-check-circle" style={{ fontSize: '48px' }}></i>
                                            </div>
                                            <h4 className="fw-bold text-dark mb-2">Password Reset Successful!</h4>
                                        </div>

                                        <Alert variant="success">
                                            Your password has been reset successfully. Redirecting to sign in...
                                        </Alert>

                                        <div className="text-center mt-4">
                                            <Link 
                                                href="/auth/sign-in" 
                                                className="btn btn-primary btn-lg fw-medium"
                                            >
                                                Go to Sign In
                                            </Link>
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

    // Reset password form
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
                                        <h4 className="fw-bold text-dark mb-2">Reset Your Password</h4>
                                        <p className="text-muted">
                                            Enter a new password for <strong>{userEmail}</strong>
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                                        {error && (
                                            <Alert variant="danger" className="mb-3">
                                                <i className="mdi mdi-alert-circle me-2"></i>
                                                {error}
                                            </Alert>
                                        )}

                                        <div className="mb-3">
                                            <PasswordInput
                                                control={control}
                                                name="new_password"
                                                placeholder="Enter new password"
                                                className="form-control"
                                                label="New Password"
                                            />
                                            <small className="text-muted">
                                                Must be at least 8 characters
                                            </small>
                                        </div>

                                        <div className="mb-3">
                                            <PasswordInput
                                                control={control}
                                                name="confirm_password"
                                                placeholder="Confirm new password"
                                                className="form-control"
                                                label="Confirm Password"
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
                                                        Resetting Password...
                                                    </>
                                                ) : (
                                                    'Reset Password'
                                                )}
                                            </button>
                                        </div>
                                    </form>

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

export default ResetPassword