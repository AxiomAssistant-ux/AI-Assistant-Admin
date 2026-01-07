// src/api/org/support.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type TicketType = 'bug' | 'billing' | 'feature_request' | 'technical' | 'other'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed'

export interface Attachment {
  file_url: string
  file_name: string
}

export interface InternalNote {
  note: string
  added_by_user_id: string
  created_at: string
}

export interface SupportTicket {
  id: string
  org_id?: string | null
  created_by_user_id: string
  type: TicketType
  priority: TicketPriority
  subject: string
  description: string
  status: TicketStatus
  attachments?: Attachment[]
  internal_notes?: InternalNote[]
  created_at: string
  updated_at: string
  closed_at?: string | null
}

export interface SupportTicketsListParams {
  skip?: number
  limit?: number
  status_filter?: TicketStatus
  type_filter?: TicketType
  priority_filter?: TicketPriority
  sort?: 'newest' | 'oldest' | 'priority'
}

export interface SupportTicketsListResponse {
  tickets: SupportTicket[]
  total: number
  skip: number
  limit: number
}

export interface CreateSupportTicketRequest {
  type: TicketType
  priority?: TicketPriority
  subject: string
  description: string
  attachments?: Attachment[]
}

export interface UpdateSupportTicketRequest {
  type?: TicketType
  priority?: TicketPriority
  subject?: string
  description?: string
  status?: TicketStatus
  attachments?: Attachment[]
}

export interface AddInternalNoteRequest {
  note: string
}

export interface SupportTicketStatsResponse {
  total_tickets: number
  open_tickets: number
  by_status: Record<string, number>
  by_type: Record<string, number>
  by_priority: Record<string, number>
  org_id: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const supportApi = {
  async list(params?: SupportTicketsListParams): Promise<SupportTicketsListResponse> {
    const response = await axios.get(`${API_BASE}/org/support/tickets`, {
      params,
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getById(id: string): Promise<SupportTicket> {
    const response = await axios.get(`${API_BASE}/org/support/tickets/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async create(data: CreateSupportTicketRequest): Promise<SupportTicket> {
    const response = await axios.post(`${API_BASE}/org/support/tickets`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async update(id: string, data: UpdateSupportTicketRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/support/tickets/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async addInternalNote(id: string, data: AddInternalNoteRequest): Promise<{ message: string }> {
    const response = await axios.post(`${API_BASE}/org/support/tickets/${id}/notes`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/support/tickets/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async getStats(): Promise<SupportTicketStatsResponse> {
    const response = await axios.get(`${API_BASE}/org/support/tickets/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}
