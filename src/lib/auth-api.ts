/**
 * Authentication API functions
 * Handles all auth-related API calls to the backend
 */

import { apiClient } from './api-client'
// import type { SignInRequest, SignUpRequest, SignupOTPRequestOut, TokenOut, UserOut } from '@/types/auth'
import type { SignInRequest, SignUpRequest, UserOut } from '@/types/auth'


export const authApi = {
  /**
   * User Sign Up - Returns OTP response, not UserOut
   */
  async userSignUp(data: SignUpRequest) {
    // return apiClient.post<SignupOTPRequestOut>('/auth/user/signup', data)
    return apiClient.post<UserOut>('/auth/user/signup', data)
  },

  /**
   * User Sign In
   */
  async userSignIn(data: SignInRequest) {
    // return apiClient.post<TokenOut>('/auth/user/signin', data)
    return apiClient.post<UserOut>('/auth/user/signin', data)
  },

  /**
   * Admin Sign Up
   */
  async adminSignUp(data: SignUpRequest & { agent_id?: string }) {
    return apiClient.post<UserOut>('/auth/admin/signup', data)
  },

  /**
   * Admin Sign In
   */
  async adminSignIn(data: SignInRequest) {
    // return apiClient.post<TokenOut>('/auth/admin/signin', data)
    return apiClient.post<UserOut>('/auth/admin/signin', data)
  },

  /**
   * Get current user profile
   */
  async getUserProfile(token: string) {
    return apiClient.get<UserOut>('/auth/user/user-profile', token)
  },

  /**
   * Change password
   */
  async changePassword(
    token: string,
    data: { current_password: string; new_password: string }
  ) {
    return apiClient.post('/auth/user/change-password', data, token)
  },

  /**
   * Change username
   */
  async changeUsername(
    token: string,
    data: { new_username: string; password: string }
  ) {
    return apiClient.post('/auth/user/change-username', data, token)
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string) {
    return apiClient.post('/auth/password/forgot-password', { email })
  },

  /**
   * Verify reset token
   */
  async verifyResetToken(token: string) {
    return apiClient.post<{ email: string }>('/auth/password/verify-reset-token', {
      token,
    })
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string) {
    return apiClient.post('/auth/password/reset-password', {
      token,
      new_password: newPassword,
    })
  },

  /**
   * Reject reset
   */
  async rejectReset(token: string) {
    return apiClient.post('/auth/password/reject-reset', { token })
  },
}

