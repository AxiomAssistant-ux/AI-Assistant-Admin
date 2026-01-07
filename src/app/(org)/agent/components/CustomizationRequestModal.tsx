// src/components/agent/CustomizationRequestModal.tsx
'use client'

import React, { useState } from 'react'
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { toast } from 'react-toastify'
import { agentsApi, type CustomizationRequest } from '@/api/org/agents'

interface CustomizationRequestModalProps {
  show: boolean
  onHide: () => void
}

const CustomizationRequestModal: React.FC<CustomizationRequestModalProps> = ({ show, onHide }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CustomizationRequest>({
    business_type: '',
    primary_use: '',
    tone: 'friendly',
    speaking_speed: 'normal',
    emotion_level: 'medium',
    preferred_gender: undefined,
    preferred_accent: '',
    preferred_age_range: '',
    ask_followup_questions: true,
    confirm_details_before_ending: true,
    escalation_preference: '',
    knowledge_usage: 'light',
    notes: ''
  })

  const handleChange = (field: keyof CustomizationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.business_type || !formData.primary_use) {
      toast.error('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      await agentsApi.submitCustomizationRequest(formData)
      toast.success('Customization request submitted successfully! Our team will review it shortly.')
      onHide()
      // Reset form
      setFormData({
        business_type: '',
        primary_use: '',
        tone: 'friendly',
        speaking_speed: 'normal',
        emotion_level: 'medium',
        preferred_gender: undefined,
        preferred_accent: '',
        preferred_age_range: '',
        ask_followup_questions: true,
        confirm_details_before_ending: true,
        escalation_preference: '',
        knowledge_usage: 'light',
        notes: ''
      })
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <IconifyIcon icon="solar:settings-bold" width={24} height={24} className="me-2" />
          Request Agent Customization
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Alert variant="info" className="d-flex align-items-start">
            <IconifyIcon icon="solar:info-circle-bold" width={20} height={20} className="me-2 mt-1" />
            <div>
              <strong>Note:</strong> Your customization request will be reviewed by our team. 
              Changes will be applied manually after approval, typically within 24-48 hours.
            </div>
          </Alert>

          {/* Business Context */}
          <div className="mb-4">
            <h6 className="mb-3">
              <IconifyIcon icon="solar:case-round-bold" width={20} height={20} className="me-2" />
              Business Context
            </h6>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Business Type <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Restaurant, Healthcare, E-commerce"
                    value={formData.business_type}
                    onChange={(e) => handleChange('business_type', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Primary Use of Agent <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe how you plan to use the agent (e.g., customer support, appointment booking, order taking)"
                    value={formData.primary_use}
                    onChange={(e) => handleChange('primary_use', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Personality & Tone */}
          <div className="mb-4">
            <h6 className="mb-3">
              <IconifyIcon icon="solar:smile-circle-bold" width={20} height={20} className="me-2" />
              Personality & Tone
            </h6>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tone</Form.Label>
                  <Form.Select
                    value={formData.tone}
                    onChange={(e) => handleChange('tone', e.target.value)}
                  >
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                    <option value="empathetic">Empathetic</option>
                    <option value="assertive">Assertive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Speaking Speed</Form.Label>
                  <Form.Select
                    value={formData.speaking_speed}
                    onChange={(e) => handleChange('speaking_speed', e.target.value)}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Emotion Level</Form.Label>
                  <Form.Select
                    value={formData.emotion_level}
                    onChange={(e) => handleChange('emotion_level', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Voice Preferences */}
          <div className="mb-4">
            <h6 className="mb-3">
              <IconifyIcon icon="solar:microphone-bold" width={20} height={20} className="me-2" />
              Voice Preferences
            </h6>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Preferred Gender</Form.Label>
                  <Form.Select
                    value={formData.preferred_gender || ''}
                    onChange={(e) => handleChange('preferred_gender', e.target.value || undefined)}
                  >
                    <option value="">No Preference</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="neutral">Neutral</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Preferred Accent</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., American, British, Australian"
                    value={formData.preferred_accent}
                    onChange={(e) => handleChange('preferred_accent', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Preferred Age Range</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Young Adult, Middle-aged"
                    value={formData.preferred_age_range}
                    onChange={(e) => handleChange('preferred_age_range', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Conversation Behavior */}
          <div className="mb-4">
            <h6 className="mb-3">
              <IconifyIcon icon="solar:chat-round-dots-bold" width={20} height={20} className="me-2" />
              Conversation Behavior
            </h6>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Check
                  type="switch"
                  id="ask_followup"
                  label="Ask follow-up questions during conversation"
                  checked={formData.ask_followup_questions}
                  onChange={(e) => handleChange('ask_followup_questions', e.target.checked)}
                />
              </Col>
              <Col xs={12}>
                <Form.Check
                  type="switch"
                  id="confirm_details"
                  label="Confirm details before ending call"
                  checked={formData.confirm_details_before_ending}
                  onChange={(e) => handleChange('confirm_details_before_ending', e.target.checked)}
                />
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Escalation Preference</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Transfer to human for billing issues, complaints about service"
                    value={formData.escalation_preference}
                    onChange={(e) => handleChange('escalation_preference', e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Describe when the agent should escalate to a human
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Knowledge Usage */}
          <div className="mb-4">
            <h6 className="mb-3">
              <IconifyIcon icon="solar:book-bookmark-bold" width={20} height={20} className="me-2" />
              Knowledge Usage
            </h6>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>How should the agent use the knowledge base?</Form.Label>
                  <Form.Select
                    value={formData.knowledge_usage}
                    onChange={(e) => handleChange('knowledge_usage', e.target.value)}
                  >
                    <option value="heavy">Heavy - Reference knowledge base frequently</option>
                    <option value="light">Light - Use knowledge base occasionally</option>
                    <option value="fallback_only">Fallback Only - Use only when unsure</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Free Notes */}
          <div className="mb-3">
            <h6 className="mb-3">
              <IconifyIcon icon="solar:notes-bold" width={20} height={20} className="me-2" />
              Additional Notes
            </h6>
            <Form.Group>
              <Form.Label>Any other customization requests?</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Provide any additional details or special requirements..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Submitting...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:send-bold" width={18} height={18} className="me-2" />
                Submit Request
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CustomizationRequestModal