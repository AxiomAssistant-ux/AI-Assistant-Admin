'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Button, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { verticalsApi, type Vertical } from '@/api/org/verticals'

const UseCaseStep = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [verticals, setVerticals] = useState<Vertical[]>([])
  const [verticalsLoading, setVerticalsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load verticals on mount
  useEffect(() => {
    const loadVerticals = async () => {
      try {
        const data = await verticalsApi.getAll()
        setVerticals(data)
      } catch (err) {
        console.error('Error loading verticals:', err)
        setError('Failed to load use cases. Please refresh the page.')
      } finally {
        setVerticalsLoading(false)
      }
    }

    loadVerticals()
  }, [])

  // Icon mapping for verticals
  const getIconForVertical = (key: string): string => {
    const iconMap: Record<string, string> = {
      'complaint': 'solar:chat-round-call-bold-duotone',
      'food': 'solar:chef-hat-bold-duotone',
      'appointment': 'solar:calendar-bold-duotone',
      'sales': 'solar:chart-bold-duotone',
      'support': 'solar:headphones-round-sound-bold-duotone',
      'healthcare': 'solar:heart-pulse-bold-duotone',
      'real_estate': 'solar:home-2-bold-duotone',
      'hospitality': 'solar:cup-hot-bold-duotone',
    }
    return iconMap[key] || 'solar:widget s-bold-duotone'
  }

  const handleContinue = async () => {
    if (!selectedUseCase) return

    setLoading(true)
    
    // Store selected vertical key
    sessionStorage.setItem('onboarding_usecase', selectedUseCase)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setLoading(false)
    router.push('/onboarding?step=plan')
  }

  const handleBack = () => {
    router.push('/onboarding?step=org')
  }

  if (verticalsLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardBody className="p-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading use cases...</p>
          </div>
        </CardBody>
      </Card>
    )
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
            Help us tailor the AI experience to your specific needs
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Use Case Cards Grid */}
        <div className="row g-3 mb-4">
          {verticals.map(vertical => (
            <div key={vertical.key} className="col-12 col-md-6">
              <div
                className={`p-4 border rounded position-relative h-100 ${
                  selectedUseCase === vertical.key
                    ? 'border-primary border-2 bg-primary bg-opacity-10'
                    : 'border-1'
                }`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setSelectedUseCase(vertical.key)}
                onMouseEnter={(e) => {
                  if (selectedUseCase !== vertical.key) {
                    e.currentTarget.style.borderColor = '#0d6efd'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedUseCase !== vertical.key) {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {/* Selected Indicator */}
                {selectedUseCase === vertical.key && (
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
                    selectedUseCase === vertical.key
                      ? 'bg-primary bg-opacity-20'
                      : 'bg-light'
                  }`}
                  style={{ width: '56px', height: '56px' }}
                >
                  <IconifyIcon 
                    icon={getIconForVertical(vertical.key)} 
                    width={32} 
                    height={32} 
                    className={selectedUseCase === vertical.key ? 'text-primary' : 'text-muted'}
                  />
                </div>

                {/* Title & Description */}
                <h6 className="fw-semibold mb-2">{vertical.name}</h6>
                <p className="text-muted small mb-0">{vertical.description}</p>
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