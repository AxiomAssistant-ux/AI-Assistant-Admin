// src/api/org/organizations.ts

import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface Organization {
  id: string
  company_name: string
  logo_url?: string
  color_scheme: string[]
  industry: string
  vertical_key: string
  agent_id: Array<{ provider: string; agent_id: string }>
  knowledge_base_ids: string[]
  status: string
  primary_org_user_id: string
  plan_id?: string
  subscription_status?: string
  created_at: string
  updated_at: string
}

export interface CompleteOnboardingRequest {
  company_name: string
  industry: string
  logo_url?: string
  color_scheme: string[]
  vertical_key: string
}

export interface CompleteOnboardingResponse {
  access_token: any
  expires_in: number
  message: string
  organization: Organization
}

export interface UpdateOrganizationRequest {
  company_name?: string
  industry?: string
  logo_url?: string
  color_scheme?: string[]
  vertical_key?: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const organizationsApi = {
  /**
   * Complete onboarding by creating organization
   * POST /org/organizations/complete-onboarding
   */
  async completeOnboarding(data: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
    const response = await axios.post(
      `${API_BASE}/org/organizations/complete-onboarding`,
      data,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  /**
   * Get current organization
   * GET /org/organizations/current
   */
  async getCurrentOrganization(): Promise<Organization> {
    const response = await axios.get(
      `${API_BASE}/org/organizations/current`,
      { headers: getAuthHeaders() }
    )
    return response.data
  },

  /**
   * Update current organization
   * PATCH /org/organizations/current
   */
  async updateCurrentOrganization(data: UpdateOrganizationRequest): Promise<{ message: string }> {
    const response = await axios.patch(
      `${API_BASE}/org/organizations/current`,
      data,
      { headers: getAuthHeaders() }
    )
    return response.data
  },
}