// src/api/org/call-logs.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface Caller {
  name: string
  number: string
  email?: string
  caller_id?: string
}

export interface CallTiming {
  started_at: string
  ended_at: string
}

export interface CallSummaries {
  brief: string
  detailed: string
}

export interface CallLog {
  id: string
  org_id: string
  agent_id: string
  conversation_id: string
  caller: Caller
  recording_link?: string
  call_timing: CallTiming
  call_success: boolean
  summaries: CallSummaries
  store_location?: string  // Added
  store_number?: string    // Added
  questions_asked: string[]
  action_flag: boolean
  view_status: boolean
  notes?: string
  status?: string
  created_at: string
  updated_at: string
}

export interface CallLogsListParams {
  skip?: number
  limit?: number
  search?: string
  status_filter?: string
  location_filter?: string
  store_number_filter?: string
  location_ids?: string[]  // NEW: Support multiple location IDs
  sort?: 'newest' | 'oldest'
}

export interface CallLogsListResponse {
  call_logs: CallLog[]
  total: number
  skip: number
  limit: number
}

export interface UpdateCallLogNotesRequest {
  notes?: string | null
}

export interface UpdateCallLogStatusRequest {
  status: string
}

export interface CallLogStatsResponse {
  total_calls: number
  by_status: Record<string, number>
  org_id: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const callLogsApi = {
  async list(params?: CallLogsListParams): Promise<CallLogsListResponse> {
    const response = await axios.get(`${API_BASE}/org/call-logs`, {
      params,
      paramsSerializer: (params) => {
        // Custom serialization for arrays without brackets
        const searchParams = new URLSearchParams()
        
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // For arrays, add each item with the same key (no brackets)
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
  
  async getById(id: string): Promise<CallLog> {
    const response = await axios.get(`${API_BASE}/org/call-logs/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateNotes(id: string, data: UpdateCallLogNotesRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/call-logs/${id}/notes`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateStatus(id: string, data: UpdateCallLogStatusRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/call-logs/${id}/status`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/call-logs/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async getStats(): Promise<CallLogStatsResponse> {
    const response = await axios.get(`${API_BASE}/org/call-logs/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async markAsRead(id: string): Promise<{ message: string; was_updated: boolean }> {
    const response = await axios.patch(
      `${API_BASE}/org/call-logs/${id}/mark-read`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async getUnreadCount(): Promise<{ unread_count: number }> {
    const response = await axios.get(`${API_BASE}/org/call-logs/stats/unread-count`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}