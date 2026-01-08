'use client'

import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { useAuth } from '@/context/useAuthContext'
import Footer from '@/components/layout/Footer'

type OrganizationFormState = {
  name: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  type: 'enterprise' | 'business' | 'startup' | 'individual' | ''
  industry: string
  employeeCount: string
  subscription: 'free' | 'basic' | 'premium' | 'enterprise' | ''
  status: 'active' | 'inactive' | 'suspended' | ''
  contactPerson: string
  contactEmail: string
  contactPhone: string
  notes: string
}

const initialFormState: OrganizationFormState = {
  name: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  type: '',
  industry: '',
  employeeCount: '',
  subscription: '',
  status: 'active',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  notes: ''
}

const CreateOrganizationPage = () => {
  const { token, isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<OrganizationFormState>(initialFormState)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (field: keyof OrganizationFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target
    const value = target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
    setFormErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Organization name is required'
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format'
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    }
    if (!formData.type) {
      errors.type = 'Organization type is required'
    }
    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person name is required'
    }
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errors.contactEmail = 'Invalid email format'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateOrganization = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!token || !isAuthenticated) {
      toast.error('You must be signed in to create an organization')
      return
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setSubmitting(true)

    try {
      // TODO: Replace with actual API call
      // const response = await organizationApi.createOrganization(token, formData)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Organization created successfully')
      setFormData(initialFormState)
      setTimeout(() => {
        router.push('/organizations')
      }, 500)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create organization')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <>
        <Row className="py-5">
          <Col xs={12}>
            <div className="text-center">
              <h4 className="mb-2">Please sign in</h4>
              <p className="text-muted mb-3">You need to be signed in to create organizations.</p>
              <Link href="/auth/sign-in">
                <Button variant="primary">Sign In</Button>
              </Link>
            </div>
          </Col>
        </Row>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Create Organization</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Taplox</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item">
                <Link href="/organizations">Organizations</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Create</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Card>
            <CardHeader>
              <CardTitle as="h5">New Organization Details</CardTitle>
              <p className="text-muted mb-0">
                Fill in the information below to create a new organization profile.
              </p>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleCreateOrganization}>
                <Row className="g-3">
                  {/* Basic Information */}
                  <Col xs={12}>
                    <h6 className="mb-3 text-primary">Basic Information</h6>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Organization Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        placeholder="TechCorp Solutions"
                        isInvalid={!!formErrors.name}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        placeholder="contact@techcorp.com"
                        isInvalid={!!formErrors.email}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={formData.phone}
                        onChange={handleInputChange('phone')}
                        placeholder="+1-555-0123"
                        isInvalid={!!formErrors.phone}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.phone}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        value={formData.website}
                        onChange={handleInputChange('website')}
                        placeholder="https://techcorp.com"
                      />
                    </Form.Group>
                  </Col>

                  {/* Organization Details */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Organization Details</h6>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        value={formData.type}
                        onChange={handleInputChange('type')}
                        isInvalid={!!formErrors.type}
                      >
                        <option value="">Select type</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="business">Business</option>
                        <option value="startup">Startup</option>
                        <option value="individual">Individual</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{formErrors.type}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Industry</Form.Label>
                      <Form.Control
                        value={formData.industry}
                        onChange={handleInputChange('industry')}
                        placeholder="Technology"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Employee Count</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.employeeCount}
                        onChange={handleInputChange('employeeCount')}
                        placeholder="100"
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Subscription Plan</Form.Label>
                      <Form.Select
                        value={formData.subscription}
                        onChange={handleInputChange('subscription')}
                      >
                        <option value="">Select plan</option>
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={formData.status}
                        onChange={handleInputChange('status')}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Address Information */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Address</h6>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        value={formData.address}
                        onChange={handleInputChange('address')}
                        placeholder="123 Tech Street"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        value={formData.city}
                        onChange={handleInputChange('city')}
                        placeholder="San Francisco"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>State/Province</Form.Label>
                      <Form.Control
                        value={formData.state}
                        onChange={handleInputChange('state')}
                        placeholder="CA"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        value={formData.country}
                        onChange={handleInputChange('country')}
                        placeholder="USA"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Zip/Postal Code</Form.Label>
                      <Form.Control
                        value={formData.zipCode}
                        onChange={handleInputChange('zipCode')}
                        placeholder="94102"
                      />
                    </Form.Group>
                  </Col>

                  {/* Contact Information */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Primary Contact</h6>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Contact Person <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        value={formData.contactPerson}
                        onChange={handleInputChange('contactPerson')}
                        placeholder="John Smith"
                        isInvalid={!!formErrors.contactPerson}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.contactPerson}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Contact Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange('contactEmail')}
                        placeholder="john.smith@techcorp.com"
                        isInvalid={!!formErrors.contactEmail}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.contactEmail}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control
                        value={formData.contactPhone}
                        onChange={handleInputChange('contactPhone')}
                        placeholder="+1-555-0124"
                      />
                    </Form.Group>
                  </Col>

                  {/* Additional Notes */}
                  <Col xs={12} className="mt-4">
                    <h6 className="mb-3 text-primary">Additional Information</h6>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={formData.notes}
                        onChange={handleInputChange('notes')}
                        placeholder="Any additional notes or comments about this organization..."
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="text-end mt-4">
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => router.push('/organizations')}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} variant="primary">
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <IconifyIcon icon="solar:add-square-outline" width={18} height={18} className="me-2" />
                          Create Organization
                        </>
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Footer />
    </>
  )
}

export default CreateOrganizationPage

export const dynamic = 'force-dynamic'
