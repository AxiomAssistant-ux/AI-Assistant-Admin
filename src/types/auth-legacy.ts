// ===============================
// Actor Types
// ===============================
export type ActorType = 'org' | 'platform'

// ===============================
// User types matching backend API
// ===============================
export type UserOut = {
  id: string
  username: string
  email: string
  role: 'admin' | 'user'          // org-level role
  agent_id: string | null
  created_at: string
  blocked: boolean

  // 🔴 Frontend-augmented fields (SAFE)
  actor?: ActorType               // 'org' | 'platform'
  org_id?: string                 // optional (future-safe)
}

export type TokenOut = {
  access_token: string
  token_type?: string
  expires_in: number
  user: UserOut
}

export type AdminUserListResponse = {
  items: UserOut[]
  total: number
  skip: number
  limit: number
}

// ===============================
// Auth request types
// ===============================
export type SignUpRequest = {
  username: string
  email: string
  password: string
  confirm_password: string
}

export type SignupOTPRequestOut = {
  email: string
  expires_in: number
  detail?: string
}

export type SignInRequest = {
  email: string
  password: string
}

// Legacy type (unchanged)
export type UserType = {
  id: string
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  token: string
}
