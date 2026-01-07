// src/api/org/orders.ts
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface Order {
  id: string
  org_id: string
  call_id?: string | null
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  order_details: string
  total_amount?: number | null
  currency?: string
  urgency: boolean
  status: OrderStatus
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  delivery_time?: string | null
  special_instructions?: string | null
  created_at: string
  updated_at: string
}

export interface OrdersListParams {
  skip?: number
  limit?: number
  status_filter?: OrderStatus
  urgency_filter?: boolean
  sort?: 'newest' | 'oldest' | 'amount'
}

export interface OrdersListResponse {
  orders: Order[]
  total: number
  skip: number
  limit: number
}

export interface CreateOrderRequest {
  call_id?: string | null
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  order_details: string
  total_amount?: number | null
  currency?: string
  urgency?: boolean
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  delivery_time?: string | null
  special_instructions?: string | null
}

export interface UpdateOrderRequest {
  customer_name?: string
  customer_phone?: string
  customer_email?: string | null
  order_details?: string
  total_amount?: number | null
  currency?: string
  urgency?: boolean
  status?: OrderStatus
  assigned_to_user_id?: string | null
  assigned_role?: string | null
  delivery_time?: string | null
  special_instructions?: string | null
}

export interface OrderStatsResponse {
  total_orders: number
  total_revenue: number
  by_status: Record<string, number>
  by_urgency: Record<string, number>
  org_id: string
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const ordersApi = {
  async list(params?: OrdersListParams): Promise<OrdersListResponse> {
    const response = await axios.get(`${API_BASE}/org/orders`, {
      params,
      headers: getAuthHeaders()
    })
    return response.data
  },

  async getById(id: string): Promise<Order> {
    const response = await axios.get(`${API_BASE}/org/orders/${id}`, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await axios.post(`${API_BASE}/org/orders`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async update(id: string, data: UpdateOrderRequest): Promise<{ message: string }> {
    const response = await axios.patch(`${API_BASE}/org/orders/${id}`, data, {
      headers: getAuthHeaders()
    })
    return response.data
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/org/orders/${id}`, {
      headers: getAuthHeaders()
    })
  },

  async getStats(): Promise<OrderStatsResponse> {
    const response = await axios.get(`${API_BASE}/org/orders/stats/summary`, {
      headers: getAuthHeaders()
    })
    return response.data
  }
}
