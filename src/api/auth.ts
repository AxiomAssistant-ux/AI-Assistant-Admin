// assistant-app/api/auth.ts

/**
 * Authentication API
 * Handles all authentication-related endpoints
 */

import { apiClient } from './client'


export interface TokenExchangeResponse {
  access_token: string
  expires_in: number
  user_status: string
}

/**
 * Auth request/response types
 */
export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  access_token: string
  expires_in: number
}

export interface OrgUserResponse {
  org_user: {
    _id: string
    email: string
    name: string
    org_id: string
    status: string
    is_admin: boolean
    role_name?: string
    role: string
    features: string[]
    created_at: string
    updated_at: string
  }
  organization: {
    _id: string
    company_name: string
    logo_url?: string
    role: string
    industry?: string
    status: string
  }
}

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Org User Sign In
   * POST /auth/org/signin
   */
  async orgSignIn(data: SignInRequest): Promise<SignInResponse> {
    return apiClient.post('/auth/org/signin', data)
  },

  /**
   * Get Current Org User
   * GET /auth/org/me
   */
  async getCurrentOrgUser(): Promise<OrgUserResponse> {
    return apiClient.get('/auth/org/me')
  },

  /**
  * Exchange Redirect Token
  * POST /auth/org/token/exchange
  */
  async exchangeRedirectToken(redirectToken: string): Promise<TokenExchangeResponse> {
    return apiClient.post('/auth/org/token/exchange', { redirect_token: redirectToken })
  },

  /**
   * Platform Admin Sign In
   * POST /auth/admin/signin
   */
  async platformSignIn(data: SignInRequest): Promise<SignInResponse> {
    return apiClient.post('/auth/admin/signin', data)
  },

  /**
   * Get Current Platform User
   * GET /auth/admin/me
   */
  async getCurrentPlatformUser(): Promise<any> {
    return apiClient.get('/auth/admin/me')
  },

  /**
   * Forgot Password
   * POST /auth/password/forgot-password
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/password/forgot-password', { email })
  },

  /**
   * Verify Reset Token
   * POST /auth/password/verify-reset-token
   */
  async verifyResetToken(token: string): Promise<{ email: string }> {
    return apiClient.post('/auth/password/verify-reset-token', { token })
  },

  /**
   * Reset Password
   * POST /auth/password/reset-password
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post('/auth/password/reset-password', {
      token,
      new_password: newPassword,
    })
  },
}