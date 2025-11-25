import type { CouponStatus, SubscriptionPlanStatus } from '@/types/billing'

export const formatCurrencyValue = (value: number, currency = 'USD') => {
  if (Number.isNaN(value)) return '—'
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

export const formatDateTime = (value?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      ...options
    }).format(new Date(value))
  } catch {
    return value
  }
}

export const formatDateRange = (start?: string, end?: string) => {
  if (!start && !end) return '—'
  const startLabel = start ? formatDateTime(start, { hour: undefined, minute: undefined }) : 'Immediate'
  const endLabel = end ? formatDateTime(end, { hour: undefined, minute: undefined }) : 'No end date'
  return `${startLabel} → ${endLabel}`
}

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark'

export const getPlanStatusVariant = (status: SubscriptionPlanStatus): Variant => {
  const map: Record<SubscriptionPlanStatus, Variant> = {
    active: 'success',
    inactive: 'secondary',
    archived: 'dark',
    draft: 'warning'
  }
  return map[status] ?? 'secondary'
}

export const getCouponStatusVariant = (status: CouponStatus): Variant => {
  const map: Record<CouponStatus, Variant> = {
    active: 'success',
    scheduled: 'info',
    draft: 'warning',
    expired: 'secondary'
  }
  return map[status] ?? 'secondary'
}

