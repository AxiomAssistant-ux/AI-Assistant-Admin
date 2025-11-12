import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboards',
    label: 'dashboard',
    icon: 'solar:widget-2-outline',
    url: '/dashboards',
    badge: {
      text: 'New',
      variant: 'primary',
    },
  },
  // ====================Authentication===============

  {
    key: 'auth',
    label: 'Authentication',
    icon: 'solar:user-circle-outline',
    children: [
      {
        key: 'sign-in',
        label: 'Sign In',
        url: '/auth/sign-in',
        parentKey: 'auth',
      },
      {
        key: 'sign-up',
        label: 'Sign Up',
        url: '/auth/sign-up',
        parentKey: 'auth',
      },
      {
        key: 'reset-password',
        label: 'Reset Password',
        url: '/auth/reset-password',
        parentKey: 'auth',
      },
      {
        key: 'lock-screen',
        label: 'Lock Screen',
        url: '/auth/lock-screen',
        parentKey: 'auth',
      },
    ],
  },
  // ====================error===============

  {
    key: 'error-pages',
    label: 'Error Pages',
    icon: 'solar:danger-outline',
    children: [
      {
        key: '404-error',
        label: '404 Error',
        url: '/error-pages/pages-404',
        parentKey: 'error',
      },
      {
        key: '404-error(alt)',
        label: '404 Error (alt)',
        url: '/pages-404-alt',
        parentKey: 'error',
      },
    ],
  },
  // ====================base-ui===============
  {
    key: 'ui-kit',
    label: 'UI Kit...',
    isTitle: true,
  },
  {
    key: 'base-ui',
    label: 'Base UI',
    icon: 'solar:leaf-outline',
    children: [
      {
        key: 'accordion',
        label: 'Accordion',
        url: '/base-ui/accordion',
        parentKey: 'base-ui',
      },
      {
        key: 'alerts',
        label: 'Alerts',
        url: '/base-ui/alerts',
        parentKey: 'base-ui',
      },
      {
        key: 'avatar',
        label: 'Avatar',
        url: '/base-ui/avatar',
        parentKey: 'base-ui',
      },
      {
        key: 'badge',
        label: 'Badge',
        url: '/base-ui/badge',
        parentKey: 'base-ui',
      },
      {
        key: 'breadcrumb',
        label: 'Breadcrumb',
        url: '/base-ui/breadcrumb',
        parentKey: 'base-ui',
      },
      {
        key: 'buttons',
        label: 'Buttons',
        url: '/base-ui/buttons',
        parentKey: 'base-ui',
      },
      {
        key: 'cards',
        label: 'Cards',
        url: '/base-ui/cards',
        parentKey: 'base-ui',
      },
      {
        key: 'carousel',
        label: 'Carousel',
        url: '/base-ui/carousel',
        parentKey: 'base-ui',
      },
      {
        key: 'collapse',
        label: 'Collapse',
        url: '/base-ui/collapse',
        parentKey: 'base-ui',
      },
      {
        key: 'dropdown',
        label: 'Dropdown',
        url: '/base-ui/dropdown',
        parentKey: 'base-ui',
      },
      {
        key: 'list-group',
        label: 'List Group',
        url: '/base-ui/list-group',
        parentKey: 'base-ui',
      },
      {
        key: 'modals',
        label: 'Modals',
        url: '/base-ui/modals',
        parentKey: 'base-ui',
      },
      {
        key: 'tabs',
        label: 'Tabs',
        url: '/base-ui/tabs',
        parentKey: 'base-ui',
      },
      {
        key: 'offcanvas',
        label: 'Offcanvas',
        url: '/base-ui/offcanvas',
        parentKey: 'base-ui',
      },
      {
        key: 'pagination',
        label: 'Pagination',
        url: '/base-ui/pagination',
        parentKey: 'base-ui',
      },
      {
        key: 'placeholders',
        label: 'Placeholders',
        url: '/base-ui/placeholders',
        parentKey: 'base-ui',
      },
      {
        key: 'popovers',
        label: 'Popovers',
        url: '/base-ui/popovers',
        parentKey: 'base-ui',
      },
      {
        key: 'progress',
        label: 'Progress',
        url: '/base-ui/progress',
        parentKey: 'base-ui',
      },
      {
        key: 'spinners',
        label: 'spinners',
        url: '/base-ui/spinners',
        parentKey: 'base-ui',
      },
      {
        key: 'toasts',
        label: 'Toasts',
        url: '/base-ui/toasts',
        parentKey: 'base-ui',
      },
      {
        key: 'tooltips',
        label: 'Tooltips',
        url: '/base-ui/tooltips',
        parentKey: 'base-ui',
      },
    ],
  },
  // ====================apex===============
  {
    key: 'apex',
    label: 'Apex charts',
    icon: 'solar:chart-square-outline',
    url: '/apex-chart',
  },
  // ====================forms===============
  {
    key: 'forms',
    label: 'Forms',
    icon: 'solar:box-outline',
    children: [
      {
        key: 'basic',
        label: 'Basic Element',
        url: '/forms/basic',
        parentKey: 'forms',
      },
      {
        key: 'flat-picker',
        label: 'Flatepicker',
        url: '/forms/flat-picker',
        parentKey: 'forms',
      },
      {
        key: 'validation',
        label: 'Validation',
        url: '/forms/validation',
        parentKey: 'forms',
      },
      {
        key: 'file-uploads',
        label: 'File Upload',
        url: '/forms/file-uploads',
        parentKey: 'forms',
      },
      {
        key: 'editors',
        label: 'Editors',
        url: '/forms/editors',
        parentKey: 'forms',
      },
    ],
  },

  // ====================tables===============

  {
    key: 'tables',
    label: 'Tables',
    icon: 'solar:checklist-outline',
    children: [
      {
        key: 'basic',
        label: 'Basic Tables',
        url: '/tables/basic',
        parentKey: 'tables',
      },
      {
        key: 'gridjs',
        label: 'Grid Js',
        url: '/tables/gridjs',
        parentKey: 'tables',
      },
    ],
  },

  // ====================icons===============

  {
    key: 'icons',
    label: 'Icons',
    icon: 'solar:crown-star-outline',
    children: [
      {
        key: 'boxicons',
        label: 'Box Icons',
        url: '/icons/boxicons',
        parentKey: 'icons',
      },
      {
        key: 'solaricons',
        label: 'Solar Icons',
        url: '/icons/solaricons',
        parentKey: 'icons',
      },
    ],
  },

  // ====================maps===============
  {
    key: 'maps',
    label: 'Maps',
    icon: 'solar:map-outline',
    children: [
      {
        key: 'google',
        label: 'Google Maps',
        url: '/maps/google',
        parentKey: 'maps',
      },
      {
        key: 'vector',
        label: 'Vector Maps',
        url: '/maps/vector',
        parentKey: 'maps',
      },
    ],
  },

  {
    key: 'other',
    label: 'OTHER',
    isTitle: true,
  },
  // ====================layouts===============

  {
    key: 'layouts',
    label: 'layouts',
    icon: 'solar:window-frame-outline',
    children: [
      {
        key: 'dark-sidenav',
        label: 'dark sidenav',
        url: '/dark-sidenav',
        parentKey: 'layouts',
      },
      {
        key: 'dark-topnav',
        label: 'dark topnav',
        url: '/dark-topnav',
        parentKey: 'layouts',
      },
      {
        key: 'small-sidenav',
        label: 'small sidenav',
        url: '/small-sidenav',
        parentKey: 'layouts',
      },
      {
        key: 'hidden-sidenav',
        label: 'hidden sidenav',
        url: '/hidden-sidenav',
        parentKey: 'layouts',
      },
      {
        key: 'dark-mode',
        label: 'darkmode',
        url: '/dark-mode',
        parentKey: 'layouts',
        badge: {
          text: 'Hot',
          variant: 'badge badge-soft-danger ',
        },
      },
    ],
  },

  // ====================menu-items===============

  {
    key: 'menu-items',
    label: 'Menu Item',
    icon: 'solar:share-circle-outline',
    children: [
      {
        key: 'menu-items-1',
        label: 'Menu Items 1',
        parentKey: 'menu-items',
      },
      {
        key: 'menu-items-2',
        label: 'Menu Items 2',
        parentKey: 'menu-items',
        children: [
          {
            key: 'menu sub item',
            label: 'Menu Sub Item',
            parentKey: 'menu-items-2',
          },
        ],
      },
    ],
  },
  // ====================disable-items===============
  {
    key: ' Disable Item',
    label: ' Disable Item',
    icon: 'solar:library-outline',
    isDisabled: true,
  },
]
