// src/api/org/users.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type UserStatus = 'active' | 'invited' | 'suspended'

export interface OrgUser {
  id: string
  org_id: string
  email: string
  name: string
  name_norm: string
  status: UserStatus
  is_admin: boolean
  role_name: string
  features: string[]
  created_at: string
  updated_at: string
}

export interface OrgUsersListParams {
  skip?: number
  limit?: number
  search?: string
  status_filter?: string
  role_filter?: string
  admin_filter?: string
  sort?: 'newest' | 'oldest' | 'name'
}

export interface OrgUsersListResponse {
  users: OrgUser[]
  total: number
  skip: number
  limit: number
}

export interface CreateOrgUserRequest {
  email: string
  name: string
  role_name: string
  is_admin?: boolean
  features: string[]
}

export interface UpdateOrgUserRequest {
  name?: string
  role_name?: string
  is_admin?: boolean
  features?: string[]
}

export interface UpdateUserStatusRequest {
  status: UserStatus
}

export interface UserStatsResponse {
  total_users: number
  admin_users: number
  by_status: Record<string, number>
  by_role: Record<string, number>
  org_id: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const orgUsersApi = {
  async list(params?: OrgUsersListParams): Promise<OrgUsersListResponse> {
    const response = await axios.get(`${API_BASE}/org/users`, {
      params,
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getById(id: string): Promise<OrgUser> {
    const response = await axios.get(`${API_BASE}/org/users/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async create(data: CreateOrgUserRequest): Promise<OrgUser> {
    const response = await axios.post(`${API_BASE}/org/users`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async update(id: string, data: UpdateOrgUserRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/users/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateStatus(id: string, status: UserStatus): Promise<{ message: string }> {
    const response = await axios.patch(
      `${API_BASE}/org/users/${id}/status`,
      { status },
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async toggleAdmin(id: string): Promise<{ message: string; is_admin: boolean }> {
    const response = await axios.patch(
      `${API_BASE}/org/users/${id}/toggle-admin`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async resendInvite(id: string): Promise<{ message: string }> {
    const response = await axios.post(
      `${API_BASE}/org/users/${id}/resend-invite`,
      {},
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/users/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async getStats(): Promise<UserStatsResponse> {
    const response = await axios.get(`${API_BASE}/org/users/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}