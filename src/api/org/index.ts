// src/api/org/index.ts

// Export all org API clients
export * from './action-items'
export * from './appointments'
export * from './call-logs'
export * from './orders'
export * from './support'
export * from './users'
export * from './settings'
export * from './profile'
export * from './usage'
export * from './analytics'

// Re-export individual APIs for convenient imports
export { actionItemsApi } from './action-items'
export { appointmentsApi } from './appointments'
export { callLogsApi } from './call-logs'
export { ordersApi } from './orders'
export { supportApi } from './support'
export { orgUsersApi } from './users'
export { settingsApi } from './settings'
export { profileApi } from './profile'
export { usageApi } from './usage'
export { analyticsApi } from './analytics'