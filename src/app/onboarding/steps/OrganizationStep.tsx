'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/useAuthContext'
import Image from 'next/image'
import { Card, CardBody, Form, Button, Alert } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { organizationsApi } from '@/api/org/organizations'

// Schema - vertical_key will come from usecase step
const schema = yup.object({
  companyName: yup
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .required('Company name is required'),
  industry: yup
    .string()
    .required('Please select an industry'),
  logoUrl: yup.string().default(''), 
  primaryColor: yup.string().required('Primary color is required'),
  secondaryColor: yup.string().required('Secondary color is required'),
}).required()

type OrgFormData = yup.InferType<typeof schema>

const industries = [
  { value: '', label: 'Select your industry' },
  { value: 'technology', label: 'Technology & Software' },
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'education', label: 'Education & Training' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
]

const OrganizationStep = () => {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { 
    handleSubmit, 
    control, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<OrgFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: '',
      industry: '',
      logoUrl: '',
      primaryColor: '#0d6efd',
      secondaryColor: '#6c757d',
    },
  })

  const logoPreview = watch('logoUrl')

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue('logoUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: OrgFormData) => {
    setLoading(true)
    setError(null)
    
    // Store org data in sessionStorage
    sessionStorage.setItem('onboarding_org', JSON.stringify(data))
    
    // Move to use case step
    await new Promise(resolve => setTimeout(resolve, 500))
    setLoading(false)
    router.push('/onboarding?step=usecase')
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardBody className="p-5">
        <div className="text-center mb-4">
          <div className="mb-3">
            <IconifyIcon 
              icon="solar:buildings-2-bold-duotone" 
              width={48} 
              height={48} 
              className="text-primary"
            />
          </div>
          <h4 className="fw-bold text-dark mb-2">Tell us about your organization</h4>
          <p className="text-muted">
            Help us customize your experience by providing some basic information
          </p>
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="Enter your company name"
                    isInvalid={!!errors.companyName}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.companyName?.message}
                  </Form.Control.Feedback>
                </>
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Industry <span className="text-danger">*</span></Form.Label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Select {...field} isInvalid={!!errors.industry}>
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.industry?.message}
                  </Form.Control.Feedback>
                </>
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company Logo (Optional)</Form.Label>
            <div className="d-flex align-items-start gap-3">
              {logoPreview && (
                <div className="border rounded p-2 bg-light position-relative" style={{ width: '80px', height: '80px' }}>
                  <Image src={logoPreview} alt="Preview" fill style={{ objectFit: 'contain' }} />
                </div>
              )}
              <div className="flex-grow-1">
                <Form.Control type="file" accept="image/*" onChange={handleLogoChange} size="sm" />
                <Form.Text className="text-muted">PNG, JPG or SVG. Max 2MB.</Form.Text>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Brand Colors (Optional)</Form.Label>
            <div className="row g-3">
              <div className="col-6">
                <Controller
                  name="primaryColor"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Label className="small text-muted">Primary Color</Form.Label>
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Control {...field} type="color" style={{ width: '60px', height: '40px' }} />
                        <Form.Control {...field} type="text" className="font-monospace small" />
                      </div>
                    </div>
                  )}
                />
              </div>
              <div className="col-6">
                <Controller
                  name="secondaryColor"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Form.Label className="small text-muted">Secondary Color</Form.Label>
                      <div className="d-flex gap-2 align-items-center">
                        <Form.Control {...field} type="color" style={{ width: '60px', height: '40px' }} />
                        <Form.Control {...field} type="text" className="font-monospace small" />
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
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
        </Form>
      </CardBody>
    </Card>
  )
}

export default OrganizationStep