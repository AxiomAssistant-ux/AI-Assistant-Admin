'use client'
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import type { ChildrenType } from '@/types/component-props'
import type { LayoutState, LayoutType, MenuType, OffcanvasControlType, LayoutOffcanvasStatesType, ThemeType } from '@/types/context'

import { toggleDocumentAttribute } from '@/utils/layout'
import useQueryParams from '@/hooks/useQueryParams'
import useLocalStorage from '@/hooks/useLocalStorage'

const ThemeContext = createContext<LayoutType | undefined>(undefined)

const useLayoutContext = () => {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useLayoutContext can only be used within LayoutProvider')
  }
  return context
}

// const getPreferredTheme = (): ThemeType => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const LayoutProvider = ({ children }: ChildrenType) => {
  const queryParams = useQueryParams()

  const override = !!(queryParams.layout_theme || queryParams.topbar_theme || queryParams.menu_theme || queryParams.menu_size)

  const INIT_STATE: LayoutState = useMemo(() => ({
    theme: queryParams['layout_theme'] ? (queryParams['layout_theme'] as ThemeType) : 'light',
    topbarTheme: queryParams['topbar_theme'] ? (queryParams['topbar_theme'] as ThemeType) : 'light',
    menu: {
      theme: queryParams['menu_theme'] ? (queryParams['menu_theme'] as MenuType['theme']) : 'light',
      size: 'default',
    },
  }), [queryParams])

  const [settings, setSettings] = useLocalStorage<LayoutState>('__REBACK_NEXT_CONFIG__', INIT_STATE, override)
  const [offcanvasStates, setOffcanvasStates] = useState<LayoutOffcanvasStatesType>({
    showThemeCustomizer: false,
    showActivityStream: false,
    showBackdrop: false,
  })

  // update settings
  const updateSettings = useCallback((_newSettings: Partial<LayoutState>) => setSettings(prev => ({ ...prev, ..._newSettings })), [setSettings])

  // update theme mode
  const changeTheme = useCallback((newTheme: ThemeType) => {
    updateSettings({ theme: newTheme })
  }, [updateSettings])

  // change topbar theme
  const changeTopbarTheme = useCallback((newTheme: ThemeType) => {
    updateSettings({ topbarTheme: newTheme })
  }, [updateSettings])

  // change menu theme
  const changeMenuTheme = useCallback((newTheme: MenuType['theme']) => {
    setSettings(prev => ({ ...prev, menu: { ...prev.menu, theme: newTheme } }))
  }, [setSettings])

  // change menu theme
  const changeMenuSize = useCallback((newSize: MenuType['size']) => {
    // Does nothing now
  }, [])

  // toggle theme customizer offcanvas
  const toggleThemeCustomizer: OffcanvasControlType['toggle'] = useCallback(() => {
    setOffcanvasStates(prev => ({ ...prev, showThemeCustomizer: !prev.showThemeCustomizer }))
  }, [])

  // toggle activity stream offcanvas
  const toggleActivityStream: OffcanvasControlType['toggle'] = useCallback(() => {
    setOffcanvasStates(prev => ({ ...prev, showActivityStream: !prev.showActivityStream }))
  }, [])

  const themeCustomizer: LayoutType['themeCustomizer'] = useMemo(() => ({
    open: offcanvasStates.showThemeCustomizer,
    toggle: toggleThemeCustomizer,
  }), [offcanvasStates.showThemeCustomizer, toggleThemeCustomizer])

  const activityStream: LayoutType['activityStream'] = useMemo(() => ({
    open: offcanvasStates.showActivityStream,
    toggle: toggleActivityStream,
  }), [offcanvasStates.showActivityStream, toggleActivityStream])

  // toggle backdrop
  const toggleBackdrop = useCallback(() => {
    const htmlTag = document.getElementsByTagName('html')[0]
    setOffcanvasStates(prevStates => {
      if (prevStates.showBackdrop) {
        htmlTag.classList.remove('sidebar-enable')
      } else {
        htmlTag.classList.add('sidebar-enable')
      }
      return { ...prevStates, showBackdrop: !prevStates.showBackdrop }
    })
  }, [])

  useEffect(() => {
    toggleDocumentAttribute('data-bs-theme', settings.theme)
    toggleDocumentAttribute('data-topbar-color', settings.topbarTheme)
    toggleDocumentAttribute('data-sidebar-color', settings.menu.theme)
    toggleDocumentAttribute('data-sidebar-size', settings.menu.size)
    return () => {
      toggleDocumentAttribute('data-bs-theme', settings.theme, true)
      toggleDocumentAttribute('data-topbar-color', settings.topbarTheme, true)
      toggleDocumentAttribute('data-sidebar-color', settings.menu.theme, true)
      toggleDocumentAttribute('data-sidebar-size', settings.menu.size, true)
    }
  }, [settings])

  const resetSettings = useCallback(() => setSettings(INIT_STATE), [INIT_STATE, setSettings])

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          ...settings,
          themeMode: settings.theme,
          changeTheme,
          changeTopbarTheme,
          changeMenu: {
            theme: changeMenuTheme,
            size: changeMenuSize,
          },
          themeCustomizer,
          activityStream,
          toggleBackdrop,
          resetSettings,
        }),
        [
          settings,
          changeTheme,
          changeTopbarTheme,
          changeMenuTheme,
          changeMenuSize,
          themeCustomizer,
          activityStream,
          toggleBackdrop,
          resetSettings,
        ],
      )}>
      {children}
      {offcanvasStates.showBackdrop && <div className="offcanvas-backdrop fade show" onClick={toggleBackdrop} />}
    </ThemeContext.Provider>
  )
}

export { LayoutProvider, useLayoutContext }
