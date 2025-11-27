export type SubscriptionTier = 'basic' | 'pro' | 'premium' | 'enterprise' | 'custom'
export type BillingFrequency = 'monthly' | 'quarterly' | 'annual'
export type SubscriptionPlanStatus = 'active' | 'inactive' | 'archived' | 'draft'

export interface SubscriptionPlan {
  id: string
  externalId?: string
  name: string
  tier: SubscriptionTier
  description?: string
  price: number
  currency: string
  billingFrequency: BillingFrequency
  minuteAllocation?: number
  features: string[]
  status: SubscriptionPlanStatus
  trialDays: number
  createdAt?: string
  updatedAt?: string
}

export type SubscriptionPlanPayload = {
  name: string
  tier: SubscriptionTier
  description?: string
  price: number
  currency: string
  billingFrequency: BillingFrequency
  minuteAllocation?: number
  features: string[]
  status: SubscriptionPlanStatus
  trialDays: number
}

export type SubscriptionPlanListResponse = {
  items: SubscriptionPlan[]
  total: number
}

export type CouponDiscountType = 'percentage' | 'fixed'
export type CouponStatus = 'draft' | 'active' | 'scheduled' | 'expired'

export interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  discountType: CouponDiscountType
  discountValue: number
  currency?: string
  maxRedemptions?: number
  perUserLimit?: number
  appliesToPlanIds?: string[]
  startDate?: string
  endDate?: string
  status: CouponStatus
  usageCount?: number
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export type CouponPayload = {
  code: string
  name: string
  description?: string
  discountType: CouponDiscountType
  discountValue: number
  currency?: string
  maxRedemptions?: number
  perUserLimit?: number
  appliesToPlanIds?: string[]
  startDate?: string
  endDate?: string
  status: CouponStatus
  notes?: string
}

export type CouponListResponse = {
  items: Coupon[]
  total: number
}

