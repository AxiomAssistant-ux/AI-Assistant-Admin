import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface ComplaintCustomer {
  customer_name?: string
  contact_phone?: string
  contact_email?: string
  mailing_address?: string
  callback_phone_confirmed?: boolean
}

export interface ComplaintStore {
  store_location?: string
  store_number?: string
  store_address?: string
  store_zip_code?: string
  store_phone?: string
  customer_at_store?: boolean
}

export interface ComplaintResolution {
  voucher_type?: string
  voucher_value?: string
  immediate_replacement_offered?: boolean
  replacement_details?: string
}

export interface ComplaintEscalation {
  manager_callback_needed?: boolean
  callback_reasons?: string[]
  callback_timeline?: string
}

export interface Complaint {
  id: string
  org_id: string
  call_log_id: string
  customer: ComplaintCustomer
  store: ComplaintStore
  complaint_type?: string
  complaint_description?: string
  complaint_severity?: ComplaintSeverity
  receipt_status?: string
  delivery_method?: string
  resolution: ComplaintResolution
  escalation: ComplaintEscalation
  status: ComplaintStatus
  assigned_to_user_id?: string
  created_at: string
  updated_at: string
}

export interface ComplaintsListParams {
  skip?: number
  limit?: number
  search?: string
  status_filter?: ComplaintStatus
  severity_filter?: ComplaintSeverity
  location_ids?: string[]
  sort?: 'newest' | 'oldest'
}

export interface ComplaintsListResponse {
  complaints: Complaint[]
  total: number
  skip: number
  limit: number
}

export interface UpdateComplaintRequest {
  status: ComplaintStatus
  assigned_to_user_id?: string
  notes?: string
}

export interface ComplaintStatsResponse {
  total_complaints: number
  by_status: Record<string, number>
  by_severity: Record<string, number>
  org_id: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const complaintsApi = {
  async list(params?: ComplaintsListParams): Promise<ComplaintsListResponse> {
    const response = await axios.get(`${API_BASE}/org/complaints`, {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams()
        
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              searchParams.append(key, item)
            })
          } else if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })
        
        return searchParams.toString()
      },
      headers: getAuthHeaders()
    })
    return response.data
  },
  
  async getById(id: string): Promise<Complaint> {
    const response = await axios.get(`${API_BASE}/org/complaints/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateStatus(id: string, data: UpdateComplaintRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/complaints/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getStats(): Promise<ComplaintStatsResponse> {
    const response = await axios.get(`${API_BASE}/org/complaints/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}