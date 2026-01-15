'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { Row, Col } from 'react-bootstrap'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

const steps = [
  { key: 'org', label: 'Organization', number: 1 },
  { key: 'usecase', label: 'Use Case', number: 2 },
  { key: 'plan', label: 'Pricing', number: 3 },
  { key: 'payment', label: 'Payment', number: 4 },
]

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = searchParams.get('step') || 'org'

  useEffect(() => {
    document.body.classList.add('authentication-bg', 'onboarding-screen')
    return () => {
      document.body.classList.remove('authentication-bg', 'onboarding-screen')
    }
  }, [])

  // Redirect to first step if invalid step
  useEffect(() => {
    const validSteps = steps.map(s => s.key)
    if (!validSteps.includes(currentStep)) {
      router.push('/onboarding?step=org')
    }
  }, [currentStep, router])

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)
  const currentStepNumber = currentStepIndex + 1
  const totalSteps = steps.length

  return (
    <div className="onboarding-container">
      {/* Animated Background */}
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
      </div>

      {/* Content Overlay */}
      <div className="onboarding-content">
        <div className="container">
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              {/* Logo */}
              {/* <div className="text-center mb-4">
                <div className="mx-auto auth-logo">
                  <Link href="/" className="logo-dark">
                    <Image src={DarkLogo} height={40} alt="logo dark" />
                  </Link>
                  <Link href="/" className="logo-light">
                    <Image src={LightLogo} height={40} alt="logo light" />
                  </Link>
                </div>
              </div> */}

              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-white text-opacity-90 fw-medium">
                    Step {currentStepNumber} of {totalSteps}
                  </span>
                  <span className="text-white text-opacity-90 fw-medium">
                    {steps[currentStepIndex]?.label}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="progress modern-progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ 
                      width: `${(currentStepNumber / totalSteps) * 100}%`,
                      transition: 'width 0.3s ease'
                    }}
                    aria-valuenow={currentStepNumber}
                    aria-valuemin={1}
                    aria-valuemax={totalSteps}
                  />
                </div>

                {/* Step Dots */}
                <div className="d-flex justify-content-between mt-3">
                  {steps.map((step, idx) => (
                    <div
                      key={step.key}
                      className="d-flex flex-column align-items-center"
                      style={{ flex: 1 }}
                    >
                      <div
                        className={`step-dot ${
                          idx < currentStepIndex
                            ? 'completed'
                            : idx === currentStepIndex
                            ? 'active'
                            : 'inactive'
                        }`}
                      >
                        {idx < currentStepIndex ? (
                          <IconifyIcon icon="solar:check-circle-bold" width={20} height={20} />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span 
                        className={`step-label ${idx <= currentStepIndex ? 'active' : ''}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Card */}
              <div className="">
                {children}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default OnboardingLayout