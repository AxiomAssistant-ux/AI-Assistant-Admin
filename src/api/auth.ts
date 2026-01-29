// /api/auth.ts
// UPDATED VERSION with password reset endpoints

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

export interface VerifyInvitationResponse {
  email: string
  name: string
  organization_name: string
  valid: boolean
}

export interface AcceptInvitationRequest {
  invite_token: string
  new_password: string
  confirm_password: string
}

export interface AcceptInvitationResponse {
  access_token: string
  expires_in: number
  message: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface VerifyResetTokenRequest {
  token: string
}

export interface VerifyResetTokenResponse {
  email: string
  valid: boolean
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
  confirm_password: string
}

export interface ResetPasswordResponse {
  message: string
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
   * Forgot Password - Request Password Reset
   * POST /auth/org/forgot-password
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post('/auth/org/forgot-password', { email })
  },

  /**
   * Verify Reset Token
   * POST /auth/org/verify-reset-token
   */
  async verifyResetToken(token: string): Promise<VerifyResetTokenResponse> {
    return apiClient.post('/auth/org/verify-reset-token', { token })
  },

  /**
   * Reset Password
   * POST /auth/org/reset-password
   */
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<ResetPasswordResponse> {
    return apiClient.post('/auth/org/reset-password', {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword
    })
  },

  /**
   * Verify Invitation Token
   * POST /auth/org/verify-invitation
   */
  async verifyInvitation(inviteToken: string): Promise<VerifyInvitationResponse> {
    return apiClient.post('/auth/org/verify-invitation', { invite_token: inviteToken })
  },

  /**
   * Accept Invitation & Set Password
   * POST /auth/org/accept-invitation
   */
  async acceptInvitation(data: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    return apiClient.post('/auth/org/accept-invitation', data)
  },
}