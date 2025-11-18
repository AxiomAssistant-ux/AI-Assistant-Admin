import { apiClient } from './api-client'
import type { AdminUserCreatePayload, AdminUserQueryParams, AdminUserUpdatePayload } from '@/types/admin-user'
import type { AdminUserListResponse, UserOut } from '@/types/auth'

const buildQueryString = (params: AdminUserQueryParams = {}) => {
  const query = new URLSearchParams()
  if (params.skip !== undefined) query.append('skip', params.skip.toString())
  if (params.limit !== undefined) query.append('limit', params.limit.toString())
  if (params.search) query.append('search', params.search)
  if (params.status) query.append('status', params.status)
  if (params.role) query.append('role', params.role)
  if (params.sort_by) query.append('sort_by', params.sort_by)
  if (params.sort_dir) query.append('sort_dir', params.sort_dir)
  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

export const adminUserApi = {
  async listUsers(token: string, params: AdminUserQueryParams = {}) {
    const endpoint = `/auth/admin/users${buildQueryString(params)}`
    return apiClient.get<AdminUserListResponse>(endpoint, token)
  },

  async createUser(token: string, payload: AdminUserCreatePayload) {
    return apiClient.post<UserOut>('/auth/admin/users', payload, token)
  },

  async updateUser(token: string, userId: string, payload: AdminUserUpdatePayload) {
    return apiClient.put<UserOut>(`/auth/admin/users/${userId}`, payload, token)
  },

  async updateStatus(token: string, userId: string, isBlocked: boolean) {
    return apiClient.put<UserOut>(`/auth/admin/users/${userId}`, { blocked: isBlocked }, token)
  },

  async deleteUser(token: string, userId: string) {
    return apiClient.delete<void>(`/auth/admin/users/${userId}`, token)
  },
}

