// src/api/org/profile.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface OrgUserProfile {
  id: string
  email: string
  name: string
  role_name?: string
  is_admin: boolean
  status: string
  created_at: string
}

export interface OrganizationProfile {
  id: string
  company_name: string
  logo_url?: string
  industry?: string
  status: string
}

export interface ProfileResponse {
  user: OrgUserProfile
  organization: OrganizationProfile
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  current_password?: string
  new_password?: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const profileApi = {
  async getMyProfile(): Promise<ProfileResponse> {
    const response = await axios.get(`${API_BASE}/org/profile/me`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateMyProfile(data: UpdateProfileRequest): Promise<{ 
    message: string
    user: OrgUserProfile 
  }> {
    const response = await axios.patch(`${API_BASE}/org/profile/me`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await axios.post(`${API_BASE}/org/profile/change-password`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}