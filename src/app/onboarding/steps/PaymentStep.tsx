// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardBody, Button, Form, Alert } from 'react-bootstrap'
// import IconifyIcon from '@/components/wrapper/IconifyIcon'

// const PaymentStep = () => {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [cardNumber, setCardNumber] = useState('')
//   const [expiryDate, setExpiryDate] = useState('')
//   const [cvv, setCvv] = useState('')
//   const [cardName, setCardName] = useState('')

//   // Get selected plan from sessionStorage (demo purposes)
//   const selectedPlanId = typeof window !== 'undefined' 
//     ? sessionStorage.getItem('onboarding_plan') || 'pro'
//     : 'pro'

//   const planDetails = {
//     starter: { name: 'Starter', price: 49 },
//     pro: { name: 'Pro', price: 149 },
//     enterprise: { name: 'Enterprise', price: 499 },
//   }

//   const plan = planDetails[selectedPlanId as keyof typeof planDetails] || planDetails.pro

//   const formatCardNumber = (value: string) => {
//     const cleaned = value.replace(/\s/g, '').replace(/\D/g, '')
//     const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
//     return formatted.substring(0, 19) // Max 16 digits + 3 spaces
//   }

//   const formatExpiryDate = (value: string) => {
//     const cleaned = value.replace(/\D/g, '')
//     if (cleaned.length >= 2) {
//       return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
//     }
//     return cleaned
//   }

//   const handleCompleteSetup = async () => {
//     setLoading(true)
    
//     // Simulate payment processing
//     await new Promise(resolve => setTimeout(resolve, 2000))
    
//     // Clear onboarding data
//     if (typeof window !== 'undefined') {
//       sessionStorage.removeItem('onboarding_org')
//       sessionStorage.removeItem('onboarding_team')
//       sessionStorage.removeItem('onboarding_usecase')
//       sessionStorage.removeItem('onboarding_plan')
//     }
    
//     // Redirect to dashboard
//     router.push('/dashboards')
//   }

//   const handleBack = () => {
//     router.push('/onboarding?step=plan')
//   }

//   return (
//     <Card className="border-0 shadow-lg">
//       <CardBody className="p-5">
//         <div className="text-center mb-4">
//           <div className="mb-3">
//             <IconifyIcon 
//               icon="solar:card-bold-duotone" 
//               width={48} 
//               height={48} 
//               className="text-primary"
//             />
//           </div>
//           <h4 className="fw-bold text-dark mb-2">Start your free trial</h4>
//           <p className="text-muted">
//             Your card will not be charged until after your 14-day trial
//           </p>
//         </div>

//         {/* Plan Summary */}
//         <div className="p-4 bg-light rounded mb-4">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div>
//               <h6 className="fw-semibold mb-1">{plan.name} Plan</h6>
//               <p className="text-muted small mb-0">Billed monthly</p>
//             </div>
//             <div className="text-end">
//               <div className="h5 fw-bold mb-0">${plan.price}/mo</div>
//               <small className="text-muted">after trial</small>
//             </div>
//           </div>
          
//           <div className="border-top pt-3">
//             <div className="d-flex justify-content-between align-items-center">
//               <span className="text-muted">Due today</span>
//               <span className="fw-bold h5 mb-0 text-success">$0.00</span>
//             </div>
//             <small className="text-muted d-block mt-2">
//               <IconifyIcon icon="solar:shield-check-bold" width={16} height={16} className="me-1" />
//               Free 14-day trial • Cancel anytime
//             </small>
//           </div>
//         </div>

//         {/* Payment Form */}
//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>Cardholder Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="John Doe"
//               value={cardName}
//               onChange={(e) => setCardName(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Card Number</Form.Label>
//             <div className="position-relative">
//               <Form.Control
//                 type="text"
//                 placeholder="1234 5678 9012 3456"
//                 value={cardNumber}
//                 onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
//                 className="pe-5"
//               />
//               <div 
//                 className="position-absolute top-50 end-0 translate-middle-y pe-3"
//                 style={{ pointerEvents: 'none' }}
//               >
//                 <IconifyIcon icon="solar:card-linear" width={24} height={24} className="text-muted" />
//               </div>
//             </div>
//           </Form.Group>

//           <div className="row g-3 mb-4">
//             <div className="col-6">
//               <Form.Group>
//                 <Form.Label>Expiry Date</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="MM/YY"
//                   value={expiryDate}
//                   onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
//                   maxLength={5}
//                 />
//               </Form.Group>
//             </div>
//             <div className="col-6">
//               <Form.Group>
//                 <Form.Label>CVV</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="123"
//                   value={cvv}
//                   onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
//                   maxLength={4}
//                 />
//               </Form.Group>
//             </div>
//           </div>

//           {/* Security Notice */}
//           <Alert variant="success" className="d-flex align-items-start gap-2 mb-4">
//             <IconifyIcon icon="solar:shield-check-bold" width={20} height={20} className="mt-1 flex-shrink-0" />
//             <div className="small">
//               <strong>Your payment is secure.</strong> We use bank-level encryption to protect your information. 
//               Your card details are never stored on our servers.
//             </div>
//           </Alert>

//           {/* Terms */}
//           <p className="text-muted small mb-4">
//             By completing this purchase, you agree to our{' '}
//             <a href="#" className="text-decoration-none">Terms of Service</a> and{' '}
//             <a href="#" className="text-decoration-none">Privacy Policy</a>. 
//             You can cancel your subscription at any time before the trial ends.
//           </p>

