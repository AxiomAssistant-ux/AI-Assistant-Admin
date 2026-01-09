// src/api/org/verticals.ts

import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface Vertical {
  key: string
  name: string
  description: string
}

export interface VerticalsResponse {
  verticals: Vertical[]
}

export const verticalsApi = {
  /**
   * Get all available verticals
   * GET /org/verticals
   */
  async getAll(): Promise<Vertical[]> {
    const response = await axios.get<VerticalsResponse>(`${API_BASE}/org/verticals`)
    return response.data.verticals
  },

  /**
   * Get a specific vertical by key
   * GET /org/verticals/:key
   */
  async getByKey(key: string): Promise<Vertical> {
    const response = await axios.get<Vertical>(`${API_BASE}/org/verticals/${key}`)
    return response.data
  },
}