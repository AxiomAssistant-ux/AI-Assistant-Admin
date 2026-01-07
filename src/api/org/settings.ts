// src/api/org/settings.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface Organization {
  id: string
  company_name: string
  logo_url?: string
  color_scheme?: string[]
  industry?: string
  vertical_key?: string
  agent_id?: string | string[]
  primary_org_user_id?: string
  plan_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface UpdateOrganizationSettingsRequest {
  company_name?: string
  logo_url?: string | null
  color_scheme?: string[]
}

export interface OrganizationBrandingResponse {
  company_name: string
  logo_url?: string
  color_scheme: string[]
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const orgSettingsApi = {
  async getSettings(): Promise<Organization> {
    const response = await axios.get(`${API_BASE}/org/settings`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async updateSettings(data: UpdateOrganizationSettingsRequest): Promise<{ 
    message: string
    organization: Organization 
  }> {
    const response = await axios.patch(`${API_BASE}/org/settings`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getBranding(): Promise<OrganizationBrandingResponse> {
    const response = await axios.get(`${API_BASE}/org/settings/branding`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}