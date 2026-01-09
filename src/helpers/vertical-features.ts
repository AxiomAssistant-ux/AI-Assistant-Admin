// src/helpers/vertical-features.ts

import { getVerticalConfig, type VerticalKey } from '@/config/verticals'

/**
 * Get list of features allowed for a vertical
 * Maps menu keys to feature keys
 */
export const getVerticalFeatures = (verticalKey?: VerticalKey): string[] => {
  const config = getVerticalConfig(verticalKey)
  
  if (!config) {
    // If no vertical config, return all features
    return [
      'agent',
      'users-roles',
      'call-records',
      'action-items',
      'complaints',
      'orders',
      'incident-reports',
      'appointments',
      'locations',
      'knowledge-base',
      'agent-settings',
      'usage-billing',
    ]
  }

  // Map menu keys to feature keys
  const menuKeyToFeature: Record<string, string> = {
    'agent': 'agent',
    'users-roles': 'users-roles',
    'call-records': 'call-records',
    'action-items': 'action-items',
    'complaints': 'complaints',
    'orders': 'orders',
    'incident-reports': 'incident-reports',
    'appointments': 'appointments',
    'locations': 'locations',
    'knowledge-base': 'knowledge-base',
    'agent-settings': 'agent-settings',
    'usage-billing': 'usage-billing',
  }

  // Filter features based on allowed menu keys
  return config.allowedMenuKeys
    .map(menuKey => menuKeyToFeature[menuKey])
    .filter(Boolean) as string[]
}

/**
 * Filter available features based on vertical
 */
export const filterFeaturesByVertical = (
  allFeatures: Array<{ value: string; label: string }>,
  verticalKey?: VerticalKey
): Array<{ value: string; label: string }> => {
  const allowedFeatures = getVerticalFeatures(verticalKey)
  return allFeatures.filter(feature => allowedFeatures.includes(feature.value))
}