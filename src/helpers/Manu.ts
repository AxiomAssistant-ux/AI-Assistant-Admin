import { MENU_ITEMS } from '@/assets/data/menu-items'
import type { MenuItemType } from '@/types/menu'

export const getMenuItems = (userRole?: 'admin' | 'user' | null): MenuItemType[] => {
  // If no role is provided, return empty menu (or default menu)
  if (!userRole) {
    return []
  }

  // Admin menu items
  if (userRole === 'admin') {
    return [
      {
        key: 'menu',
        label: 'MENU',
        isTitle: true,
      },
      {
        key: 'dashboards',
        label: 'Dashboard',
        icon: 'solar:widget-2-outline',
        url: '/dashboards',
      },
      {
        key: 'create-agent',
        label: 'Create Agent',
        icon: 'solar:user-plus-outline',
        url: '/create-agent',
      },
      {
        key: 'outbound-calls',
        label: 'Outbound Calls',
        icon: 'solar:phone-calling-outline',
        url: '/outbound-calls',
      },
      {
        key: 'documents',
        label: 'Documents',
        icon: 'solar:document-outline',
        url: '/documents',
      },
      {
        key: 'defaults',
        label: 'Defaults',
        icon: 'solar:settings-outline',
        url: '/defaults',
      },
      {
        key: 'call-records',
        label: 'Call Records',
        icon: 'solar:call-chat-outline',
        url: '/call-records',
      },
      {
        key: 'user-management',
        label: 'User Management',
        icon: 'solar:users-group-two-rounded-outline',
        url: '/user-management',
      },
    ]
  }

  // User menu items
  if (userRole === 'user') {
    return [
      {
        key: 'menu',
        label: 'MENU',
        isTitle: true,
      },
      {
        key: 'dashboards',
        label: 'Dashboard',
        icon: 'solar:widget-2-outline',
        url: '/dashboards',
      },
      {
        key: 'call-records',
        label: 'Call Records',
        icon: 'solar:call-chat-outline',
        url: '/call-records',
      },
      {
        key: 'incident-report',
        label: 'Incident Report',
        icon: 'solar:document-text-outline',
        url: '/incident-report',
      },
      {
        key: 'action-items',
        label: 'Action Items',
        icon: 'solar:checklist-outline',
        url: '/action-items',
      },
      {
        key: 'agent-settings',
        label: 'Agent Settings',
        icon: 'solar:settings-outline',
        url: '/agent-settings',
      },
      {
        key: 'faqs',
        label: 'FAQs',
        icon: 'solar:question-circle-outline',
        url: '/faqs',
      },
      {
        key: 'contact-support',
        label: 'Contact Support',
        icon: 'solar:phone-calling-outline',
        url: '/contact-support',
      },
    ]
  }

  // Fallback to original menu items (commented out)
  // return MENU_ITEMS
  return []
}

export const findAllParent = (menuItems: MenuItemType[], menuItem: MenuItemType): string[] => {
  let parents: string[] = []
  const parent = findMenuItem(menuItems, menuItem.parentKey)
  if (parent) {
    parents.push(parent.key)
    if (parent.parentKey) {
      parents = [...parents, ...findAllParent(menuItems, parent)]
    }
  }
  return parents
}

export const getMenuItemFromURL = (items: MenuItemType | MenuItemType[], url: string): MenuItemType | undefined => {
  if (items instanceof Array) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url)
      if (foundItem) {
        return foundItem
      }
    }
  } else {
    if (items.url == url) return items
    if (items.children != null) {
      for (const item of items.children) {
        if (item.url == url) return item
      }
    }
  }
}

export const findMenuItem = (menuItems: MenuItemType[] | undefined, menuItemKey: MenuItemType['key'] | undefined): MenuItemType | null => {
  if (menuItems && menuItemKey) {
    for (const item of menuItems) {
      if (item.key === menuItemKey) {
        return item
      }
      const found = findMenuItem(item.children, menuItemKey)
      if (found) return found
    }
  }
  return null
}
