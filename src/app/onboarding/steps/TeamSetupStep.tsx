'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, Form, Button, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

interface TeamMember {
  id: string
  email: string
  role: string
}

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

const TeamSetupStep = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [currentEmail, setCurrentEmail] = useState('')
  const [currentRole, setCurrentRole] = useState('member')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddMember = () => {
    setEmailError('')

    if (!currentEmail.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(currentEmail)) {
      setEmailError('Please enter a valid email address')
      return
    }

    if (teamMembers.some(m => m.email.toLowerCase() === currentEmail.toLowerCase())) {
      setEmailError('This email has already been added')
      return
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      email: currentEmail.trim(),
      role: currentRole,
    }

    setTeamMembers([...teamMembers, newMember])
    setCurrentEmail('')
    setCurrentRole('member')
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddMember()
    }
  }

  const handleContinue = async () => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Store data in sessionStorage for demo purposes
    sessionStorage.setItem('onboarding_team', JSON.stringify(teamMembers))
    
    setLoading(false)
    router.push('/onboarding?step=usecase')
  }

  const handleSkip = () => {
    router.push('/onboarding?step=usecase')
  }

  const handleBack = () => {
    router.push('/onboarding?step=org')
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger'
      case 'manager': return 'primary'
      case 'member': return 'success'
      case 'viewer': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardBody className="p-5">
        <div className="text-center mb-4">
          <div className="mb-3">
            <IconifyIcon 
              icon="solar:users-group-two-rounded-bold-duotone" 
              width={48} 
              height={48} 
              className="text-primary"
            />
          </div>
          <h4 className="fw-bold text-dark mb-2">Invite your team</h4>
          <p className="text-muted">
            Collaborate better by inviting team members to your organization
          </p>
        </div>

        {/* Add Team Member Form */}
        <div className="mb-4 p-3 bg-light rounded">
          <Form>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <Form.Control
                  type="email"
                  placeholder="colleague@company.com"
                  value={currentEmail}
                  onChange={(e) => {
                    setCurrentEmail(e.target.value)
                    setEmailError('')
                  }}
                  onKeyPress={handleKeyPress}
                  isInvalid={!!emailError}
                />
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              </div>
              <div className="col-12 col-md-4">
                <Form.Select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-12 col-md-2">
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleAddMember}
                >
                  <IconifyIcon icon="solar:add-circle-linear" width={18} height={18} />
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Team Members List */}
        {teamMembers.length > 0 && (
          <div className="mb-4">
            <h6 className="text-muted small mb-3">Team Members ({teamMembers.length})</h6>
            <div className="d-flex flex-column gap-2">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="d-flex align-items-center justify-content-between p-3 bg-white border rounded"
                >
                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    >
                      <IconifyIcon 
                        icon="solar:user-bold-duotone" 
                        width={20} 
                        height={20} 
                        className="text-primary"
                      />
                    </div>
                    <div className="flex-grow-1 min-width-0">
                      <div className="fw-medium text-truncate">{member.email}</div>
                      <Badge bg={getRoleBadgeVariant(member.role)} className="text-capitalize small">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-1"
                    onClick={() => handleRemoveMember(member.id)}
                    title="Remove member"
                  >
                    <IconifyIcon icon="solar:trash-bin-trash-linear" width={18} height={18} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {teamMembers.length === 0 && (
          <div className="text-center py-4 mb-4">
            <IconifyIcon 
              icon="solar:user-plus-linear" 
              width={48} 
              height={48} 
              className="text-muted opacity-50 mb-2"
            />
            <p className="text-muted small mb-0">No team members added yet</p>
          </div>
        )}

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
            variant="outline-primary"
            size="lg"
            className="fw-medium"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="fw-medium flex-grow-1"
            onClick={handleContinue}
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

        {teamMembers.length > 0 && (
          <p className="text-center text-muted small mt-3 mb-0">
            Invitations will be sent after you complete the setup
          </p>
        )}
      </CardBody>
    </Card>
  )
}

export default TeamSetupStep