'use client'

import React, { useEffect, useState } from 'react'
import { Row, Col, Card, CardBody, Form, Button, Alert, Spinner, Tab, Tabs } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { orgProfileApi, type UpdateProfileRequest, type ChangePasswordRequest } from '@/api/org/profile'
import { useAuth } from '@/context/useAuthContext'
import { isOrgUser } from '@/types/auth'

const ProfilePage = () => {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })

  // Password form state
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    current_password: '',
    new_password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user && isOrgUser(user)) {
      setProfileData({
        name: user.name,
        email: user.email,
      })
    }
  }, [user])

  const handleUpdateProfile = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Validate
      if (!profileData.name || profileData.name.trim().length === 0) {
        setError('Name is required')
        return
      }

      if (!profileData.email || !profileData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Valid email is required')
        return
      }

      const updateData: UpdateProfileRequest = {
        name: profileData.name,
        email: profileData.email,
      }

      await orgProfileApi.updateProfile(updateData)
      await refreshUser() // Refresh user context
      setSuccess('Profile updated successfully!')

      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Validate
      if (!passwordData.current_password) {
        setError('Current password is required')
        return
      }

      if (!passwordData.new_password || passwordData.new_password.length < 8) {
        setError('New password must be at least 8 characters')
        return
      }

      if (passwordData.new_password !== confirmPassword) {
        setError('New passwords do not match')
        return
      }

      await orgProfileApi.changePassword(passwordData)
      
      // Clear form
      setPasswordData({
        current_password: '',
        new_password: '',
      })
      setConfirmPassword('')
      
      setSuccess('Password changed successfully!')

      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error changing password:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  if (!user || !isOrgUser(user)) {
    return (
      <Alert variant="danger">
        Unable to load user information
      </Alert>
    )
  }

  return (
    <>
      {/* Page Title */}
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-0">My Profile</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">My Profile</li>
            </ol>
          </div>
        </Col>
      </Row>

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

      <Row>
        <Col lg={4}>
          {/* User Info Card */}
          <Card className="border-0 shadow-sm">
            <CardBody className="text-center">
              <div className="avatar-lg bg-primary-subtle rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                <IconifyIcon icon="solar:user-bold" className="text-primary" width={48} height={48} />
              </div>
              <h5 className="mb-1">{user.name}</h5>
              <p className="text-muted mb-2">{user.email}</p>
              
              {user.is_admin && (
                <span className="badge bg-primary mb-3">Administrator</span>
              )}
              {user.role_name && (
                <span className="badge bg-info mb-3">{user.role_name}</span>
              )}

              <hr />

              <div className="text-start">
                <div className="mb-2">
                  <small className="text-muted">Organization</small>
                  <div className="fw-medium">{user.organization.company_name}</div>
                </div>

                <div className="mb-2">
                  <small className="text-muted">Status</small>
                  <div>
                    {user.status === 'active' && <span className="badge bg-success">Active</span>}
                    {user.status === 'invited' && <span className="badge bg-warning">Invited</span>}
                    {user.status === 'suspended' && <span className="badge bg-danger">Suspended</span>}
                  </div>
                </div>

                {user.features && user.features.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted">Features</small>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {user.features.map((feature, idx) => (
                        <span key={idx} className="badge bg-light text-dark">{feature}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <Tabs defaultActiveKey="profile" className="mb-3">
                {/* Profile Tab */}
                <Tab eventKey="profile" title={
                  <span>
                    <IconifyIcon icon="solar:user-linear" width={18} height={18} className="me-1" />
                    Profile Information
                  </span>
                }>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>User ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.id}
                        disabled
                        readOnly
                      />
                      <Form.Text className="text-muted">
                        Your unique user identifier
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Organization ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={user.org_id}
                        disabled
                        readOnly
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        onClick={handleUpdateProfile}
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
                        onClick={() => {
                          setProfileData({
                            name: user.name,
                            email: user.email,
                          })
                        }}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Tab>

                {/* Security Tab */}
                <Tab eventKey="security" title={
                  <span>
                    <IconifyIcon icon="solar:lock-password-linear" width={18} height={18} className="me-1" />
                    Security
                  </span>
                }>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password *</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        placeholder="Enter current password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>New Password *</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        placeholder="Enter new password"
                      />
                      <Form.Text className="text-muted">
                        Minimum 8 characters
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password *</Form.Label>
                      <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </Form.Group>

                    <Alert variant="info">
                      <IconifyIcon icon="solar:info-circle-bold" width={20} height={20} className="me-2" />
                      Make sure your password is strong and unique. We recommend using a password manager.
                    </Alert>

                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        onClick={handleChangePassword}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Changing...
                          </>
                        ) : (
                          <>
                            <IconifyIcon icon="solar:shield-check-bold" width={18} height={18} className="me-1" />
                            Change Password
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          setPasswordData({
                            current_password: '',
                            new_password: '',
                          })
                          setConfirmPassword('')
                        }}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ProfilePage
