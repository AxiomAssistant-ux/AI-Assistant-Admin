import { apiClient } from './api-client'
import type { Coupon, CouponListResponse, CouponPayload } from '@/types/billing'

const BASE_ENDPOINT = '/auth/admin/billing/coupons'

export const couponApi = {
  listCoupons(token: string) {
    return apiClient.get<CouponListResponse | Coupon[]>(BASE_ENDPOINT, token)
  },
  createCoupon(token: string, payload: CouponPayload) {
    return apiClient.post<Coupon>(BASE_ENDPOINT, payload, token)
  },
  updateCoupon(token: string, couponId: string, payload: CouponPayload) {
    return apiClient.put<Coupon>(`${BASE_ENDPOINT}/${couponId}`, payload, token)
  },
  deleteCoupon(token: string, couponId: string) {
    return apiClient.delete<void>(`${BASE_ENDPOINT}/${couponId}`, token)
  }
}

