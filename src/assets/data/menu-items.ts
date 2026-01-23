// src/assets/data/menu-items.ts
import type { MenuItemType } from '@/types/menu'

/* =====================================================
   PLATFORM (ADMIN) MENU
   ===================================================== */

export const PLATFORM_MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },

  // PLATFORM (SUPER ADMIN)
  {
    key: 'platform-dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-outline',
    url: '/dashboard',
  },
  {
    key: 'organizations',
    label: 'Organizations',
    icon: 'solar:buildings-outline',
    url: '/organizations',
  },
  {
    key: 'subscription-plans',
    label: 'Subscription Plans',
    icon: 'solar:wallet-money-outline',
    url: '/subscription-plans',
  },
  {
    key: 'coupons',
    label: 'Coupon Management',
    icon: 'solar:ticket-sale-outline',
    url: '/coupons',
  },
  {
    key: 'platform-agents',
    label: 'Agents',
    icon: 'solar:user-plus-outline',
    url: '/agents',
  },
  {
    key: 'verticals',
    label: 'Verticals',
    icon: 'solar:layers-outline',
    url: '/verticals',
  },
  {
    key: 'support-tickets',
    label: 'Support Tickets',
    icon: 'solar:help-outline',
    url: '/support',
  },

  // ORG ADMIN MENU ITEMS
  {
    key: 'org-dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-outline',
    url: '/dashboards',
  },
  {
    key: 'users-roles',
    label: 'Users and Roles',
    icon: 'solar:users-group-rounded-outline',
    url: '/users-roles',
  },
  {
    key: 'call-records',
    label: 'Call Records',
    icon: 'solar:call-chat-outline',
    url: '/call-records',
  },
  {
    key: 'action-items',
    label: 'Action Items',
    icon: 'solar:checklist-outline',
    url: '/action-items',
  },
  {
    key: 'incident-reports',
    label: 'Incident Reports',
    icon: 'solar:document-text-outline',
    url: '/incident-reports',
  },
  {
    key: 'appointments',
    label: 'Appointments',
    icon: 'solar:calendar-outline',
    url: '/appointments',
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: 'solar:calendar-outline',
    url: '/orders',
  },
  {
    key: 'knowledge-base',
    label: 'Knowledge Bases',
    icon: 'solar:book-outline',
    url: '/knowledge-base',
  },
  {
    key: 'agent-settings',
    label: 'Agent Settings',
    icon: 'solar:settings-outline',
    url: '/agent-settings',
  },
  {
    key: 'usage-billing',
    label: 'Usage and Billings',
    icon: 'solar:chart-outline',
    url: '/usage',
  },
  {
    key: 'contact-support',
    label: 'Contact Support',
    icon: 'solar:phone-calling-outline',
    url: '/contact-support',
  },
]


/* =====================================================
   ORG USER MENU
   ===================================================== */

export const ORG_MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'OPERATIONS',
    isTitle: true,
  },
  {
    key: 'org-dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-outline',
    url: '/dashboards',
  },
  // {
  //   key: 'agent',
  //   label: 'Call Assistant',
  //   icon: 'solar:face-scan-square-broken',
  //   url: '/agent',
  // },
  {
    key: 'call-records',
    label: 'Calls',
    icon: 'solar:call-chat-outline',
    url: '/call-records',
    // badge: { variant: 'warning', text: '0' }, // Will be updated dynamically
  },
  {
    key: 'complaints',
    label: 'Complaints',
    icon: 'solar:danger-triangle-linear',
    url: '/complaints',
    // Badge shows ONLY pending count - will be updated dynamically
    // badge: { variant: 'danger', text: '0' },
    children: [
      // Pending with badge
      {
        key: 'nav_complaints__all',
        label: 'All',
        url: '/complaints',
        // badge: { variant: 'danger', text: '0' } // Updated dynamically
      },
      // Pending with badge
      {
        key: 'nav_complaints__pending',
        label: 'Pending',
        url: '/complaints?status=pending',
        // badge: { variant: 'danger', text: '0' } // Updated dynamically
      },
      // In Progress with badge
      {
        key: 'nav_complaints__in_progress',
        label: 'In Progress',
        url: '/complaints?status=in_progress',
        // badge: { variant: 'warning', text: '0' } // Updated dynamically
      },
      // Resolved - NO badge
      {
        key: 'nav_complaints__resolved',
        label: 'Resolved',
        url: '/complaints?status=resolved'
      },
    ]
  },
  {
    key: 'action-items',
    label: 'Tasks',
    icon: 'solar:checklist-outline',
    url: '/action-items',
    // badge: { variant: 'danger', text: '3' },
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: 'solar:box-linear',
    url: '/orders',
  },
  {
    key: 'incident-reports',
    label: 'Incident Reports',
    icon: 'solar:document-text-outline',
    url: '/incidents-reports',
  },
  {
    key: 'appointments',
    label: 'Appointments',
    icon: 'solar:calendar-outline',
    url: '/appointments',
  },
  {
    key: 'menu',
    label: 'MANAGEMENT',
    isTitle: true,
  },
  {
    key: 'users-roles',
    label: 'Team',
    icon: 'solar:users-group-rounded-outline',
    url: '/users-roles',
  },
  {
    key: 'locations',
    label: 'Locations',
    icon: 'solar:map-outline',
    url: '/locations',
  },
  // {
  //   key: 'knowledge-base',
  //   label: 'Knowledge Bases',
  //   icon: 'solar:book-outline',
  //   url: '/knowledge-base',
  // },
  // {
  //   key: 'agent-settings',
  //   label: 'Agent Settings',
  //   icon: 'solar:settings-outline',
  //   url: '/agent-settings',
  // },
  {
    key: 'menu',
    label: 'BILLING & SUPPORT',
    isTitle: true,
  },
  {
    key: 'usage-billing',
    label: 'Billing & Usage',
    icon: 'solar:chart-outline',
    url: '/usage',
  },
  {
    key: 'faqs',
    label: 'FAQs',
    icon: 'solar:question-circle-outline',
    url: '/faqs',
  },

  {
    key: 'contact-support',
    label: 'Support',
    icon: 'solar:phone-calling-outline',
    url: '/contact-support',
  },
]
