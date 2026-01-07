// src/helpers/Manu.ts
import {
  PLATFORM_MENU_ITEMS,
  ORG_MENU_ITEMS,
} from '@/assets/data/menu-items'
import type { MenuItemType } from '@/types/menu'
import type { ActorType } from '@/types/auth'
import { PAGE_FEATURES } from '@/config/page-features'


/* ================================
   MENU SELECTOR
   ================================ */

export const getMenuItems = (
  actor?: ActorType | null
): MenuItemType[] => {
  if (!actor) return []

  if (actor === 'platform') {
    return PLATFORM_MENU_ITEMS
  }

  if (actor === 'org') {
    return ORG_MENU_ITEMS
  }

  return []
}

/* ================================
   HELPERS (UNCHANGED)
   ================================ */

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

export const getMenuItemFromURL = (
  items: MenuItemType | MenuItemType[],
  url: string
): MenuItemType | undefined => {
  if (Array.isArray(items)) {
    for (const item of items) {
      const foundItem = getMenuItemFromURL(item, url)
      if (foundItem) return foundItem
    }
  } else {
    if (items.url === url) return items
    if (items.children) {
      for (const item of items.children) {
        if (item.url === url) return item
      }
    }
  }
}

export const findMenuItem = (
  menuItems: MenuItemType[] | undefined,
  menuItemKey: MenuItemType['key'] | undefined
): MenuItemType | null => {
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

export const getAccessibleMenuItems = (
  actor: ActorType | null | undefined,
  user?: {
    is_admin?: boolean
    features?: string[]
  }
): MenuItemType[] => {
  const menuItems = getMenuItems(actor)

  // No user → no menu
  if (!user) return []

  return menuItems.filter(item => {
    // Always show menu titles
    if (item.isTitle) return true

    // Admin sees everything
    if (user.is_admin) return true

    // No URL → safe to show
    if (!item.url) return true

    const requiredFeature = PAGE_FEATURES[item.url]

    // No feature mapping → public item
    if (!requiredFeature) return true

    return user.features?.includes(requiredFeature)
  })
}
