// src/types/auth.ts

import type { VerticalKey } from '@/config/verticals'

export type ActorType = 'platform' | 'org'

export interface SignInRequest {
  email: string
  password: string
}

export interface Organization {
  _id: string
  company_name: string
  logo_url?: string
  role: string
  industry?: string
  status: string
  vertical_key?: VerticalKey // ADDED
}

export interface PlatformUser {
  actor: 'platform'
  id: string
  _id: string
  email: string
  name: string
  role: 'super_admin' | 'support'
}

export interface OrgUser {
  actor: 'org'
  id: string
  _id: string
  email: string
  name: string
  org_id: string
  is_admin: boolean
  role_name: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  features: string[]
  organization?: Organization
}

export type UserOut = PlatformUser | OrgUser

export interface OrgUserResponse {
  org_user: {
    _id: string
    email: string
    name: string
    org_id: string
    is_admin: boolean
    role_name: string
    role: string
    status: string
    features: string[]
  }
  organization: Organization
}

export const isPlatformUser = (user?: UserOut | null): user is PlatformUser => {
  return user?.actor === 'platform'
}

export const isOrgUser = (user?: UserOut | null): user is OrgUser => {
  return user?.actor === 'org'
}