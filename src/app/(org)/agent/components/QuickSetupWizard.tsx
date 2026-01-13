// components/QuickSetupWizard.tsx - FIXED VERSION
'use client'

import React, { useState } from 'react'
import { Modal, Button, Form, Row, Col, Alert, Card, Spinner, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { toast } from 'react-toastify'
import { agentConfigApi, type QuickSetupAnswers } from '@/api/org/agentConfigs'
import type { AgentConfiguration } from '@/api/org/agentConfigs'

interface QuickSetupWizardProps {
  show: boolean
  onHide: () => void
  onConfigGenerated: (config: AgentConfiguration) => void
}

type SetupMode = 'choice' | 'quick-questions' | 'natural-language' | 'generating'

export const QuickSetupWizard: React.FC<QuickSetupWizardProps> = ({
  show,
  onHide,
  onConfigGenerated
}) => {
  const [mode, setMode] = useState<SetupMode>('choice')
  const [loading, setLoading] = useState(false)

  // Quick questions state
  const [answers, setAnswers] = useState<QuickSetupAnswers>({
    company_name: '',
    industry: '',
    business_description: '',
    primary_service: '',
    target_audience: '',
    operating_hours: '24/7',
    primary_language: 'English',
    additional_context: ''
  })

  // Natural language state
  const [description, setDescription] = useState('')

  const handleQuickQuestionsSubmit = async () => {
    // Validate required fields
    if (!answers.company_name || !answers.industry || !answers.business_description || 
        !answers.primary_service || !answers.target_audience) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setMode('generating')

    try {
      const result = await agentConfigApi.generateFromAnswers(answers)
      
      if (result.parse_status === 'success' && result.configuration) {
        toast.success('✨ Agent configuration generated successfully!')
        
        // IMPORTANT: Pass the configuration to parent immediately
        onConfigGenerated(result.configuration)
        
        // Don't call onHide() here - let parent handle it after setting state
      } else {
        toast.error(result.error_message || 'Failed to generate configuration')
        setMode('quick-questions')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error?.response?.data?.detail || 'Failed to generate configuration')
      setMode('quick-questions')
      setLoading(false)
    }
  }

  const handleNaturalLanguageSubmit = async () => {
    if (!description.trim() || description.trim().length < 50) {
      toast.error('Please provide a more detailed description (at least 50 characters)')
      return
    }

    setLoading(true)
    setMode('generating')

    try {
      const result = await agentConfigApi.parseFromDescription(description)
      
      if (result.parse_status === 'success' && result.configuration) {
        toast.success('✨ Agent configuration generated successfully!')
        
        // IMPORTANT: Pass the configuration to parent immediately
        onConfigGenerated(result.configuration)
        
        // Don't call onHide() here - let parent handle it after setting state
      } else {
        toast.error(result.error_message || 'Failed to generate configuration')
        setMode('natural-language')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Parsing error:', error)
      toast.error(error?.response?.data?.detail || 'Failed to parse description')
      setMode('natural-language')
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state on close
    setMode('choice')
    setLoading(false)
    setAnswers({
      company_name: '',
      industry: '',
      business_description: '',
      primary_service: '',
      target_audience: '',
      operating_hours: '24/7',
      primary_language: 'English',
      additional_context: ''
    })
    setDescription('')
    onHide()
  }

  const renderModeSelection = () => (
    <div className="text-center py-4">
      <h5 className="mb-4">How would you like to set up your AI agent?</h5>
      
      <Row className="g-3">
        <Col md={6}>
          <Card 
            className="h-100 border-primary cursor-pointer hover-shadow"
            onClick={() => setMode('quick-questions')}
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Card.Body className="text-center p-4">
              <IconifyIcon icon="solar:chat-round-check-bold-duotone" width={48} className="text-primary mb-3" />
              <h6 className="mb-2">Quick Questions</h6>
              <p className="text-muted small mb-0">
                Answer 5-8 simple questions and let AI fill everything for you
              </p>
              <Badge bg="success" className="mt-3">Recommended</Badge>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card 
            className="h-100 border-secondary cursor-pointer hover-shadow"
            onClick={() => setMode('natural-language')}
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Card.Body className="text-center p-4">
              <IconifyIcon icon="solar:document-text-bold-duotone" width={48} className="text-secondary mb-3" />
              <h6 className="mb-2">Describe Your Agent</h6>
              <p className="text-muted small mb-0">
                Write in your own words what your agent should do
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )

  const renderQuickQuestions = () => (
    <div>
      <Alert variant="info" className="mb-4">
        <IconifyIcon icon="solar:lightbulb-bold-duotone" width={20} className="me-2" />
        <strong>Quick Setup:</strong> Answer these questions and AI will generate your complete agent configuration
      </Alert>

      <Form>
        <Row className="g-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>
                1. What's your company/business name? <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                value={answers.company_name}
                onChange={(e) => setAnswers({ ...answers, company_name: e.target.value })}
                placeholder="e.g., Acme Corporation"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>
                2. What industry are you in? <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={answers.industry}
                onChange={(e) => setAnswers({ ...answers, industry: e.target.value })}
              >
                <option value="">Select industry...</option>
                <option value="Retail">Retail</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>
                3. What's your primary service/product? <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                value={answers.primary_service}
                onChange={(e) => setAnswers({ ...answers, primary_service: e.target.value })}
                placeholder="e.g., Online clothing store"
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>
                4. Describe your business in 1-2 sentences <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={answers.business_description}
                onChange={(e) => setAnswers({ ...answers, business_description: e.target.value })}
                placeholder="e.g., We sell premium athletic wear and provide personalized fitness consultations"
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>
                5. Who are your typical customers? <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                value={answers.target_audience}
                onChange={(e) => setAnswers({ ...answers, target_audience: e.target.value })}
                placeholder="e.g., Young professionals aged 25-40 interested in fitness"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>6. Operating hours (optional)</Form.Label>
              <Form.Control
                value={answers.operating_hours}
                onChange={(e) => setAnswers({ ...answers, operating_hours: e.target.value })}
                placeholder="e.g., Mon-Fri 9AM-5PM EST"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>7. Primary language (optional)</Form.Label>
              <Form.Select
                value={answers.primary_language}
                onChange={(e) => setAnswers({ ...answers, primary_language: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Urdu">Urdu</option>
                <option value="Arabic">Arabic</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>8. Anything else we should know? (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={answers.additional_context}
                onChange={(e) => setAnswers({ ...answers, additional_context: e.target.value })}
                placeholder="e.g., We have a strict 30-day return policy, we don't handle payment processing over the phone"
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  )

  const renderNaturalLanguage = () => (
    <div>
      <Alert variant="info" className="mb-4">
        <IconifyIcon icon="solar:pen-new-square-bold-duotone" width={20} className="me-2" />
        <strong>Natural Language Setup:</strong> Describe your agent in your own words. Be as detailed as possible.
      </Alert>

      <Form.Group>
        <Form.Label>Describe what your AI agent should do</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Example:

I run a pizza delivery business called "Tony's Pizza" in Chicago. We're open 7 days a week from 11 AM to 11 PM. 

The agent should handle:
- Taking orders for pizzas, sides, and drinks
- Answering questions about our menu and prices
- Tracking existing orders
- Handling complaints about late deliveries or wrong orders

The agent should NOT:
- Process payments (we use online payment only)
- Approve refunds (escalate to manager)
- Change delivery addresses after order is placed

Our typical customers are families ordering dinner. We want a friendly, casual tone. If someone is angry about a late delivery, the agent should apologize and offer to create a complaint ticket for our manager to review.

We have 3 store locations and delivery takes 30-45 minutes typically.`}
          style={{ minHeight: '300px' }}
        />
        <Form.Text className="text-muted">
          Minimum 50 characters. Include: what your business does, what the agent should handle, 
          what it shouldn't do, your tone preferences, and any special rules.
        </Form.Text>
      </Form.Group>
    </div>
  )

  const renderGenerating = () => (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
      <h5 className="mt-4 mb-2">Generating Your Agent Configuration</h5>
      <p className="text-muted">
        AI is analyzing your input and creating a complete agent setup...
        <br />
        This may take 10-20 seconds.
      </p>
    </div>
  )

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <IconifyIcon icon="solar:magic-stick-bold-duotone" width={24} />
          AI-Powered Quick Setup
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ minHeight: '400px' }}>
        {mode === 'choice' && renderModeSelection()}
        {mode === 'quick-questions' && renderQuickQuestions()}
        {mode === 'natural-language' && renderNaturalLanguage()}
        {mode === 'generating' && renderGenerating()}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <div>
          {mode !== 'choice' && mode !== 'generating' && (
            <Button variant="outline-secondary" onClick={() => setMode('choice')}>
              <IconifyIcon icon="solar:alt-arrow-left-linear" width={18} className="me-2" />
              Back
            </Button>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          {mode === 'quick-questions' && (
            <Button 
              variant="primary" 
              onClick={handleQuickQuestionsSubmit}
              disabled={loading}
            >
              <IconifyIcon icon="solar:magic-stick-bold-duotone" width={18} className="me-2" />
              Generate Configuration
            </Button>
          )}

          {mode === 'natural-language' && (
            <Button 
              variant="primary" 
              onClick={handleNaturalLanguageSubmit}
              disabled={loading}
            >
              <IconifyIcon icon="solar:magic-stick-bold-duotone" width={18} className="me-2" />
              Generate Configuration
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  )
}