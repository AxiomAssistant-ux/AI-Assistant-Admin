// components/AgentSetupWizard.tsx
'use client'

import React, { useState } from 'react'
import { Modal, Button, Form, Row, Col, Badge, Alert, Card, ProgressBar } from 'react-bootstrap'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import { toast } from 'react-toastify'
import type { AgentConfiguration } from '@/api/org/agents'

interface WizardStep {
  id: number
  title: string
  subtitle: string
  icon: string
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Branding', subtitle: 'Company & Voice', icon: 'solar:buildings-bold-duotone' },
  { id: 2, title: 'Operations', subtitle: 'Hours & Languages', icon: 'solar:clock-circle-linear' },
  { id: 3, title: 'Authority', subtitle: 'Permissions', icon: 'solar:shield-check-linear' },
  { id: 4, title: 'Escalation', subtitle: 'Routing Rules', icon: 'solar:phone-calling-linear' },
  { id: 5, title: 'Data & Compliance', subtitle: 'Privacy & Security', icon: 'solar:lock-keyhole-outline' },
  { id: 6, title: 'Knowledge Base', subtitle: 'Files & Content', icon: 'solar:book-linear' },
  { id: 7, title: 'Integrations', subtitle: 'Connected Tools', icon: 'solar:widget-linear' },
  { id: 8, title: 'Call Experience', subtitle: 'User Journey', icon: 'solar:phone-linear' },
  { id: 9, title: 'Analytics', subtitle: 'Tracking & KPIs', icon: 'solar:chart-bold-duotone' },
  { id: 10, title: 'Training', subtitle: 'Edge Cases', icon: 'solar:help-linear' },
  { id: 11, title: 'Review', subtitle: 'Final Check', icon: 'solar:check-circle-bold' }
]

interface AgentSetupWizardProps {
  show: boolean
  onHide: () => void
  onSubmit: (config: AgentConfiguration) => Promise<void>
  initialConfig?: Partial<AgentConfiguration>
}

// ===== BRANDING STEP =====
export const BrandingStep: React.FC<any> = ({ config, updateConfig, addArrayItem, removeArrayItem }) => {
  const [newPhrase, setNewPhrase] = useState('')
  const [newAvoidPhrase, setNewAvoidPhrase] = useState('')

  return (
    <div>
      <h5 className="mb-3">Business Identity & Branding</h5>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Company/Business Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              value={config.company_name}
              onChange={(e) => updateConfig('branding', 'company_name', e.target.value)}
              placeholder="Your Company Name"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Agent Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              value={config.agent_name}
              onChange={(e) => updateConfig('branding', 'agent_name', e.target.value)}
              placeholder="Customer Care Assistant"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Industry/Sector</Form.Label>
            <Form.Control
              value={config.industry}
              onChange={(e) => updateConfig('branding', 'industry', e.target.value)}
              placeholder="Customer Support & Service"
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Brand Voice Guidelines</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={config.brand_voice}
              onChange={(e) => updateConfig('branding', 'brand_voice', e.target.value)}
              placeholder="Friendly, professional, clear, and empathetic"
            />
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Phrases to Always Use</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="Add a phrase..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addArrayItem('branding', 'phrases_to_use', newPhrase)
                    setNewPhrase('')
                  }
                }}
              />
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  addArrayItem('branding', 'phrases_to_use', newPhrase)
                  setNewPhrase('')
                }}
              >
                <IconifyIcon icon="solar:add-circle-linear" width={18} />
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {config.phrases_to_use.map((phrase: string, idx: number) => (
                <Badge key={idx} bg="success" className="d-flex align-items-center gap-1 px-2 py-1">
                  {phrase}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => removeArrayItem('branding', 'phrases_to_use', idx)}
                  />
                </Badge>
              ))}
            </div>
          </Form.Group>
        </Col>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Phrases to Never Use</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                value={newAvoidPhrase}
                onChange={(e) => setNewAvoidPhrase(e.target.value)}
                placeholder="Add a phrase to avoid..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addArrayItem('branding', 'phrases_to_avoid', newAvoidPhrase)
                    setNewAvoidPhrase('')
                  }
                }}
              />
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  addArrayItem('branding', 'phrases_to_avoid', newAvoidPhrase)
                  setNewAvoidPhrase('')
                }}
              >
                <IconifyIcon icon="solar:add-circle-linear" width={18} />
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {config.phrases_to_avoid.map((phrase: string, idx: number) => (
                <Badge key={idx} bg="danger" className="d-flex align-items-center gap-1 px-2 py-1">
                  {phrase}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => removeArrayItem('branding', 'phrases_to_avoid', idx)}
                  />
                </Badge>
              ))}
            </div>
          </Form.Group>
        </Col>
      </Row>
    </div>
  )
}