//           {/* Action Buttons */}
//           <div className="d-flex gap-2">
//             <Button
//               variant="outline-secondary"
//               size="lg"
//               className="fw-medium"
//               onClick={handleBack}
//               disabled={loading}
//             >
//               <IconifyIcon icon="solar:alt-arrow-left-linear" width={20} height={20} className="me-2" />
//               Back
//             </Button>
//             <Button
//               variant="success"
//               size="lg"
//               className="fw-medium flex-grow-1"
//               onClick={handleCompleteSetup}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <IconifyIcon icon="solar:check-circle-bold" width={20} height={20} className="me-2" />
//                   Complete Setup
//                 </>
//               )}
//             </Button>
//           </div>
//         </Form>

//         {/* Features Reminder */}
//         <div className="mt-4 pt-4 border-top">
//           <p className="text-muted small fw-semibold mb-2">What happens next?</p>
//           <div className="d-flex flex-column gap-2">
//             <div className="d-flex align-items-start gap-2">
//               <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="text-success mt-1 flex-shrink-0" />
//               <span className="small text-muted">Instant access to all {plan.name} features</span>
//             </div>
//             <div className="d-flex align-items-start gap-2">
//               <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="text-success mt-1 flex-shrink-0" />
//               <span className="small text-muted">14 days to explore risk-free</span>
//             </div>
//             <div className="d-flex align-items-start gap-2">
//               <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="text-success mt-1 flex-shrink-0" />
//               <span className="small text-muted">Email reminder 2 days before trial ends</span>
//             </div>
//           </div>
//         </div>
//       </CardBody>
//     </Card>
//   )
// }

// export default PaymentStep

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/useAuthContext'
import { Card, CardBody, Button, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { organizationsApi } from '@/api/org/organizations'

const PaymentStep = () => {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCompleteSetup = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get data from sessionStorage
      const orgDataStr = sessionStorage.getItem('onboarding_org')
      const verticalKey = sessionStorage.getItem('onboarding_usecase')
      
      if (!orgDataStr || !verticalKey) {
        throw new Error('Missing onboarding data. Please start over.')
      }

      const orgData = JSON.parse(orgDataStr)
      
      // Call backend to complete onboarding
      await organizationsApi.completeOnboarding({
        company_name: orgData.companyName,
        industry: orgData.industry,
        vertical_key: verticalKey,
        logo_url: orgData.logoUrl || undefined,
        color_scheme: [orgData.primaryColor, orgData.secondaryColor],
      })

      // Clear sessionStorage
      sessionStorage.removeItem('onboarding_org')
      sessionStorage.removeItem('onboarding_usecase')
      sessionStorage.removeItem('onboarding_plan')

      // Refresh user data to get updated org_id and status
      await refreshUser()

      // Small delay to ensure refresh completes
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to dashboard (auth context will handle protection)
      router.push('/dashboards')
    } catch (err: any) {
      console.error('Error completing setup:', err)
      const errorMessage = err?.response?.data?.detail || err.message || 'Failed to complete setup'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push('/onboarding?step=plan')
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardBody className="p-5">
        <div className="text-center mb-4">
          <div className="mb-3">
            <IconifyIcon 
              icon="solar:check-circle-bold-duotone" 
              width={64} 
              height={64} 
              className="text-success"
            />
          </div>
          <h4 className="fw-bold text-dark mb-2">Almost there!</h4>
          <p className="text-muted">
            Complete your setup to start using the platform
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Payment Notice */}
        <div className="p-4 bg-light rounded mb-4">
          <h6 className="fw-semibold mb-3">Payment Setup (Coming Soon)</h6>
          <p className="text-muted small mb-3">
            Payment integration is currently being developed. For now, you can:
          </p>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-start gap-2">
              <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="text-success mt-1 flex-shrink-0" />
              <span className="small text-muted">Access all platform features</span>
            </div>
            <div className="d-flex align-items-start gap-2">
              <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="text-success mt-1 flex-shrink-0" />
              <span className="small text-muted">Explore the dashboard</span>
            </div>
            <div className="d-flex align-items-start gap-2">
              <IconifyIcon icon="solar:check-circle-bold" width={16} height={16} className="text-success mt-1 flex-shrink-0" />
              <span className="small text-muted">Set up your first AI assistant</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="lg"
            className="fw-medium"
            onClick={handleBack}
            disabled={loading}
          >
            <IconifyIcon icon="solar:alt-arrow-left-linear" width={20} height={20} className="me-2" />
            Back
          </Button>
          
          <Button
            variant="success"
            size="lg"
            className="fw-medium flex-grow-1"
            onClick={handleCompleteSetup}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Creating organization...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:play-bold" width={20} height={20} className="me-2" />
                Complete Setup
              </>
            )}
          </Button>
        </div>

        {/* Features Reminder */}
        <div className="mt-4 pt-4 border-top">
          <p className="text-muted small fw-semibold mb-2">What happens next?</p>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-start gap-2">
              <span className="badge bg-primary text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px' }}>1</span>
              <span className="small text-muted">Your organization will be created</span>
            </div>
            <div className="d-flex align-items-start gap-2">
              <span className="badge bg-primary text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px' }}>2</span>
              <span className="small text-muted">You'll become the organization admin</span>
            </div>
            <div className="d-flex align-items-start gap-2">
              <span className="badge bg-primary text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '10px' }}>3</span>
              <span className="small text-muted">Access your dashboard and start exploring</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PaymentStep