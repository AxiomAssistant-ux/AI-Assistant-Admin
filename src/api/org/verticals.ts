// src/api/org/verticals.ts

import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

export interface Vertical {
  key: string
  name: string
  description: string
}

export const verticalsApi = {
  /**
   * Get all verticals
   * GET /org/verticals
   * No authentication required
   */
  async getAll(): Promise<Vertical[]> {
    const response = await axios.get(`${API_BASE}/org/verticals`)
    // Response is now a direct array
    return response.data.verticals
  },

  /**
   * Get a specific vertical by key
   * GET /org/verticals/{vertical_key}
   * No authentication required
   */
  async getByKey(key: string): Promise<Vertical> {
    const response = await axios.get(`${API_BASE}/org/verticals/${key}`)
    return response.data
  },
}