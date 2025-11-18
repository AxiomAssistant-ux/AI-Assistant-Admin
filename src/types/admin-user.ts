export type AdminUserCreatePayload = {
  username: string
  email: string
  password: string
  agent_id?: string | null
}

export type AdminUserUpdatePayload = {
  username?: string
  email?: string
  agent_id?: string | null
  blocked?: boolean
}

export type AdminUserQueryParams = {
  skip?: number
  limit?: number
  search?: string
  status?: 'active' | 'blocked'
  role?: 'user' | 'admin' | 'all'
  sort_by?: 'created_at' | 'username' | 'email'
  sort_dir?: 'asc' | 'desc'
}

