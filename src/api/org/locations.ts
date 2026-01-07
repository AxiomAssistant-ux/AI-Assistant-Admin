// src/api/org/locations.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface Location {
  id: string
  org_id: string
  store_number?: string
  store_location: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

export interface ParsedLocation {
  store_number?: string
  store_location: string
  confidence?: number
}

export interface LocationsListParams {
  skip?: number
  limit?: number
  search?: string
}

export interface LocationsListResponse {
  locations: Location[]
  total: number
  skip: number
  limit: number
}

export interface CreateLocationRequest {
  store_number?: string
  store_location: string
}

export interface UpdateLocationRequest {
  store_number?: string
  store_location?: string
}

export interface PDFParseResult {
  locations: ParsedLocation[]
  total_extracted: number
  parse_status: 'success' | 'partial' | 'failed'
  error_message?: string
}

export interface BulkCreateRequest {
  locations: Array<{ store_number?: string; store_location: string }>
}

export interface BulkCreateResponse {
  success_count: number
  total_attempted: number
  errors: string[]
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const locationsApi = {
  async list(params?: LocationsListParams): Promise<LocationsListResponse> {
    const response = await axios.get(`${API_BASE}/org/locations`, {
      params,
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getById(id: string): Promise<Location> {
    const response = await axios.get(`${API_BASE}/org/locations/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async create(data: CreateLocationRequest): Promise<Location> {
    const response = await axios.post(`${API_BASE}/org/locations`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async update(id: string, data: UpdateLocationRequest): Promise<Location> {
    const response = await axios.patch(`${API_BASE}/org/locations/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/locations/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async parsePdf(file: File): Promise<PDFParseResult> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axios.post(`${API_BASE}/org/locations/parse-pdf`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async bulkCreate(data: BulkCreateRequest): Promise<BulkCreateResponse> {
    const response = await axios.post(`${API_BASE}/org/locations/bulk-create`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getCounts(): Promise<Record<string, number>> {
    const response = await axios.get(`${API_BASE}/org/locations/counts`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async parseFile(file: File): Promise<PDFParseResult> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axios.post(`${API_BASE}/org/locations/parse`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  
  async parseText(text: string): Promise<PDFParseResult> {
    const formData = new FormData()
    formData.append('text', text)
    
    const response = await axios.post(`${API_BASE}/org/locations/parse`, formData, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}