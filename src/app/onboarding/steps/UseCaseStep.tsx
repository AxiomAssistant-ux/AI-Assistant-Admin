'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface UseCase {
  id: string
  icon: string
  title: string
  description: string
}

const useCases: UseCase[] = [
  {
    id: 'sales',
    icon: 'solar:chart-bold-duotone',
    title: 'Sales',
    description: 'Manage leads, track deals, and close more sales with AI-powered insights',
  },
  {
    id: 'support',
    icon: 'solar:headphones-round-sound-bold-duotone',
    title: 'Customer Support',
    description: 'Provide exceptional support with intelligent call routing and ticketing',
  },
  {
    id: 'healthcare',
    icon: 'solar:heart-pulse-bold-duotone',
    title: 'Healthcare',
    description: 'Streamline patient communication and appointment scheduling',
  },
  {
    id: 'real_estate',
    icon: 'solar:home-2-bold-duotone',
    title: 'Real Estate',
    description: 'Connect with buyers and sellers, schedule property viewings effortlessly',
  },
  {
    id: 'hospitality',
    icon: 'solar:cup-hot-bold-duotone',
    title: 'Hospitality',
    description: 'Handle reservations, orders, and guest inquiries seamlessly',
  },
  {
    id: 'other',
    icon: 'solar:widgets-bold-duotone',
    title: 'Other',
    description: 'Flexible solution for any industry or custom use case',
  },
]

const UseCaseStep = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)

  const handleContinue = async () => {
    if (!selectedUseCase) return

    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Store data in sessionStorage for demo purposes
    sessionStorage.setItem('onboarding_usecase', selectedUseCase)
    
    setLoading(false)
    router.push('/onboarding?step=plan')
  }

  const handleBack = () => {
    router.push('/onboarding?step=team')
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardBody className="p-5">
        <div className="text-center mb-4">
          <div className="mb-3">
            <IconifyIcon 
              icon="solar:target-bold-duotone" 
              width={48} 
              height={48} 
              className="text-primary"
            />
          </div>
          <h4 className="fw-bold text-dark mb-2">What is your primary use case?</h4>
          <p className="text-muted">
            Help us tailor the experience to your specific needs
          </p>
        </div>

        {/* Use Case Cards Grid */}
        <div className="row g-3 mb-4">
          {useCases.map(useCase => (
            <div key={useCase.id} className="col-12 col-md-6">
              <div
                className={`p-4 border rounded position-relative h-100 ${
                  selectedUseCase === useCase.id
                    ? 'border-primary border-2 bg-primary bg-opacity-10'
                    : 'border-1'
                }`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setSelectedUseCase(useCase.id)}
                onMouseEnter={(e) => {
                  if (selectedUseCase !== useCase.id) {
                    e.currentTarget.style.borderColor = '#0d6efd'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedUseCase !== useCase.id) {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {/* Selected Indicator */}
                {selectedUseCase === useCase.id && (
                  <div
                    className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                  >
                    <IconifyIcon icon="solar:check-circle-bold" width={20} height={20} />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`rounded-3 d-inline-flex align-items-center justify-content-center mb-3 ${
                    selectedUseCase === useCase.id
                      ? 'bg-primary bg-opacity-20'
                      : 'bg-light'
                  }`}
                  style={{ width: '56px', height: '56px' }}
                >
                  <IconifyIcon 
                    icon={useCase.icon} 
                    width={32} 
                    height={32} 
                    className={selectedUseCase === useCase.id ? 'text-primary' : 'text-muted'}
                  />
                </div>

                {/* Title & Description */}
                <h6 className="fw-semibold mb-2">{useCase.title}</h6>
                <p className="text-muted small mb-0">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="lg"
            className="fw-medium"
            onClick={handleBack}
          >
            <IconifyIcon icon="solar:alt-arrow-left-linear" width={20} height={20} className="me-2" />
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="fw-medium flex-grow-1"
            onClick={handleContinue}
            disabled={!selectedUseCase || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <IconifyIcon icon="solar:alt-arrow-right-linear" width={20} height={20} className="ms-2" />
              </>
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default UseCaseStep