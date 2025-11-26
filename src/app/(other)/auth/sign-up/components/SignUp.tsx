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
                                  <span>
                                    I accept the{' '}
                                    <button
                                      type="button"
                                      className="btn btn-link p-0 text-decoration-underline"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setShowTermsModal(true)
                                      }}
                                      style={{ fontSize: 'inherit', verticalAlign: 'baseline' }}
                                    >
                                      Terms and Conditions
                                    </button>
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

      {/* Terms and Conditions Modal */}
      <Modal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        size="lg"
        centered
        scrollable
      >
        <ModalHeader closeButton>
          <ModalTitle>Terms and Conditions</ModalTitle>
        </ModalHeader>
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="terms-content">
            <h5 className="fw-bold mb-3">1. Acceptance of Terms</h5>
            <p className="mb-3">
              By creating an account and using our services, you agree to be bound by these Terms and Conditions.
              If you do not agree to these terms, please do not use our services.
            </p>

            <h5 className="fw-bold mb-3">2. Account Registration</h5>
            <p className="mb-3">
              To access our services, you must create an account by providing accurate, current, and complete information.
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h5 className="fw-bold mb-3">3. Communication and Messaging</h5>
            <p className="mb-3">
              By creating an account, you consent to receive communications from us via email, SMS, in-app messages,
              and other electronic means. These communications may include:
            </p>
            <ul className="mb-3">
              <li>Account verification and security notifications</li>
              <li>Service updates and announcements</li>
              <li>Marketing and promotional materials</li>
              <li>Transactional messages related to your account</li>
              <li>Customer support communications</li>
            </ul>
            <p className="mb-3">
              You may opt-out of marketing communications at any time by following the unsubscribe instructions
              provided in each message or by contacting our support team.
            </p>

            <h5 className="fw-bold mb-3">4. Email Communications</h5>
            <p className="mb-3">
              We will send you emails for important account-related activities, including but not limited to:
            </p>
            <ul className="mb-3">
              <li>Account verification and password reset requests</li>
              <li>Security alerts and login notifications</li>
              <li>Service updates and maintenance notifications</li>
              <li>Billing and payment confirmations</li>
              <li>Product updates and feature announcements</li>
            </ul>
            <p className="mb-3">
              You acknowledge that these emails are essential for the security and operation of your account
              and cannot be disabled.
            </p>

            <h5 className="fw-bold mb-3">5. User Responsibilities</h5>
            <p className="mb-3">You agree to:</p>
            <ul className="mb-3">
              <li>Provide accurate and truthful information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not engage in any activity that may harm, disrupt, or interfere with the service</li>
              <li>Not share your account credentials with third parties</li>
              <li>Notify us immediately of any security breaches or unauthorized access</li>
            </ul>

            <h5 className="fw-bold mb-3">6. Privacy and Data Protection</h5>
            <p className="mb-3">
              Your privacy is important to us. We collect, use, and protect your personal information in accordance
              with our Privacy Policy. By using our services, you consent to the collection and use of your information
              as described in our Privacy Policy. We implement industry-standard security measures to protect your data,
              but no method of transmission over the internet is 100% secure.
            </p>

            <h5 className="fw-bold mb-3">7. Service Availability</h5>
            <p className="mb-3">
              We strive to provide continuous access to our services but do not guarantee uninterrupted or error-free service.
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time with or without notice.
              We are not liable for any loss or damage resulting from service interruptions or modifications.
            </p>

            <h5 className="fw-bold mb-3">8. Intellectual Property</h5>
            <p className="mb-3">
              All content, features, and functionality of our service, including but not limited to text, graphics, logos,
              icons, images, and software, are the exclusive property of our company and are protected by international
              copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify,
              or create derivative works from any content without our express written permission.
            </p>

            <h5 className="fw-bold mb-3">9. Prohibited Activities</h5>
            <p className="mb-3">You agree not to:</p>
            <ul className="mb-3">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Transmit any viruses, malware, or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>

            <h5 className="fw-bold mb-3">10. Account Termination</h5>
            <p className="mb-3">
              We reserve the right to suspend or terminate your account at any time, with or without cause or notice,
              for any reason including but not limited to violation of these Terms and Conditions. Upon termination,
              your right to use the service will immediately cease. You may also terminate your account at any time
              by contacting our support team.
            </p>

            <h5 className="fw-bold mb-3">11. Limitation of Liability</h5>
            <p className="mb-3">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly,
              or any loss of data, use, goodwill, or other intangible losses resulting from your use of the service.
            </p>

            <h5 className="fw-bold mb-3">12. Indemnification</h5>
            <p className="mb-3">
              You agree to indemnify, defend, and hold harmless our company, its officers, directors, employees,
              and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising
              from your use of the service or violation of these Terms and Conditions.
            </p>

            <h5 className="fw-bold mb-3">13. Changes to Terms</h5>
            <p className="mb-3">
              We reserve the right to modify these Terms and Conditions at any time. We will notify you of any material
              changes via email or through the service. Your continued use of the service after such modifications
              constitutes your acceptance of the updated terms.
            </p>

            <h5 className="fw-bold mb-3">14. Governing Law</h5>
            <p className="mb-3">
              These Terms and Conditions shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law principles. Any disputes arising from these terms shall be resolved
              through binding arbitration or in the appropriate courts.
            </p>

            <h5 className="fw-bold mb-3">15. Contact Information</h5>
            <p className="mb-3">
              If you have any questions about these Terms and Conditions, please contact us through our support channels
              or email us at the address provided in our contact information.
            </p>

            <div className="mt-4 p-3 bg-light rounded">
              <p className="mb-0 small text-muted">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowTermsModal(false)
              // Optionally auto-check the terms checkbox when user closes after viewing
            }}
          >
            I Understand
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default SignUp
