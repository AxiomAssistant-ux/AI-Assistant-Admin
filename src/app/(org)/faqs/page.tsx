'use client'

import React, { useState } from 'react'
import { Accordion, Card, CardBody, Col, Form, InputGroup, Row } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'

type FAQItem = {
  id: string
  category: string
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq_001',
    category: 'Getting Started',
    question: 'What is this voice assistant system?',
    answer: 'This is an AI-powered voice assistant that handles incoming calls for your business. It can answer customer questions, schedule appointments, process orders, and provide support 24/7. You can view all call interactions and follow up on important items through this dashboard.'
  },
  {
    id: 'faq_002',
    category: 'Getting Started',
    question: 'How do I access my call records?',
    answer: 'All your call records are available in the "Call Logs" tab. You can see caller information, call duration, timestamps, and conversation summaries. Use the filters and sorting options to find specific calls quickly.'
  },
  {
    id: 'faq_003',
    category: 'Getting Started',
    question: 'What are action items and why are they important?',
    answer: 'Action items are follow-up tasks that the AI identifies from call conversations. These might include calling a customer back, sending information, scheduling appointments, or resolving issues. They help ensure no important customer requests are forgotten.'
  },
  {
    id: 'faq_004',
    category: 'Call Management',
    question: 'How do I view call details and transcripts?',
    answer: 'Click the "View" button next to any call in the Call Logs tab to see the full conversation transcript, caller details, and AI analysis. You can also see what the AI said to the customer and how the conversation went.'
  },
  {
    id: 'faq_005',
    category: 'Call Management',
    question: 'How do I manage my action items?',
    answer: 'Go to the Action Items tab to see all follow-up tasks from calls. You can mark items as complete, view details, and use the AI reply feature to send automated follow-up emails to customers. This helps you stay on top of customer requests.'
  },
  {
    id: 'faq_006',
    category: 'Call Management',
    question: 'How do I mark calls as read or unread?',
    answer: 'Click the status badge next to any call in the Call Logs. Green "Read" means you\'ve reviewed it, gray "Unread" means it needs your attention. This helps you keep track of which calls you\'ve already looked at.'
  },
  {
    id: 'faq_007',
    category: 'Using AI Features',
    question: 'How do I use the AI reply feature?',
    answer: 'When viewing action items with customer email addresses, click "Reply using AI" to automatically generate personalized follow-up emails. The AI creates professional responses based on the call conversation, saving you time on customer follow-ups.'
  },
  {
    id: 'faq_008',
    category: 'Using AI Features',
    question: 'How accurate are the call transcriptions?',
    answer: 'The AI provides very accurate transcriptions of your calls, typically 95%+ accuracy for clear audio. You can see exactly what was said during each conversation, including both the customer\'s questions and the AI\'s responses.'
  },
  {
    id: 'faq_009',
    category: 'Using AI Features',
    question: 'What information does the AI extract from calls?',
    answer: 'The AI automatically identifies important information like customer names, phone numbers, email addresses, specific requests, and follow-up tasks. It also determines the purpose of each call and creates action items for things that need your attention.'
  },
  {
    id: 'faq_010',
    category: 'Dashboard & Reports',
    question: 'What information can I see on the dashboard?',
    answer: 'The dashboard shows you call statistics, recent activity, charts of call trends, and quick access to your most important data. You can see how many calls you\'ve received, average call duration, and action items that need attention.'
  },
  {
    id: 'faq_011',
    category: 'Dashboard & Reports',
    question: 'How do I export my call data?',
    answer: 'Use the export buttons in the Call Logs and Action Items sections to download your data as CSV or PDF files. This is useful for creating reports, sharing information with your team, or keeping records for your business.'
  },
  {
    id: 'faq_012',
    category: 'Dashboard & Reports',
    question: 'How do I filter and sort my calls?',
    answer: 'Use the filter buttons to show only calls from specific time periods or with certain statuses. Use the sort dropdown to organize calls by date, caller name, or duration. This helps you find specific calls quickly.'
  },
  {
    id: 'faq_013',
    category: 'Common Issues',
    question: 'Why can\'t I see my recent calls?',
    answer: 'If you don\'t see recent calls, try refreshing the page or checking your internet connection. Calls usually appear within a few minutes of completion. If the issue persists, contact support for assistance.'
  },
  {
    id: 'faq_014',
    category: 'Common Issues',
    question: 'The AI reply feature isn\'t working. What should I do?',
    answer: 'Make sure the action item has a valid customer email address. The AI reply feature only works when there\'s a proper email to send the response to. If the email looks correct, try refreshing the page and trying again.'
  },
  {
    id: 'faq_015',
    category: 'Common Issues',
    question: 'How do I get help if I\'m stuck?',
    answer: 'Use the Contact Support tab to reach our support team. You can also check the dashboard for any system status updates. We\'re here to help you get the most out of your voice assistant system.'
  }
]

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>('Getting Started')

  const categories = Array.from(new Set(FAQ_DATA.map(faq => faq.category)))

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !activeCategory || faq.category === activeCategory
    
    return matchesSearch && matchesCategory
  })

  const faqsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredFAQs.filter(faq => faq.category === category)
    return acc
  }, {} as Record<string, FAQItem[]>)

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="mb-2">Frequently Asked Questions</h4>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">AI Assistant</Link>
              </li>
              <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
              </div>
              <li className="breadcrumb-item active">FAQ</li>
            </ol>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="text-center mb-4">
                <IconifyIcon icon="solar:question-circle-linear" width={64} height={64} className="text-primary mb-3" />
                <h3>How can we help you?</h3>
                <p className="text-muted">Search our knowledge base or browse by category</p>
              </div>

              <Row className="justify-content-center mb-4">
                <Col lg={8}>
                  <InputGroup size="lg">
                    <InputGroup.Text>
                      <IconifyIcon icon="solar:magnifer-linear" width={20} height={20} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search for answers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <InputGroup.Text
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSearchQuery('')}
                      >
                        <IconifyIcon icon="solar:close-circle-linear" width={20} height={20} />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12}>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button
                      className={`btn ${!activeCategory ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveCategory(null)}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </Col>
              </Row>

              {searchQuery && (
                <div className="mb-3">
                  <p className="text-muted">
                    Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                </div>
              )}

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-5">
                  <IconifyIcon icon="solar:file-search-linear" width={64} height={64} className="text-muted mb-3" />
                  <h5 className="text-muted">No results found</h5>
                  <p className="text-muted">Try adjusting your search or browse by category</p>
                </div>
              ) : (
                <>
                  {Object.entries(faqsByCategory).map(([category, faqs]) => (
                    faqs.length > 0 && (
                      <div key={category} className="mb-4">
                        <h5 className="mb-3 d-flex align-items-center gap-2">
                          <IconifyIcon 
                            icon={
                              category === 'Getting Started' ? 'solar:rocket-linear' :
                              category === 'Call Management' ? 'solar:phone-calling-linear' :
                              category === 'Using AI Features' ? 'solar:cpu-linear' :
                              category === 'Dashboard & Reports' ? 'solar:chart-linear' :
                              'solar:settings-linear'
                            } 
                            width={24} 
                            height={24} 
                            className="text-primary"
                          />
                          {category}
                        </h5>
                        <Accordion defaultActiveKey={faqs[0]?.id}>
                          {faqs.map(faq => (
                            <Accordion.Item key={faq.id} eventKey={faq.id}>
                              <Accordion.Header>
                                <div className="d-flex align-items-center gap-2">
                                  <IconifyIcon icon="solar:question-circle-linear" width={20} height={20} className="text-primary" />
                                  {faq.question}
                                </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                <p className="mb-0">{faq.answer}</p>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </div>
                    )
                  ))}
                </>
              )}

              <div className="text-center mt-5 pt-4 border-top">
                <h5 className="mb-3">Still need help?</h5>
                <p className="text-muted mb-3">Can't find what you're looking for? Our support team is here to help.</p>
                <Link href="/contact-support" className="btn btn-primary">
                  <IconifyIcon icon="solar:chat-round-linear" width={20} height={20} className="me-2" />
                  Contact Support
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default FAQPage