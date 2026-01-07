'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Form, Button, Alert } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface OrgFormData {
  companyName: string
  industry: string
  logoFile?: FileList
  primaryColor: string
  secondaryColor: string
}

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
  primaryColor: yup.string(),
  secondaryColor: yup.string(),
}).required()

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
  const [loading, setLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const { handleSubmit, control, formState: { errors }, watch } = useForm<OrgFormData>({
    defaultValues: {
      companyName: '',
      industry: '',
      primaryColor: '#0d6efd',
      secondaryColor: '#6c757d',
    },
    resolver: yupResolver(schema),
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: OrgFormData) => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Store data in sessionStorage for demo purposes
    sessionStorage.setItem('onboarding_org', JSON.stringify(data))
    
    setLoading(false)
    router.push('/onboarding?step=team')
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

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Company Name */}
          <Form.Group className="mb-3">
            <Form.Label>
              Company Name <span className="text-danger">*</span>
            </Form.Label>
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

          {/* Industry */}
          <Form.Group className="mb-3">
            <Form.Label>
              Industry <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <>
                  <Form.Select
                    {...field}
                    isInvalid={!!errors.industry}
                  >
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

          {/* Logo Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Company Logo (Optional)</Form.Label>
            <div className="d-flex align-items-start gap-3">
              {logoPreview && (
                <div 
                  className="border rounded p-2 bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
              )}
              <div className="flex-grow-1">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  size="sm"
                />
                <Form.Text className="text-muted">
                  PNG, JPG or SVG. Max size 2MB. Square format recommended.
                </Form.Text>
              </div>
            </div>
          </Form.Group>

          {/* Brand Colors */}
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
                        <Form.Control
                          {...field}
                          type="color"
                          style={{ width: '60px', height: '40px' }}
                        />
                        <Form.Control
                          type="text"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="#0d6efd"
                          className="font-monospace small"
                        />
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
                        <Form.Control
                          {...field}
                          type="color"
                          style={{ width: '60px', height: '40px' }}
                        />
                        <Form.Control
                          type="text"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="#6c757d"
                          className="font-monospace small"
                        />
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </Form.Group>

          {/* Continue Button */}
          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="fw-medium"
              disabled={loading}
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
        </Form>
      </CardBody>
    </Card>
  )
}

export default OrganizationStep