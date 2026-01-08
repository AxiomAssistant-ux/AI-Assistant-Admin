'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import DarkLogo from '@/assets/images/logo-dark.png'
import LightLogo from '@/assets/images/logo-light.png'
import { Row, Col } from 'react-bootstrap'

interface OnboardingLayoutProps {
  children: React.ReactNode
}

const steps = [
  { key: 'org', label: 'Organization', number: 1 },
  { key: 'team', label: 'Team Setup', number: 2 },
  { key: 'usecase', label: 'Use Case', number: 3 },
  { key: 'plan', label: 'Pricing', number: 4 },
  { key: 'payment', label: 'Payment', number: 5 },
]

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = searchParams.get('step') || 'org'

  useEffect(() => {
    document.body.classList.add('authentication-bg')
    return () => {
      document.body.classList.remove('authentication-bg')
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
    <div className="account-pages py-5">
      <div className="container">
        <Row className="justify-content-center">
          <Col md={8} lg={7} xl={6}>
            {/* Logo */}
            <div className="text-center mb-4">
              <div className="mx-auto auth-logo">
                <Link href="/" className="logo-dark">
                  <Image src={LightLogo} height={32} alt="logo dark" />
                </Link>
                <Link href="/" className="logo-light">
                  <Image src={LightLogo} height={32} alt="logo light" />
                </Link>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-white text-opacity-75 small">
                  Step {currentStepNumber} of {totalSteps}
                </span>
                <span className="text-white text-opacity-75 small">
                  {steps[currentStepIndex]?.label}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="progress" style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
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
              <div className="d-flex justify-content-between mt-2">
                {steps.map((step, idx) => (
                  <div
                    key={step.key}
                    className="d-flex flex-column align-items-center"
                    style={{ flex: 1 }}
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        idx < currentStepIndex
                          ? 'bg-success'
                          : idx === currentStepIndex
                          ? 'bg-primary'
                          : 'bg-white bg-opacity-10'
                      }`}
                      style={{
                        width: '32px',
                        height: '32px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: idx <= currentStepIndex ? 'white' : 'rgba(255,255,255,0.5)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {idx < currentStepIndex ? '✓' : step.number}
                    </div>
                    <span 
                      className="text-white small mt-1 d-none d-md-block" 
                      style={{ 
                        fontSize: '10px',
                        opacity: idx <= currentStepIndex ? 1 : 0.5
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            {children}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default OnboardingLayout