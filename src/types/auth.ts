/**
 * Authentication Types
 * Matches backend response structures exactly
 */

// ===============================
// Common Types
// ===============================

export type ActorType = 'org' | 'platform'

// ===============================
// Request Types
// ===============================

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  name?: string
  username?: string
}

// ===============================
// Response Types
// ===============================

export interface SignInResponse {
  access_token: string
  expires_in: number
}

// ===============================
// Org User Types
// ===============================

export interface OrgUserData {
  _id: string
  email: string
  name: string
  org_id: string
  status: 'active' | 'invited' | 'suspended'
  is_admin: boolean
  role_name?: string
  role: string
  features: string[]
  created_at: string
  updated_at: string
}

export interface OrganizationData {
  _id: string
  company_name: string
  logo_url?: string
  color_scheme?: string[]
  industry?: string
  vertical_key?: string
  status: 'active' | 'trial' | 'suspended'
}

export interface OrgUserResponse {
  org_user: OrgUserData
  organization: OrganizationData
}

// ===============================
// Platform User Types (for future)
// ===============================

export interface PlatformUserData {
  _id: string
  email: string
  name: string
  status: 'active' | 'suspended'
  created_at: string
  updated_at: string
}

export interface PlatformUserResponse {
  platform_user: PlatformUserData
}

// ===============================
// Unified User Type for Context
// ===============================

export type UserOut = 
  | {
      actor: 'org'
      id: string
      _id: string
      email: string
      name: string
      org_id: string
      is_admin: boolean
      role_name?: string
      role: string
      status: string
      features: string[]
      organization: OrganizationData
    }
  | {
      actor: 'platform'
      id: string
      _id: string
      email: string
      name: string
      role: string
      status: string
    }

// ===============================
// Auth Context State
// ===============================

export interface AuthState {
  user: UserOut | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

// ===============================
// Helper type guards
// ===============================

export function isOrgUser(user: UserOut | null): user is Extract<UserOut, { actor: 'org' }> {
  return user?.actor === 'org'
}

export function isPlatformUser(user: UserOut | null): user is Extract<UserOut, { actor: 'platform' }> {
  return user?.actor === 'platform'
}