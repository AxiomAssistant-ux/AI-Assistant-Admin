// src/app/(dashboard)/locations/page.tsx
'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Row, Col, Button, Badge, Modal, Form, Alert, Table, Spinner, Nav } from 'react-bootstrap'
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
  const { token, isAuthenticated } = useAuth()
  
  // Location management state
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  
  // Search and pagination
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
  const [parseStatus, setParseStatus] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [selectedLocations, setSelectedLocations] = useState<Set<number>>(new Set())
  const [bulkSaving, setBulkSaving] = useState(false)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setCurrentPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch locations
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
      toast.error('Location is required')
      return
    }
    
    setFormSubmitting(true)
    
    try {
      if (editingLocation) {
        await locationsApi.update(editingLocation.id, formData)
        toast.success('Location updated successfully')
      } else {
        await locationsApi.create(formData)
        toast.success('Location created successfully')
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
    if (!confirm('Are you sure you want to delete this location?')) return
    
    try {
      await locationsApi.delete(locationId)
      toast.success('Location deleted successfully')
      fetchLocations()
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to delete location'
      toast.error(errorMsg)
    }
  },[])

  // Import handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File must be less than 5MB')
        return
      }
      
      // Validate file type
      const validTypes = [
        'application/pdf',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      
      if (!validTypes.includes(file.type)) {
        toast.error('Unsupported file type. Please upload PDF, CSV, DOCX, or TXT file.')
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
        toast.error('Please provide file or text to parse')
        setParsing(false)
        return
      }
      
      if (result.parse_status === 'success' && result.locations.length > 0) {
        setParsedLocations(result.locations)
        // Select all by default
        setSelectedLocations(new Set(result.locations.map((_, idx) => idx)))
        setParseStatus('success')
        toast.success(`Successfully extracted ${result.total_extracted} locations`)
      } else {
        setParseError(result.error_message || 'No locations found')
        setParseStatus('failed')
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || 'Failed to parse'
      setParseError(errorMsg)
      setParseStatus('failed')
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
        toast.warning(`Saved ${result.success_count} locations with ${result.errors.length} errors`)
      } else {
        toast.success(`Successfully saved ${result.success_count} locations`)
      }
      
      // Close modal and refresh
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
    setParseStatus(null)
  }

  const handleOpenImportModal = () => {
    setShowImportModal(true)
    setImportMode('file')
    setSelectedFile(null)
    setPastedText('')
    setParsedLocations([])
    setSelectedLocations(new Set())
    setParseError(null)
    setParseStatus(null)
  }

  // Table columns
  const columns: DataTableColumn<Location>[] = useMemo(
    () => [
      {
        key: 'rowNumber',
        header: '#',
        width: 60,
        align: 'center',
        render: (_, { rowIndex }) => (
          <span className="text-muted">{startIndex + rowIndex + 1}</span>
        )
      },
      {
        key: 'store_number',
        header: 'Store Number',
        minWidth: 120,
        render: (location) => (
          location.store_number ? (
            <Badge bg="primary">{location.store_number}</Badge>
          ) : (
            <span className="text-muted fst-italic">—</span>
          )
        )
      },
      {
        key: 'store_location',
        header: 'Location',
        minWidth: 300,
        render: (location) => (
          <div className="text-truncate" style={{ maxWidth: '400px' }} title={location.store_location}>
            {location.store_location}
          </div>
        )
      },
      {
        key: 'created_at',
        header: 'Created',
        minWidth: 150,
        render: (location) => (
          <small className="text-muted">
            {new Date(location.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </small>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        width: 150,
        align: 'center',
        sticky: 'right',
        defaultSticky: true,
        render: (location) => (
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleOpenEditModal(location)}
              title="Edit location"
            >
              <IconifyIcon icon="solar:pen-linear" width={16} height={16} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDelete(location.id)}
              title="Delete location"
            >
              <IconifyIcon icon="solar:trash-bin-trash-linear" width={16} height={16} />
            </Button>
          </div>
        )
      }
    ],
    [startIndex, handleDelete]
  )

  if (!isAuthenticated) {
    return (
      <Row>
        <Col xs={12}>
          <div className="text-center py-5">
            <p>Please sign in to manage locations.</p>
            <Link href="/auth/sign-in">
              <Button variant="primary">Sign In</Button>
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
              <Button variant="outline-primary" onClick={handleOpenImportModal}>
                <IconifyIcon icon="solar:upload-linear" width={18} height={18} className="me-2" />
                Import Locations
              </Button>
              <Button variant="primary" onClick={handleOpenCreateModal}>
                <IconifyIcon icon="solar:add-circle-linear" width={18} height={18} className="me-2" />
                Add Location
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <DataTable
            id="locations-table"
            title="Store Locations"
            description="Manage your organization's store locations for call filtering"
            columns={columns}
            data={locations}
            rowKey={(location) => location.id}
            loading={loading}
            error={error}
            onRetry={fetchLocations}
            toolbar={{
              search: {
                value: searchQuery,
                placeholder: 'Search by store number or location...',
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
              title: 'No Locations Found',
              description: debouncedSearch
                ? 'Try adjusting your search criteria.'
                : 'Add your first location to get started.'
            }}
            columnPanel={{ enableColumnVisibility: true, enableSticky: true, maxSticky: 3 }}
          />
        </Col>
      </Row>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingLocation ? 'Edit Location' : 'Add Location'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitForm}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Store Number (Optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 123, STORE-456"
                value={formData.store_number}
                onChange={(e) => setFormData({ ...formData, store_number: e.target.value })}
              />
              <Form.Text className="text-muted">
                Unique identifier for this store location
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Store Location <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g., 123 Main St, Springfield, IL 62701"
                value={formData.store_location}
                onChange={(e) => setFormData({ ...formData, store_location: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                Full address or location description
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={formSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                editingLocation ? 'Update Location' : 'Create Location'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal show={showImportModal} onHide={handleCloseImportModal} size="xl" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Import Locations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {parsedLocations.length === 0 ? (
            <>
              <Alert variant="info">
                <Alert.Heading className="d-flex align-items-center">
                  <IconifyIcon icon="solar:info-circle-linear" width={20} height={20} className="me-2" />
                  Import Instructions
                </Alert.Heading>
                <ul className="mb-0">
                  <li>Upload a file or paste text containing store locations</li>
                  <li><strong>Supported formats:</strong> PDF, CSV, DOCX, TXT</li>
                  <li><strong>Maximum file size:</strong> 5MB (50 pages for PDF)</li>
                  <li>AI will extract store numbers and addresses automatically</li>
                  <li>You will review and edit before saving</li>
                  <li>Duplicate store numbers will be rejected</li>
                </ul>
              </Alert>
              
              {/* Tab selection */}
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link 
                    active={importMode === 'file'} 
                    onClick={() => setImportMode('file')}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconifyIcon icon="solar:document-linear" width={16} height={16} className="me-2" />
                    Upload File
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={importMode === 'text'} 
                    onClick={() => setImportMode('text')}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconifyIcon icon="solar:text-linear" width={16} height={16} className="me-2" />
                    Paste Text
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              {importMode === 'file' ? (
                <Form.Group>
                  <Form.Label>Select File (PDF, CSV, DOCX, TXT)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.csv,.docx,.txt"
                    onChange={handleFileSelect}
                    disabled={parsing}
                  />
                  {selectedFile && (
                    <div className="mt-3 p-3 bg-light rounded d-flex align-items-center gap-2">
                      <IconifyIcon 
                        icon={
                          selectedFile.type === 'application/pdf' ? 'solar:document-linear' :
                          selectedFile.type === 'text/csv' ? 'solar:file-text-linear' :
                          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'solar:file-text-linear' :
                          'solar:document-linear'
                        } 
                        width={24} 
                        height={24} 
                      />
                      <div className="flex-grow-1">
                        <strong>{selectedFile.name}</strong>
                        <div className="small text-muted">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => setSelectedFile(null)}
                        title="Remove file"
                      >
                        <IconifyIcon icon="solar:close-circle-linear" width={20} height={20} />
                      </Button>
                    </div>
                  )}
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>Paste Location Data</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    placeholder={`Paste your location data here...

Example formats:
- Store #123 - Springfield, 123 Main St, IL 62701
- Store #456 - Chicago, 456 Oak Ave, IL 60601

- 123, Springfield Main Branch, 123 Main St
- 456, Chicago Oak, 456 Oak Ave

CSV format also works:
store_number,store_location
123,"Springfield, 123 Main St"
456,"Chicago, 456 Oak Ave"`}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    disabled={parsing}
                  />
                  <Form.Text className="text-muted">
                    Paste location data in any format - the AI will parse it automatically
                  </Form.Text>
                  {pastedText && (
                    <div className="mt-2">
                      <Badge bg="secondary">
                        {pastedText.split('\n').filter(line => line.trim()).length} lines
                      </Badge>
                    </div>
                  )}
                </Form.Group>
              )}
              
              {parseError && (
                <Alert variant="danger" className="mt-3">
                  <IconifyIcon icon="solar:danger-circle-linear" width={20} height={20} className="me-2" />
                  {parseError}
                </Alert>
              )}
            </>
          ) : (
            <>
              <Alert variant="success">
                <Alert.Heading className="d-flex align-items-center">
                  <IconifyIcon icon="solar:check-circle-linear" width={20} height={20} className="me-2" />
                  Extracted {parsedLocations.length} Locations
                </Alert.Heading>
                <p className="mb-0">
                  Review the extracted data below. You can edit entries or deselect items before saving.
                </p>
              </Alert>
              
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <strong>{selectedLocations.size}</strong> of {parsedLocations.length} selected
                </div>
                <Button variant="outline-primary" size="sm" onClick={handleToggleAll}>
                  {selectedLocations.size === parsedLocations.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm">
                  <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                    <tr>
                      <th style={{ width: '50px' }}></th>
                      <th style={{ width: '150px' }}>Store Number</th>
                      <th>Location</th>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImportModal} disabled={parsing || bulkSaving}>
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
            >
              {parsing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Parsing...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:magic-stick-3-linear" width={18} height={18} className="me-2" />
                  Parse Locations
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSaveLocations}
              disabled={selectedLocations.size === 0 || bulkSaving}
            >
              {bulkSaving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <IconifyIcon icon="solar:download-minimalistic-linear" width={18} height={18} className="me-2" />
                  Save {selectedLocations.size} Locations
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