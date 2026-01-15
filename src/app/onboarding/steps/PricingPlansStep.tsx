'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Button, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  popular?: boolean
  features: string[]
  cta: string
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    period: 'month',
    features: [
      'Up to 500 calls/month',
      'Basic call analytics',
      'Email support',
      '2 team members',
      'Action item tracking',
      '30-day call history',
    ],
    cta: 'Start with Starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    period: 'month',
    popular: true,
    features: [
      'Up to 2,000 calls/month',
      'Advanced analytics & insights',
      'Priority support',
      'Unlimited team members',
      'CRM integrations',
      'Custom workflows',
      '1-year call history',
      'API access',
    ],
    cta: 'Choose Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    period: 'month',
    features: [
      'Unlimited calls',
      'Custom AI training',
      'Dedicated account manager',
      'White-label options',
      'Advanced security & compliance',
      'Custom integrations',
      'Unlimited history',
      'SLA guarantee',
    ],
    cta: 'Go Enterprise',
  },
]

const PricingPlansStep = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>('pro')

  const handleContinue = async () => {
    if (!selectedPlan) return

    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Store data in sessionStorage for demo purposes
    sessionStorage.setItem('onboarding_plan', selectedPlan)
    
    setLoading(false)
    router.push('/onboarding?step=payment')
  }

  const handleBack = () => {
    router.push('/onboarding?step=usecase')
  }

  return (
    <Card className="onboarding-card">
      <CardBody className="">
        <div className="text-center mb-4">
          <div className="mb-3">
            <IconifyIcon 
              icon="solar:ticket-sale-bold-duotone" 
              width={48} 
              height={48} 
              className="text-primary"
            />
          </div>
          <h4 className="fw-bold text-dark mb-2">Choose the right plan for you</h4>
          <p className="text-muted">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="row g-3 mb-4">
          {plans.map(plan => (
            <div key={plan.id} className="col-12">
              <div
                className={`p-4 border rounded position-relative ${
                  selectedPlan === plan.id
                    ? 'border-primary border-2 bg-primary bg-opacity-10'
                    : 'border-1'
                } ${plan.popular ? 'shadow-sm' : ''}`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setSelectedPlan(plan.id)}
                onMouseEnter={(e) => {
                  if (selectedPlan !== plan.id) {
                    e.currentTarget.style.borderColor = '#0d6efd'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPlan !== plan.id) {
                    e.currentTarget.style.borderColor = '#dee2e6'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = plan.popular ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                  }
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 start-50 translate-middle px-3 py-2"
                  >
                    Most Popular
                  </Badge>
                )}

                {/* Selected Indicator */}
                {selectedPlan === plan.id && (
                  <div
                    className="position-absolute top-0 end-0 m-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px' }}
                  >
                    <IconifyIcon icon="solar:check-circle-bold" width={20} height={20} />
                  </div>
                )}

                <div className="row align-items-center">
                  {/* Plan Info */}
                  <div className="col-12 col-md-4 mb-3 mb-md-0">
                    <h5 className="fw-bold mb-2">{plan.name}</h5>
                    <div className="d-flex align-items-baseline gap-1">
                      <span className="h3 fw-bold mb-0">${plan.price}</span>
                      <span className="text-muted">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="col-12 col-md-8">
                    <div className="row row-cols-1 row-cols-sm-2 g-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="col">
                          <div className="d-flex align-items-start gap-2">
                            <IconifyIcon 
                              icon="solar:check-circle-bold" 
                              width={18} 
                              height={18} 
                              className="text-success flex-shrink-0 mt-1"
                            />
                            <span className="small">{feature}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Billing Notice */}
        <div className="alert alert-info d-flex align-items-start gap-2 mb-4">
          <IconifyIcon icon="solar:info-circle-bold" width={20} height={20} className="mt-1 flex-shrink-0" />
          <div className="small">
            <strong>14-day free trial included.</strong> You will not be charged until your trial ends. 
            Cancel anytime during the trial period.
          </div>
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
            disabled={!selectedPlan || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <IconifyIcon icon="solar:alt-arrow-right-linear" width={20} height={20} className="ms-2" />
              </>
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default PricingPlansStep