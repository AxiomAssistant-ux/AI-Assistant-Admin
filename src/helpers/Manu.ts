// src/helpers/Manu.ts
import {
  PLATFORM_MENU_ITEMS,
  ORG_MENU_ITEMS,
} from '@/assets/data/menu-items'
import type { MenuItemType } from '@/types/menu'
import type { ActorType } from '@/types/auth'

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
