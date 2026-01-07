// src/api/org/appointments.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  org_id: string
  call_id?: string | null
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  scheduled_at: string
  status: AppointmentStatus
  created_at: string
  updated_at: string
}

export interface AppointmentsListParams {
  skip?: number
  limit?: number
  status_filter?: AppointmentStatus
  sort?: 'upcoming' | 'past' | 'newest' | 'oldest'
}

export interface AppointmentsListResponse {
  appointments: Appointment[]
  total: number
  skip: number
  limit: number
}

export interface CreateAppointmentRequest {
  call_id?: string | null
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  scheduled_at: string
}

export interface UpdateAppointmentRequest {
  customer_name?: string
  customer_phone?: string
  customer_email?: string | null
  scheduled_at?: string
  status?: AppointmentStatus
}

export interface AppointmentStatsResponse {
  total_appointments: number
  upcoming_appointments: number
  by_status: Record<string, number>
  org_id: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const appointmentsApi = {
  async list(params?: AppointmentsListParams): Promise<AppointmentsListResponse> {
    const response = await axios.get(`${API_BASE}/org/appointments`, {
      params,
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getById(id: string): Promise<Appointment> {
    const response = await axios.get(`${API_BASE}/org/appointments/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await axios.post(`${API_BASE}/org/appointments`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async update(id: string, data: UpdateAppointmentRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/appointments/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/appointments/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async getStats(): Promise<AppointmentStatsResponse> {
    const response = await axios.get(`${API_BASE}/org/appointments/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}