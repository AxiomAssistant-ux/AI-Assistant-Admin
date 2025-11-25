import { apiClient } from './api-client'
import type { SubscriptionPlan, SubscriptionPlanListResponse, SubscriptionPlanPayload } from '@/types/billing'

const BASE_ENDPOINT = '/auth/admin/billing/plans'

export const subscriptionApi = {
  listPlans(token: string) {
    return apiClient.get<SubscriptionPlanListResponse | SubscriptionPlan[]>(BASE_ENDPOINT, token)
  },
  createPlan(token: string, payload: SubscriptionPlanPayload) {
    return apiClient.post<SubscriptionPlan>(BASE_ENDPOINT, payload, token)
  },
  updatePlan(token: string, planId: string, payload: SubscriptionPlanPayload) {
    return apiClient.put<SubscriptionPlan>(`${BASE_ENDPOINT}/${planId}`, payload, token)
  },
  deletePlan(token: string, planId: string) {
    return apiClient.delete<void>(`${BASE_ENDPOINT}/${planId}`, token)
  }
}

