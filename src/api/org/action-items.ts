// src/api/org/action-items.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type ActionItemType = 'appointment' | 'order' | 'incident' | 'follow_up' | 'task'
export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed'
export type ActionItemUrgency = 'low' | 'medium' | 'high' | 'critical'

export interface ActionItem {
  id: string
  org_id: string
  call_id?: string | null
  type: ActionItemType
  title: string
  description?: string | null
  urgency: ActionItemUrgency
  status: ActionItemStatus
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  due_at?: string | null
  created_at: string
  updated_at: string
}

export interface ActionItemsListParams {
  skip?: number
  limit?: number
  status_filter?: ActionItemStatus
  urgency_filter?: ActionItemUrgency
  type_filter?: ActionItemType
  assigned_to_me?: boolean
  sort?: 'newest' | 'oldest' | 'due_date'
}

export interface ActionItemsListResponse {
  action_items: ActionItem[]
  total: number
  skip: number
  limit: number
}

export interface CreateActionItemRequest {
  call_id?: string | null
  type: ActionItemType
  title: string
  description?: string | null
  urgency?: ActionItemUrgency
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  due_at?: string | null
}

export interface UpdateActionItemRequest {
  title?: string
  description?: string
  urgency?: ActionItemUrgency
  status?: ActionItemStatus
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  due_at?: string | null
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const actionItemsApi = {
  async list(params?: ActionItemsListParams): Promise<ActionItemsListResponse> {
    const response = await axios.get(`${API_BASE}/org/action-items`, {
      params,
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getById(id: string): Promise<ActionItem> {
    const response = await axios.get(`${API_BASE}/org/action-items/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async create(data: CreateActionItemRequest): Promise<ActionItem> {
    const response = await axios.post(`${API_BASE}/org/action-items`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async update(id: string, data: UpdateActionItemRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/action-items/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/action-items/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async getStats(): Promise<any> {
    const response = await axios.get(`${API_BASE}/org/action-items/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}
