'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Form, Alert, Table, Spinner, Nav, Card } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrapper/IconifyIcon'
import Footer from '@/components/layout/Footer'
import { useAuth } from '@/context/useAuthContext'
import { DataTable } from '@/components/table'
import type { DataTableColumn } from '@/components/table'
import { toast } from 'react-toastify'
import { locationsApi, type Location, type ParsedLocation } from '@/api/org/locations'
import { useFeatureGuard } from '@/hooks/useFeatureGuard'

const LocationsPage = () => {
  useFeatureGuard()
  const { token, isAuthenticated, user } = useAuth()
  
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  
  // Create/Edit modal
  const [showModal, setShowModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    store_number: '',
    store_location: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  
  // Import flow
  const [showImportModal, setShowImportModal] = useState(false)
  const [importMode, setImportMode] = useState<'file' | 'text'>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [parsedLocations, setParsedLocations] = useState<ParsedLocation[]>([])
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [selectedLocations, setSelectedLocations] = useState<Set<number>>(new Set())
  const [bulkSaving, setBulkSaving] = useState(false)

  // Mobile account modal
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [mobileLocation, setMobileLocation] = useState<Location | null>(null)
  const [mobileEmail, setMobileEmail] = useState('')
  const [enablingMobile, setEnablingMobile] = useState(false)

  const isAdmin = Boolean(user && 'is_admin' in user && user.is_admin)
  
  // Get admin's email domain for suggestion
  const adminEmailDomain = useMemo(() => {
    if (user && 'email' in user && user.email) {
      const match = user.email.match(/@(.+)/)
      return match ? match[1] : 'example.com'
    }
    return 'example.com'
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchLocations = useCallback(async () => {
    if (!token || !isAuthenticated) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await locationsApi.list({
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        search: debouncedSearch || undefined
      })
      
      setLocations(response.locations)
      setTotal(response.total)
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to fetch locations'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [token, isAuthenticated, currentPage, pageSize, debouncedSearch])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Create/Edit handlers
  const handleOpenCreateModal = () => {
    setEditingLocation(null)
    setFormData({ store_number: '', store_location: '' })
    setShowModal(true)
  }

  const handleOpenEditModal = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      store_number: location.store_number || '',
      store_location: location.store_location
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingLocation(null)
    setFormData({ store_number: '', store_location: '' })
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.store_location.trim()) {
      toast.error('Store address is required')
      return
    }
    
    setFormSubmitting(true)
    
    try {
      if (editingLocation) {
        await locationsApi.update(editingLocation.id, formData)
        toast.success('Store location updated successfully')
      } else {
        await locationsApi.create(formData)
        toast.success('Store location added successfully')
      }
      
      handleCloseModal()
      fetchLocations()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Operation failed'
      toast.error(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = useCallback(async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this store location? This will also remove any associated mobile account.')) return
    
    try {
      await locationsApi.delete(locationId)
      toast.success('Store location removed successfully')
      fetchLocations()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to delete location'
      toast.error(errorMsg)
    }
  }, [fetchLocations])

  // Mobile account handlers
  const handleOpenMobileModal = (location: Location) => {
    setMobileLocation(location)
    // Auto-generate email suggestion
    const suggestedEmail = location.store_number 
      ? `${location.store_number}@${adminEmailDomain}`
      : `store@${adminEmailDomain}`
    setMobileEmail(suggestedEmail)
    setShowMobileModal(true)
  }

  const handleCloseMobileModal = () => {
    setShowMobileModal(false)
    setMobileLocation(null)
    setMobileEmail('')
  }

  const handleEnableMobileAccount = async () => {
    if (!mobileLocation) return
    
    if (!mobileEmail.trim()) {
      toast.error('Please enter a valid email address')
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(mobileEmail)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setEnablingMobile(true)
    
    try {
      await locationsApi.enableMobileAccount(mobileLocation.id, mobileEmail)
      toast.success('Mobile account enabled! Invitation email sent to the store.')
      handleCloseMobileModal()
      fetchLocations()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to enable mobile account'
      toast.error(errorMsg)
    } finally {
      setEnablingMobile(false)
    }
  }

  const handleDisableMobileAccount = async (locationId: string) => {
    if (!confirm('Are you sure you want to disable the mobile account for this store? The store will lose access to the mobile app.')) return
    
    try {
      await locationsApi.disableMobileAccount(locationId)
      toast.success('Mobile account disabled successfully')
      fetchLocations()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to disable mobile account'
      toast.error(errorMsg)
    }
  }

  // Import handlers (unchanged from original)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File must be less than 5MB')
        return
      }
      
      const validTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      
      if (!validTypes.includes(file.type)) {
        toast.error('Unsupported file type. Please upload PDF, CSV, Word, or TXT file.')
        return
      }
      
      setSelectedFile(file)
      setParseError(null)
    }
  }

  const handleParse = async () => {
    setParsing(true)
    setParseError(null)
    setParsedLocations([])
    setSelectedLocations(new Set())
    
    try {
      let result
      
      if (importMode === 'file' && selectedFile) {
        result = await locationsApi.parseFile(selectedFile)
      } else if (importMode === 'text' && pastedText.trim()) {
        result = await locationsApi.parseText(pastedText)
      } else {
        toast.error('Please provide file or text to import')
        setParsing(false)
        return
      }
      
      if (result.parse_status === 'success' && result.locations.length > 0) {
        setParsedLocations(result.locations)
        setSelectedLocations(new Set(result.locations.map((_, idx) => idx)))
        toast.success(`Found ${result.total_extracted} store locations`)
      } else {
        setParseError(result.error_message || 'No store locations found')
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to parse'
      setParseError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setParsing(false)
    }
  }

  const handleToggleLocation = (index: number) => {
    setSelectedLocations(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleToggleAll = () => {
    if (selectedLocations.size === parsedLocations.length) {
      setSelectedLocations(new Set())
    } else {
      setSelectedLocations(new Set(parsedLocations.map((_, idx) => idx)))
    }
  }

  const handleEditParsedLocation = (index: number, field: 'store_number' | 'store_location', value: string) => {
    setParsedLocations(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSaveLocations = async () => {
    const locationsToSave = parsedLocations.filter((_, idx) => selectedLocations.has(idx))
    
    if (locationsToSave.length === 0) {
      toast.error('Please select at least one location to save')
      return
    }
    
    setBulkSaving(true)
    
    try {
      const result = await locationsApi.bulkCreate({ locations: locationsToSave })
      
      if (result.errors.length > 0) {
        toast.warning(`Saved ${result.success_count} locations (${result.errors.length} duplicates skipped)`)
      } else {
        toast.success(`Successfully saved ${result.success_count} store locations`)
      }
      
      handleCloseImportModal()
      fetchLocations()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to save locations'
      toast.error(errorMsg)
    } finally {
      setBulkSaving(false)
    }
  }

  const handleCloseImportModal = () => {
    setShowImportModal(false)
    setImportMode('file')
    setSelectedFile(null)
    setPastedText('')
    setParsedLocations([])
    setSelectedLocations(new Set())
    setParseError(null)
  }

  const handleOpenImportModal = () => {
    setShowImportModal(true)
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Table columns
  const columns: DataTableColumn<Location>[] = useMemo(
    () => [
      {
        key: 'rowNumber',
        header: '#',
        width: 60,
        align: 'left',
        render: (_, { rowIndex }) => (
          <span className="text-muted fw-semibold">{startIndex + rowIndex + 1}</span>
        )
      },
      {
        key: 'store_number',
        header: 'Store #',
        width: 140,
        render: (location) => (
          location.store_number ? (
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 32,
                  height: 32,
                  background: '#E3F2FD',
                  color: '#1976D2'
                }}
              >
                <IconifyIcon icon="solar:shop-bold" width={16} height={16} />
              </div>
              <Badge bg="primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem', fontWeight: 600 }}>
                {location.store_number}
              </Badge>
            </div>
          ) : (
            <span className="text-muted fst-italic">Not set</span>
          )
        )
      },
      {
        key: 'store_location',
        header: 'Store Address',
        minWidth: 300,
        render: (location) => (
          <div>
            <div className="fw-semibold mb-1" style={{ fontSize: '0.95rem' }}>
              {location.store_location}
            </div>
            <small className="text-muted d-flex align-items-center gap-1">
              <IconifyIcon icon="solar:calendar-linear" width={14} height={14} />
              Added {formatDateTime(location.created_at)}
            </small>
          </div>
        )
      },
      {
        key: 'mobile_account',
        header: 'Mobile App',
        width: 160,
        render: (location) => (
          <div>
            {location.mobile_account_enabled ? (
              <div>
                <Badge bg="success" className="d-flex align-items-center gap-1 mb-1" style={{ width: 'fit-content' }}>
                  <IconifyIcon icon="solar:check-circle-bold" width={14} height={14} />
                  Enabled
                </Badge>
                <small className="text-muted d-block">{location.mobile_account_email}</small>
              </div>
            ) : (
              <Badge bg="secondary" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                <IconifyIcon icon="solar:lock-password-linear" width={14} height={14} />
                Not Enabled
              </Badge>
            )}
          </div>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 200,
        align: 'left',
        sticky: 'right',
        defaultSticky: true,
        render: (location) => (
          <div className="d-flex gap-2">
            {!location.mobile_account_enabled ? (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleOpenMobileModal(location)}
                title="Enable mobile app access"
                style={{ borderRadius: '8px' }}
                disabled={!isAdmin}
              >
                <IconifyIcon icon="solar:smartphone-2-bold" width={16} height={16} />
              </Button>
            ) : (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleDisableMobileAccount(location.id)}
                title="Disable mobile app access"
                style={{ borderRadius: '8px' }}
                disabled={!isAdmin}
              >
                <IconifyIcon icon="solar:lock-password-bold" width={16} height={16} />
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenEditModal(location)}
              title="Edit store details"
              style={{ borderRadius: '8px' }}
            >
              <IconifyIcon icon="solar:pen-bold" width={16} height={16} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(location.id)}
              title="Remove store"
              style={{ borderRadius: '8px' }}
              disabled={!isAdmin}
            >
              <IconifyIcon icon="solar:trash-bin-trash-bold" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [startIndex, isAdmin, handleDelete, adminEmailDomain, handleDisableMobileAccount, handleOpenMobileModal]
  )

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
            <IconifyIcon icon="solar:lock-password-linear" width={64} height={64} className="text-muted mb-3" />
            <h4 className="mb-3">Authentication Required</h4>
            <p className="text-muted mb-4">Please sign in to manage store locations.</p>
            <Link href="/auth/sign-in">
              <Button variant="primary" size="lg">Sign In</Button>
            </Link>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="mb-2">Store Locations</h4>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/">AI Assistant</Link>
                </li>
                <div className="mx-1" style={{ height: 24, paddingRight: '8px' }}>
                  <IconifyIcon icon="bx:chevron-right" height={16} width={16} />
                </div>
                <li className="breadcrumb-item active">Locations</li>
              </ol>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={handleOpenImportModal} style={{ borderRadius: '8px' }}>
                <IconifyIcon icon="solar:upload-bold" width={18} height={18} className="me-2" />
                Import from File
              </Button>
              <Button variant="primary" onClick={handleOpenCreateModal} style={{ borderRadius: '8px' }}>
                <IconifyIcon icon="solar:add-circle-bold" width={18} height={18} className="me-2" />
                Add Store
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <DataTable
            id="locations-table"
            title="Your Store Locations"
            description="Manage store locations and mobile app access for store teams"
            columns={columns}
            data={locations}
            rowKey={(location) => location.id}
            loading={loading}
            error={error}
            onRetry={fetchLocations}
            toolbar={{
              search: {
                value: searchQuery,
                placeholder: 'Search by store number or address...',
                onChange: setSearchQuery,
                onClear: () => setSearchQuery('')
              }
            }}
            pagination={{
              currentPage,
              pageSize,
              totalRecords: total,
              totalPages,
              onPageChange: setCurrentPage,
              onPageSizeChange: setPageSize,
              pageSizeOptions: [25, 50, 100],
              startRecord: startIndex + 1,
              endRecord: Math.min(startIndex + pageSize, total)
            }}
            emptyState={{
              title: 'No Store Locations Yet',
              description: debouncedSearch
                ? 'No stores match your search. Try different keywords.'
                : 'Add your first store location to get started.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 2 }}
          />
        </Col>
      </Row>

      {/* Mobile Account Modal */}
      <Modal show={showMobileModal} onHide={handleCloseMobileModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <IconifyIcon icon="solar:smartphone-2-bold" width={24} height={24} />
            Enable Mobile App Access
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {mobileLocation && (
            <>
              <Alert variant="info" className="border-0 mb-3" style={{ background: '#E3F2FD', borderRadius: '8px' }}>
                <div className="d-flex align-items-start gap-2">
                  <IconifyIcon icon="solar:info-circle-bold" width={20} height={20} style={{ color: '#1976D2', marginTop: 2 }} />
                  <div style={{ color: '#0D47A1', fontSize: '0.9rem' }}>
                    <strong>What happens next:</strong>
                    <ul className="mb-0 mt-2" style={{ paddingLeft: '20px' }}>
                      <li>An invitation will be sent to the store email</li>
                      <li>Store staff can set their password and access the mobile app</li>
                      <li>They can manage complaints, tasks, orders, and view analytics</li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <div className="mb-3 p-3 bg-light rounded">
                <div className="fw-semibold mb-1">Store Details</div>
                <div className="text-muted small">
                  {mobileLocation.store_number && <div>Store #{mobileLocation.store_number}</div>}
                  <div>{mobileLocation.store_location}</div>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Store Email Address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="store@example.com"
                  value={mobileEmail}
                  onChange={(e) => setMobileEmail(e.target.value)}
                  disabled={enablingMobile}
                  style={{ borderRadius: '8px' }}
                />
                <Form.Text className="text-muted">
                  This email will be used for the stores mobile app login
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleCloseMobileModal} disabled={enablingMobile} style={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleEnableMobileAccount} 
            disabled={enablingMobile}
            style={{ borderRadius: '8px' }}
          >
            {enablingMobile ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enabling...
              </>
            ) : (
              <>
                <IconifyIcon icon="solar:check-circle-bold" width={18} height={18} className="me-2" />
                Enable & Send Invitation
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create/Edit Modal (unchanged) */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {editingLocation ? 'Edit Store Location' : 'Add New Store'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitForm}>
          <Modal.Body className="pt-3">
            <Form.Group className="mb-3">
              <Form.Label>Store Number (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 101, Store-A, Main Branch"
                value={formData.store_number}
                onChange={(e) => setFormData({ ...formData, store_number: e.target.value })}
                style={{ borderRadius: '8px' }}
              />
              <Form.Text className="text-muted">
                A unique identifier for this store
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Store Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g., 123 Main Street, Springfield, IL 62701"
                value={formData.store_location}
                onChange={(e) => setFormData({ ...formData, store_location: e.target.value })}
                required
                style={{ borderRadius: '8px' }}
              />
              <Form.Text className="text-muted">
                The full street address or location description
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="secondary" onClick={handleCloseModal} disabled={formSubmitting} style={{ borderRadius: '8px' }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formSubmitting} style={{ borderRadius: '8px' }}>
              {formSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <IconifyIcon 
                    icon={editingLocation ? 'solar:check-circle-bold' : 'solar:add-circle-bold'} 
                    width={18} 
                    height={18} 
                    className="me-2" 
                  />
                  {editingLocation ? 'Update Store' : 'Add Store'}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal show={showImportModal} onHide={handleCloseImportModal} size="xl" centered scrollable>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Import Store Locations</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {parsedLocations.length === 0 ? (
            <>
              <Alert variant="info" className="border-0" style={{ background: '#E3F2FD', borderRadius: '8px' }}>
                <Alert.Heading className="d-flex align-items-center">
                  <IconifyIcon icon="solar:info-circle-bold" width={24} height={24} className="me-2" style={{ color: '#1976D2' }} />
                  <span style={{ color: '#1565C0' }}>How This Works</span>
                </Alert.Heading>
                <ul className="mb-0" style={{ color: '#0D47A1' }}>
                  <li>Upload a file containing your store locations (PDF, Excel, Word, or text file)</li>
                  <li>Or simply copy and paste a list of stores from anywhere</li>
                  <li><strong>Our AI will automatically find:</strong> Store numbers and addresses</li>
                  <li>You will get a chance to review and edit everything before saving</li>
                  <li><strong>File size limit:</strong> 5MB (around 50 pages for PDFs)</li>
                </ul>
              </Alert>
              
              {/* Tab selection */}
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link 
                    active={importMode === 'file'} 
                    onClick={() => setImportMode('file')}
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '8px 8px 0 0',
                      fontWeight: importMode === 'file' ? 600 : 400
                    }}
                  >
                    <IconifyIcon icon="solar:document-add-bold" width={18} height={18} className="me-2" />
                    Upload a File
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={importMode === 'text'} 
                    onClick={() => setImportMode('text')}
                    style={{ 
                      cursor: 'pointer',
                      borderRadius: '8px 8px 0 0',
                      fontWeight: importMode === 'text' ? 600 : 400
                    }}
                  >
                    <IconifyIcon icon="solar:clipboard-text-bold" width={18} height={18} className="me-2" />
                    Copy & Paste
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              {importMode === 'file' ? (
                <Form.Group>
                  <Form.Label className="fw-semibold">Choose Your File</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.csv,.docx,.txt,.xlsx"
                    onChange={handleFileSelect}
                    disabled={parsing}
                    style={{ borderRadius: '8px' }}
                  />
                  <Form.Text className="text-muted">
                    Accepted formats: PDF, Excel (.xlsx, .csv), Word (.docx), or Text (.txt)
                  </Form.Text>
                  
                  {selectedFile && (
                    <Card className="mt-3 border-0 shadow-sm">
                      <Card.Body className="d-flex align-items-center gap-3">
                        <div
                          className="rounded d-flex align-items-center justify-content-center"
                          style={{
                            width: 48,
                            height: 48,
                            background: '#E8F5E9',
                            color: '#2E7D32'
                          }}
                        >
                          <IconifyIcon 
                            icon={
                              selectedFile.type === 'application/pdf' ? 'solar:document-bold' :
                              selectedFile.type.includes('spreadsheet') || selectedFile.type === 'text/csv' ? 'solar:chart-square-bold' :
                              selectedFile.type.includes('word') ? 'solar:document-text-bold' :
                              'solar:file-bold'
                            } 
                            width={28} 
                            height={28} 
                          />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold" style={{ fontSize: '0.95rem' }}>{selectedFile.name}</div>
                          <small className="text-muted">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </small>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0"
                          onClick={() => setSelectedFile(null)}
                          title="Remove file"
                        >
                          <IconifyIcon icon="solar:close-circle-bold" width={24} height={24} />
                        </Button>
                      </Card.Body>
                    </Card>
                  )}
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label className="fw-semibold">Paste Your Store List</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    placeholder={`Paste your store locations here - any format works!

Examples that work great:

Store #101 - Downtown Branch
123 Main Street, Springfield, IL 62701

Store #102 - West Side Location  
456 Oak Avenue, Chicago, IL 60601

Or even simple lists like:
101, Springfield Downtown, 123 Main St
102, Chicago West, 456 Oak Ave

The AI will figure it out automatically!`}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    disabled={parsing}
                    style={{ 
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}
                  />
                  <Form.Text className="text-muted">
                    Do not worry about formatting - our AI will extract the store information automatically
                  </Form.Text>
                  {pastedText && (
                    <div className="mt-2">
                      <Badge bg="secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                        <IconifyIcon icon="solar:text-bold" width={14} height={14} className="me-1" />
                        {pastedText.split('\n').filter(line => line.trim()).length} lines of text
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              )}
              
              {parseError && (
                <Alert variant="danger" className="mt-3 border-0" style={{ borderRadius: '8px' }}>
                  <div className="d-flex align-items-start gap-2">
                    <IconifyIcon icon="solar:danger-circle-bold" width={24} height={24} style={{ marginTop: 2 }} />
                    <div>
                      <strong>Could not Find Locations</strong>
                      <div className="mt-1">{parseError}</div>
                      <div className="mt-2 small">
                        <strong>Tips:</strong>
                        <ul className="mb-0 mt-1">
                          <li>Make sure your file contains store numbers or addresses</li>
                          <li>Try a different file format (PDF works best)</li>
                          <li>If copy-pasting, ensure each store is on a new line</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Alert>
              )}
            </>
          ) : (
            <>
              <Alert variant="success" className="border-0" style={{ background: '#E8F5E9', borderRadius: '8px' }}>
                <Alert.Heading className="d-flex align-items-center">
                  <IconifyIcon icon="solar:check-circle-bold" width={24} height={24} className="me-2" style={{ color: '#2E7D32' }} />
                  <span style={{ color: '#1B5E20' }}>Found {parsedLocations.length} Store Locations!</span>
                </Alert.Heading>
                <p className="mb-0" style={{ color: '#2E7D32' }}>
                  Review the stores below. You can edit any details or uncheck stores you do not want to import.
                </p>
              </Alert>
              
              <div className="mb-3 d-flex justify-content-between align-items-center p-3 bg-light rounded" style={{ borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: '#1976D2' }}>{selectedLocations.size}</strong>
                  <span className="text-muted"> of {parsedLocations.length} stores selected</span>
                </div>
                <Button variant="outline-primary" size="sm" onClick={handleToggleAll} style={{ borderRadius: '8px' }}>
                  <IconifyIcon 
                    icon={selectedLocations.size === parsedLocations.length ? 'solar:close-square-bold' : 'solar:check-square-bold'} 
                    width={16} 
                    height={16} 
                    className="me-2" 
                  />
                  {selectedLocations.size === parsedLocations.length ? 'Uncheck All' : 'Check All'}
                </Button>
              </div>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <Table striped hover size="sm" className="mb-0">
                  <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <tr>
                      <th style={{ width: '150px' }}>Store #</th>
                      <th>Store Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedLocations.map((location, idx) => (
                      <tr key={idx} className={selectedLocations.has(idx) ? '' : 'table-secondary'}>
                        <td className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={selectedLocations.has(idx)}
                            onChange={() => handleToggleLocation(idx)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={location.store_number || ''}
                            onChange={(e) => handleEditParsedLocation(idx, 'store_number', e.target.value)}
                            placeholder="Optional"
                            disabled={!selectedLocations.has(idx)}
                            style={{ borderRadius: '6px' }}
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            as="textarea"
                            rows={2}
                            value={location.store_location}
                            onChange={(e) => handleEditParsedLocation(idx, 'store_location', e.target.value)}
                            disabled={!selectedLocations.has(idx)}
                            style={{ borderRadius: '6px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleCloseImportModal} disabled={parsing || bulkSaving} style={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          
          {parsedLocations.length === 0 ? (
            <Button
              variant="primary"
              onClick={handleParse}
              disabled={
                parsing || 
                (importMode === 'file' && !selectedFile) ||
                (importMode === 'text' && !pastedText?.trim())
              }
              style={{ borderRadius: '8px' }}
            >
              {parsing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Reading file...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:magic-stick-3-bold" width={18} height={18} className="me-2" />
                  Find Stores
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSaveLocations}
              disabled={selectedLocations.size === 0 || bulkSaving}
              style={{ borderRadius: '8px' }}
            >
              {bulkSaving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving stores...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:download-minimalistic-bold" width={18} height={18} className="me-2" />
                  Save {selectedLocations.size} {selectedLocations.size === 1 ? 'Store' : 'Stores'}
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  )
}

export default LocationsPage

export const dynamic = 'force-dynamic'