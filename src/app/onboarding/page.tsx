'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import OrganizationStep from './steps/OrganizationStep'
import UseCaseStep from './steps/UseCaseStep'
import PricingPlansStep from './steps/PricingPlansStep'
import PaymentStep from './steps/PaymentStep'

const OnboardingContent = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step') || 'org'

  const renderStep = () => {
    switch (step) {
      case 'org':
        return <OrganizationStep />
      case 'usecase':
        return <UseCaseStep />
      case 'plan':
        return <PricingPlansStep />
      case 'payment':
        return <PaymentStep />
      default:
        return <OrganizationStep />
    }
  }

  return renderStep()
}

const OnboardingPage = () => {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}

export default OnboardingPage