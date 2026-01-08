'use client'

import React, { useEffect, useState } from 'react'
import { Row, Col, Card, CardBody, Form, Button, Alert, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { orgSettingsApi, type Organization, type UpdateOrganizationSettingsRequest } from '@/api/org/settings'
import { useAuth } from '@/context/useAuthContext'
import { isOrgUser } from '@/types/auth'
import Image from "next/image"

const OrganizationSettingsPage = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<UpdateOrganizationSettingsRequest>({
    company_name: '',
    logo_url: '',
    color_scheme: [],
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await orgSettingsApi.getSettings()
      setSettings(data)
      setFormData({
        company_name: data.company_name,
        logo_url: data.logo_url || '',
        color_scheme: data.color_scheme || [],
      })
    } catch (err: any) {
      console.error('Error loading settings:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // Check if user is admin
    if (!user || !isOrgUser(user) || !user.is_admin) {
      setError('Only administrators can update organization settings')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Validate company name
      if (!formData.company_name || formData.company_name.length < 1 || formData.company_name.length > 200) {
        setError('Company name must be between 1 and 200 characters')
        return
      }

      // Validate logo URL if provided
      if (formData.logo_url && !formData.logo_url.match(/^https?:\/\/.+/)) {
        setError('Logo URL must be a valid HTTP or HTTPS URL')
        return
      }

      // Validate color scheme if provided
      if (formData.color_scheme && formData.color_scheme.length > 0) {
        const hexPattern = /^#[0-9A-Fa-f]{6}$/
        const invalidColors = formData.color_scheme.filter(color => !hexPattern.test(color))
        if (invalidColors.length > 0) {
          setError('All colors must be valid hex codes (e.g., #FF5733)')
          return
        }
      }

      const response = await orgSettingsApi.updateSettings(formData)
      setSettings(response.organization)
      setSuccess('Settings updated successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error saving settings:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleAddColor = () => {
    setFormData({
      ...formData,
      color_scheme: [...(formData.color_scheme || []), '#000000']
    })
  }

  const handleRemoveColor = (index: number) => {
    const newColors = [...(formData.color_scheme || [])]
    newColors.splice(index, 1)
    setFormData({
      ...formData,
      color_scheme: newColors
    })
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...(formData.color_scheme || [])]
    newColors[index] = value
    setFormData({
      ...formData,
      color_scheme: newColors
    })
  }

  // Check if user is admin
  const isAdmin = user && isOrgUser(user) && user.is_admin

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <>
      {/* Page Title */}
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">Organization Settings</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">Organization Settings</li>
            </ol>
          </div>
        </Col>
      </Row>

      {!isAdmin && (
        <Alert variant="warning">
          <IconifyIcon icon="solar:shield-warning-bold" width={20} height={20} className="me-2" />
          You need administrator privileges to update organization settings.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Settings Form */}
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-4">
                <IconifyIcon icon="solar:buildings-bold" width={20} height={20} className="me-2" />
                Company Information
              </h5>

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Enter company name"
                    disabled={!isAdmin}
                    maxLength={200}
                  />
                  <Form.Text className="text-muted">
                    1-200 characters
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Logo URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    disabled={!isAdmin}
                  />
                  <Form.Text className="text-muted">
                    Must be a valid HTTP or HTTPS URL
                  </Form.Text>
                </Form.Group>

                {formData.logo_url && (
                  <div className="mb-3">
                    <Form.Label>Logo Preview</Form.Label>
                    <div className="border rounded p-3 bg-light">
                      <Image 
                        src={formData.logo_url} 
                        alt="Company Logo" 
                        style={{ maxHeight: '100px', maxWidth: '200px' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="mb-0">Brand Colors</Form.Label>
                    {isAdmin && (
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={handleAddColor}
                        disabled={!isAdmin || (formData.color_scheme?.length || 0) >= 5}
                      >
                        <IconifyIcon icon="solar:add-circle-linear" width={16} height={16} className="me-1" />
                        Add Color
                      </Button>
                    )}
                  </div>

                  {formData.color_scheme && formData.color_scheme.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {formData.color_scheme.map((color, index) => (
                        <div key={index} className="d-flex align-items-center gap-2 border rounded p-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            disabled={!isAdmin}
                            style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
                          />
                          <Form.Control
                            type="text"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            disabled={!isAdmin}
                            style={{ width: '100px' }}
                            placeholder="#000000"
                          />
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleRemoveColor(index)}
                            >
                              <IconifyIcon icon="solar:trash-bin-linear" width={16} height={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No brand colors set</p>
                  )}
                  <Form.Text className="text-muted d-block mt-2">
                    Add up to 5 brand colors in hex format (e.g., #FF5733)
                  </Form.Text>
                </Form.Group>

                {isAdmin && (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <IconifyIcon icon="solar:diskette-bold" width={18} height={18} className="me-1" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={loadSettings}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <h5 className="mb-3">
                <IconifyIcon icon="solar:info-circle-bold" width={20} height={20} className="me-2" />
                Organization Info
              </h5>

              {settings && (
                <div>
                  <div className="mb-3">
                    <small className="text-muted">Organization ID</small>
                    <div className="fw-medium font-monospace">{settings.id}</div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Industry</small>
                    <div className="fw-medium">{settings.industry || 'Not set'}</div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Status</small>
                    <div>
                      {settings.status === 'active' && <span className="badge bg-success">Active</span>}
                      {settings.status === 'trial' && <span className="badge bg-warning">Trial</span>}
                      {settings.status === 'suspended' && <span className="badge bg-danger">Suspended</span>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Created</small>
                    <div className="fw-medium">{new Date(settings.created_at).toLocaleDateString()}</div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Last Updated</small>
                    <div className="fw-medium">{new Date(settings.updated_at).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card className="border-0 shadow-sm mt-3">
            <CardBody>
              <h6 className="mb-3">
                <IconifyIcon icon="solar:shield-check-bold" width={18} height={18} className="me-2" />
                Permissions
              </h6>
              <p className="text-muted small mb-0">
                Only organization administrators can modify these settings. Contact your admin if you need to make changes.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrganizationSettingsPage

export const dynamic = 'force-dynamic'