// ===== OPERATIONS STEP =====
export const OperationsStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Operational Information</h5>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Operating Hours</Form.Label>
          <Form.Control
            value={config.operating_hours}
            onChange={(e) => updateConfig('operations', 'operating_hours', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Time Zone</Form.Label>
          <Form.Select
            value={config.timezone}
            onChange={(e) => updateConfig('operations', 'timezone', e.target.value)}
          >
            <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Primary Language</Form.Label>
          <Form.Select
            value={config.primary_language}
            onChange={(e) => updateConfig('operations', 'primary_language', e.target.value)}
          >
            <option value="English">English</option>
            <option value="Urdu">Urdu</option>
            <option value="Arabic">Arabic</option>
            <option value="Spanish">Spanish</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Avg Call Duration (minutes)</Form.Label>
          <Form.Control
            type="number"
            value={config.avg_call_duration}
            onChange={(e) => updateConfig('operations', 'avg_call_duration', parseInt(e.target.value))}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Check
          type="switch"
          id="call-recording"
          label="Enable Call Recording (Recommended for QA & Training)"
          checked={config.call_recording}
          onChange={(e) => updateConfig('operations', 'call_recording', e.target.checked)}
        />
      </Col>
    </Row>
  </div>
)

// ===== AUTHORITY STEP =====
export const AuthorityStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Response & Resolution Authority</h5>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Max Compensation Value ($)</Form.Label>
          <Form.Control
            type="number"
            value={config.max_compensation_value}
            onChange={(e) => updateConfig('authority', 'max_compensation_value', parseFloat(e.target.value))}
          />
          <Form.Text>Agent cannot approve compensation by default</Form.Text>
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Refund/Compensation Policy</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={config.refund_policy}
            onChange={(e) => updateConfig('authority', 'refund_policy', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Alert variant="info">
          <strong>Quick Reference:</strong>
          <ul className="mb-0 mt-2 small">
            <li>Agent CAN: Schedule/book, track orders, basic troubleshooting, intake refund requests</li>
            <li>Agent CANNOT: Approve refunds, process payments, cancel accounts without approval</li>
          </ul>
        </Alert>
      </Col>
    </Row>
  </div>
)

// ===== ESCALATION STEP =====
export const EscalationStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Escalation & Routing</h5>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Escalation Email</Form.Label>
          <Form.Control
            type="email"
            value={config.escalation_email}
            onChange={(e) => updateConfig('escalation', 'escalation_email', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Escalation Phone</Form.Label>
          <Form.Control
            value={config.escalation_phone}
            onChange={(e) => updateConfig('escalation', 'escalation_phone', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>After-Hours Handling</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={config.after_hours_handling}
            onChange={(e) => updateConfig('escalation', 'after_hours_handling', e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
  </div>
)

// ===== DATA & COMPLIANCE STEP =====
export const DataComplianceStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Data Collection & Compliance</h5>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Data Retention (days)</Form.Label>
          <Form.Control
            type="number"
            value={config.data_retention_days}
            onChange={(e) => updateConfig('data_compliance', 'data_retention_days', parseInt(e.target.value))}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Verification Process</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={config.verification_process}
            onChange={(e) => updateConfig('data_compliance', 'verification_process', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Alert variant="warning">
          <strong>⚠️ Security Note:</strong> Agent will never ask for full credit card numbers or passwords.
        </Alert>
      </Col>
    </Row>
  </div>
)

// ===== KNOWLEDGE BASE STEP =====
export const KnowledgeBaseStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Knowledge Base & Context</h5>
    <Row className="g-3">
      <Col md={12}>
        <Form.Check
          type="switch"
          id="faqs-enabled"
          label="Enable FAQ Knowledge Base"
          checked={config.faqs_enabled}
          onChange={(e) => updateConfig('knowledge_base', 'faqs_enabled', e.target.checked)}
        />
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Product/Service Catalog</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={config.product_catalog}
            onChange={(e) => updateConfig('knowledge_base', 'product_catalog', e.target.value)}
            placeholder="Basic list of main services/products..."
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Location Information</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={config.location_info}
            onChange={(e) => updateConfig('knowledge_base', 'location_info', e.target.value)}
            placeholder="Main office/store locations..."
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Pricing Information</Form.Label>
          <Form.Control
            value={config.pricing_info}
            onChange={(e) => updateConfig('knowledge_base', 'pricing_info', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Alert variant="info">
          <IconifyIcon icon="solar:info-circle-linear" width={20} className="me-2" />
          You can upload knowledge base files after agent setup is complete.
        </Alert>
      </Col>
    </Row>
  </div>
)

// ===== INTEGRATIONS STEP =====
export const IntegrationsStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Integration Requirements</h5>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>CRM System</Form.Label>
          <Form.Select
            value={config.crm_system || ''}
            onChange={(e) => updateConfig('integrations', 'crm_system', e.target.value || null)}
          >
            <option value="">Not Connected</option>
            <option value="salesforce">Salesforce</option>
            <option value="hubspot">HubSpot</option>
            <option value="zoho">Zoho CRM</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Check
          type="switch"
          id="ticketing"
          label="Enable Ticketing System"
          checked={config.ticketing_enabled}
          onChange={(e) => updateConfig('integrations', 'ticketing_enabled', e.target.checked)}
        />
      </Col>
      <Col md={12}>
        <Form.Check
          type="switch"
          id="email"
          label="Enable Email Service"
          checked={config.email_enabled}
          onChange={(e) => updateConfig('integrations', 'email_enabled', e.target.checked)}
        />
      </Col>
      <Col md={12}>
        <Form.Check
          type="switch"
          id="sms"
          label="Enable SMS Service"
          checked={config.sms_enabled}
          onChange={(e) => updateConfig('integrations', 'sms_enabled', e.target.checked)}
        />
      </Col>
      <Col md={12}>
        <Form.Check
          type="switch"
          id="calendar"
          label="Enable Calendar/Scheduling (Google Calendar / Calendly)"
          checked={config.calendar_enabled}
          onChange={(e) => updateConfig('integrations', 'calendar_enabled', e.target.checked)}
        />
      </Col>
      <Col md={12}>
        <Form.Check
          type="switch"
          id="payment"
          label="Enable Payment Processing"
          checked={config.payment_enabled}
          onChange={(e) => updateConfig('integrations', 'payment_enabled', e.target.checked)}
          disabled
        />
        <Form.Text className="text-muted">Payment processing is disabled by default for security</Form.Text>
      </Col>
    </Row>
  </div>
)

// ===== CALL EXPERIENCE STEP =====
export const CallExperienceStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Call Experience Preferences</h5>
    <Row className="g-3">
      <Col md={12}>
        <Form.Group>
          <Form.Label>Hold Music/Message</Form.Label>
          <Form.Control
            value={config.hold_message}
            onChange={(e) => updateConfig('call_experience', 'hold_message', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label>Call Transfer Process</Form.Label>
          <Form.Select
            value={config.transfer_type}
            onChange={(e) => updateConfig('call_experience', 'transfer_type', e.target.value)}
          >
            <option value="warm">Warm Transfer (Recommended)</option>
            <option value="cold">Cold Transfer</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Voicemail Handling</Form.Label>
          <Form.Control
            value={config.voicemail_handling}
            onChange={(e) => updateConfig('call_experience', 'voicemail_handling', e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col md={12}>
        <Form.Group>
          <Form.Label>Customer Callback Preference</Form.Label>
          <Form.Control
            value={config.callback_preference}
            onChange={(e) => updateConfig('call_experience', 'callback_preference', e.target.value)}
          />
        </Form.Group>
      </Col>
    </Row>
  </div>
)

// ===== ANALYTICS STEP =====
export const AnalyticsStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Performance & Analytics</h5>
    <Row className="g-3">
      <Col md={6}>
        <Form.Group>
          <Form.Label>Reporting Frequency</Form.Label>
          <Form.Select
            value={config.reporting_frequency}
            onChange={(e) => updateConfig('analytics', 'reporting_frequency', e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={12}>
        <Alert variant="info">
          <strong>Default KPIs Tracked:</strong>
          <ul className="mb-0 mt-2 small">
            <li>Resolution rate & Escalation rate</li>
            <li>Average call duration & First call resolution</li>
            <li>Customer satisfaction score & Missed calls</li>
          </ul>
        </Alert>
      </Col>
    </Row>
  </div>
)

// ===== TRAINING STEP =====
export const TrainingStep: React.FC<any> = ({ config, updateConfig }) => (
  <div>
    <h5 className="mb-3">Sample Dialogues & Training</h5>
    <Row className="g-3">
      <Col md={12}>
        <Alert variant="info">
          <strong>Default Edge Cases Handled:</strong>
          <ul className="mb-0 mt-2 small">
            <li>Caller refuses verification</li>
            <li>Caller is angry / abusive</li>
            <li>Caller asks for immediate refund approval</li>
            <li>Caller asks for sensitive information</li>
            <li>Agent cannot find customer record</li>
          </ul>
        </Alert>
      </Col>
      <Col md={12}>
        <Alert variant="success">
          <strong>Default Tone Examples:</strong>
          <ul className="mb-0 mt-2 small">
            <li>"I understand — let me help you with that right away."</li>
            <li>"Thanks for your patience. I'm checking the details now."</li>
            <li>"To keep your account secure, I'll need to verify a couple of details."</li>
          </ul>
        </Alert>
      </Col>
    </Row>
  </div>
)

// ===== REVIEW STEP =====
export const ReviewStep: React.FC<{ config: AgentConfiguration }> = ({ config }) => (
  <div>
    <h5 className="mb-3">Review Your Configuration</h5>
    <Alert variant="success" className="mb-3">
      <IconifyIcon icon="solar:check-circle-bold" width={20} className="me-2" />
      Your agent configuration is ready! Review the summary below before submitting.
    </Alert>

    <Row className="g-3">
      <Col md={6}>
        <Card className="border-0 bg-light">
          <Card.Body>
            <h6 className="text-muted small mb-2">BRANDING</h6>
            <div className="small">
              <strong>{config.branding.company_name}</strong>
              <div className="text-muted">{config.branding.agent_name}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="border-0 bg-light">
          <Card.Body>
            <h6 className="text-muted small mb-2">OPERATIONS</h6>
            <div className="small">
              <strong>{config.operations.operating_hours}</strong>
              <div className="text-muted">{config.operations.primary_language}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="border-0 bg-light">
          <Card.Body>
            <h6 className="text-muted small mb-2">ESCALATION</h6>
            <div className="small">
              <div>{config.escalation.escalation_email}</div>
              <div className="text-muted">{config.escalation.escalation_phone}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="border-0 bg-light">
          <Card.Body>
            <h6 className="text-muted small mb-2">INTEGRATIONS</h6>
            <div className="small">
              <Badge bg={config.integrations.ticketing_enabled ? 'success' : 'secondary'}>Ticketing</Badge>{' '}
              <Badge bg={config.integrations.email_enabled ? 'success' : 'secondary'}>Email</Badge>{' '}
              <Badge bg={config.integrations.calendar_enabled ? 'success' : 'secondary'}>Calendar</Badge>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
)

export const AgentSetupWizard: React.FC<AgentSetupWizardProps> = ({
  show,
  onHide,
  onSubmit,
  initialConfig
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [config, setConfig] = useState<AgentConfiguration>({
    branding: {
      company_name: initialConfig?.branding?.company_name || 'Your Company Name',
      agent_name: initialConfig?.branding?.agent_name || 'Customer Care Assistant',
      industry: initialConfig?.branding?.industry || 'Customer Support & Service',
      brand_voice: initialConfig?.branding?.brand_voice || 'Friendly, professional, clear, and empathetic',
      phrases_to_use: initialConfig?.branding?.phrases_to_use || [
        'Thanks for calling',
        'I can help with that',
        'Let me quickly check that for you',
        'One moment please',
        'Is there anything else I can help you with today?'
      ],
      phrases_to_avoid: initialConfig?.branding?.phrases_to_avoid || [
        "I don't know",
        "That's not my job",
        'Calm down',
        'You must / You should',
        'This is your fault'
      ]
    },
    operations: {
      operating_hours: initialConfig?.operations?.operating_hours || '24/7',
      timezone: initialConfig?.operations?.timezone || 'Asia/Karachi',
      primary_language: initialConfig?.operations?.primary_language || 'English',
      secondary_languages: initialConfig?.operations?.secondary_languages || ['Urdu'],
      avg_call_duration: initialConfig?.operations?.avg_call_duration || 5,
      call_recording: initialConfig?.operations?.call_recording ?? true
    },
    authority: {
      allowed_actions: initialConfig?.authority?.allowed_actions || [
        'Scheduling / booking',
        'Order status / tracking',
        'Basic troubleshooting',
        'Refund request intake',
        'Discount/voucher request intake'
      ],
      max_compensation_value: initialConfig?.authority?.max_compensation_value || 0,
      approval_required_for: initialConfig?.authority?.approval_required_for || [
        'Refund approvals',
        'Discounts/vouchers over allowed limit',
        'Account cancellations',
        'Complaints requiring manager attention',
        'Anything involving payment/security'
      ],
      immediate_actions: initialConfig?.authority?.immediate_actions || [
        'Send follow-up email confirmation',
        'Create support ticket',
        'Schedule callback',
        'Escalate to human agent'
      ],
      refund_policy: initialConfig?.authority?.refund_policy || 
        'The agent can collect refund/compensation requests and create a ticket. Refund approvals are handled by the billing/support team after verification and policy checks.'
    },
    escalation: {
      escalation_triggers: initialConfig?.escalation?.escalation_triggers || [
        'Customer asks to speak with a human',
        'Angry / abusive language detected',
        'Payment disputes, chargebacks, fraud concerns',
        'Legal threats or data/privacy concerns',
        'Agent confidence is low after 2 attempts'
      ],
      escalation_email: initialConfig?.escalation?.escalation_email || 'support@yourcompany.com',
      escalation_phone: initialConfig?.escalation?.escalation_phone || '+1 (000) 000-0000',
      priority_levels: initialConfig?.escalation?.priority_levels || {
        urgent: 'Safety risk, fraud, legal threat, payment breach',
        high: 'Service down, repeated failures, VIP complaint',
        medium: 'Standard complaint, delayed delivery, refund request',
        low: 'General inquiries, FAQs, basic requests'
      },
      department_routing: initialConfig?.escalation?.department_routing || {
        'Billing & Payments': 'Billing Support',
        'Refund Requests': 'Finance',
        'Technical Issues': 'Tech Support',
        'Complaints': 'Customer Success',
        'New Sales Leads': 'Sales Team'
      },
      after_hours_handling: initialConfig?.escalation?.after_hours_handling || 
        'Take message + create ticket + schedule callback'
    },
    data_compliance: {
      mandatory_fields: initialConfig?.data_compliance?.mandatory_fields || [
        'Full name',
        'Phone number',
        'Email address',
        'Reason for call / issue summary'
      ],
      optional_fields: initialConfig?.data_compliance?.optional_fields || [
        'Order number / booking ID',
        'Account number',
        'Address (if delivery-related)'
      ],
      compliance_requirements: initialConfig?.data_compliance?.compliance_requirements || [
        'GDPR (basic privacy handling)',
        'PCI-DSS (do not collect card numbers)'
      ],
      data_retention_days: initialConfig?.data_compliance?.data_retention_days || 90,
      verification_process: initialConfig?.data_compliance?.verification_process || 
        'Verify the caller using at least 2 data points: phone number + order/booking ID OR email confirmation.'
    },
    knowledge_base: {
      faqs_enabled: initialConfig?.knowledge_base?.faqs_enabled ?? true,
      product_catalog: initialConfig?.knowledge_base?.product_catalog || '',
      location_info: initialConfig?.knowledge_base?.location_info || '',
      common_scenarios: initialConfig?.knowledge_base?.common_scenarios || [
        'Check order status / tracking',
        'Change appointment date/time',
        'Pricing inquiry',
        'Refund request',
        'Complaint about service/product'
      ],
      company_policies: initialConfig?.knowledge_base?.company_policies || [
        'Return policy',
        'Warranty policy',
        'Cancellation policy',
        'Terms & conditions'
      ],
      pricing_info: initialConfig?.knowledge_base?.pricing_info || 
        'Show "starting from" pricing only unless exact pricing is provided.'
    },
    integrations: {
      crm_system: initialConfig?.integrations?.crm_system || null,
      ticketing_enabled: initialConfig?.integrations?.ticketing_enabled ?? true,
      email_enabled: initialConfig?.integrations?.email_enabled ?? true,
      sms_enabled: initialConfig?.integrations?.sms_enabled ?? false,
      calendar_enabled: initialConfig?.integrations?.calendar_enabled ?? true,
      payment_enabled: initialConfig?.integrations?.payment_enabled ?? false,
      webhook_urls: initialConfig?.integrations?.webhook_urls || []
    },
    call_experience: {
      hold_message: initialConfig?.call_experience?.hold_message || 
        'Thanks for holding, we\'ll be right with you.',
      transfer_type: initialConfig?.call_experience?.transfer_type || 'warm',
      voicemail_handling: initialConfig?.call_experience?.voicemail_handling || 
        'Take message + send email + create ticket',
      post_call_actions: initialConfig?.call_experience?.post_call_actions || [
        'Send call summary email (internal)',
        'Create ticket automatically'
      ],
      callback_preference: initialConfig?.call_experience?.callback_preference || 
        'Within 24 hours via phone (preferred)'
    },
    analytics: {
      success_metrics: initialConfig?.analytics?.success_metrics || [
        'Call resolved without human transfer',
        'Ticket created with complete information',
        'Customer received next steps clearly'
      ],
      kpis_to_track: initialConfig?.analytics?.kpis_to_track || [
        'Resolution rate',
        'Escalation rate',
        'Average call duration',
        'First call resolution',
        'Customer satisfaction score',
        'Missed calls / voicemail rate'
      ],
      reporting_frequency: initialConfig?.analytics?.reporting_frequency || 'weekly',
      alert_triggers: initialConfig?.analytics?.alert_triggers || {
        'Escalation rate': 25,
        'Avg call duration': 8,
        'Negative sentiment calls': 10,
        'Failed follow-up emails': 5
      }
    },
    training: {
      edge_cases: initialConfig?.training?.edge_cases || [
        'Caller refuses verification',
        'Caller is angry / abusive',
        'Caller asks for refund approval immediately',
        'Caller asks for sensitive information',
        'Agent cannot find customer record'
      ],
      tone_examples: initialConfig?.training?.tone_examples || [
        'I understand — let me help you with that right away.',
        'Thanks for your patience. I\'m checking the details now.',
        'To keep your account secure, I\'ll need to verify a couple of details.'
      ],
      sample_dialogues: initialConfig?.training?.sample_dialogues || []
    }
  })

  const progress = (currentStep / WIZARD_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await onSubmit(config)
      toast.success('Agent configuration saved successfully!')
      onHide()
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to save configuration')
    } finally {
      setSubmitting(false)
    }
  }

  const updateConfig = <K extends keyof AgentConfiguration>(
    section: K,
    field: keyof AgentConfiguration[K],
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const addArrayItem = <K extends keyof AgentConfiguration>(
    section: K,
    field: keyof AgentConfiguration[K],
    item: string
  ) => {
    if (!item.trim()) return
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section][field] as string[]), item.trim()]
      }
    }))
  }

  const removeArrayItem = <K extends keyof AgentConfiguration>(
    section: K,
    field: keyof AgentConfiguration[K],
    index: number
  ) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section][field] as string[]).filter((_, i) => i !== index)
      }
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Branding
        return <BrandingStep config={config.branding} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 2: // Operations
        return <OperationsStep config={config.operations} updateConfig={updateConfig} />
      case 3: // Authority
        return <AuthorityStep config={config.authority} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 4: // Escalation
        return <EscalationStep config={config.escalation} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 5: // Data & Compliance
        return <DataComplianceStep config={config.data_compliance} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 6: // Knowledge Base
        return <KnowledgeBaseStep config={config.knowledge_base} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 7: // Integrations
        return <IntegrationsStep config={config.integrations} updateConfig={updateConfig} />
      case 8: // Call Experience
        return <CallExperienceStep config={config.call_experience} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 9: // Analytics
        return <AnalyticsStep config={config.analytics} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 10: // Training
        return <TrainingStep config={config.training} updateConfig={updateConfig} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      case 11: // Review
        return <ReviewStep config={config} />
      default:
        return null
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <IconifyIcon icon={WIZARD_STEPS[currentStep - 1].icon} width={24} height={24} />
          Agent Setup Wizard
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="small text-muted">
              Step {currentStep} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep - 1].title}
            </span>
            <span className="small text-muted">{Math.round(progress)}% Complete</span>
          </div>
          <ProgressBar now={progress} style={{ height: '6px' }} />
        </div>

        {/* Step Content */}
        <div style={{ minHeight: '400px' }}>
          {renderStepContent()}
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-secondary" onClick={handleBack} disabled={currentStep === 1 || submitting}>
          <IconifyIcon icon="solar:alt-arrow-left-linear" width={18} height={18} className="me-2" />
          Back
        </Button>

        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={onHide} disabled={submitting}>
            Cancel
          </Button>

          {currentStep < WIZARD_STEPS.length ? (
            <Button variant="primary" onClick={handleNext}>
              Next
              <IconifyIcon icon="solar:alt-arrow-right-linear" width={18} height={18} className="ms-2" />
            </Button>
          ) : (
            <Button variant="success" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:check-circle-bold" width={18} height={18} className="me-2" />
                  Submit Configuration
                </>
              )}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  )
}

// Step Components (to be continued in next artifact...)