/**
 * Summary API functions
 * Handles all summary-related API calls to the backend
 */

import { apiClient } from './api-client'
import type { SummaryOut, SummaryQueryParams } from '@/types/summary'

export const summaryApi = {
  /**
   * Get user summaries with optional filters, search, pagination, and sorting
   */
  async getUserSummaries(token: string, params: SummaryQueryParams = {}) {
    const queryParams = new URLSearchParams()

    if (params.skip !== undefined) {
      queryParams.append('skip', params.skip.toString())
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params.search) {
      queryParams.append('search', params.search)
    }
    if (params.filter) {
      queryParams.append('filter', params.filter)
    }
    if (params.sort) {
      queryParams.append('sort', params.sort)
    }
    if (params.tz) {
      queryParams.append('tz', params.tz)
    }

    const endpoint = `/auth/user/summaries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<SummaryOut[]>(endpoint, token)
  },
}

