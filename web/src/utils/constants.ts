/**
 * Application constants
 */

export const APP_NAME = 'Assignmate'
export const APP_DESCRIPTION = 'Organize your assignments efficiently'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ASSIGNMENTS: '/assignments',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
  LOGIN: '/api/auth/signin',
} as const

export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
} as const

export const ASSIGNMENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD },
  { name: 'Assignments', href: ROUTES.ASSIGNMENTS },
  { name: 'Calendar', href: ROUTES.CALENDAR },
  { name: 'Settings', href: ROUTES.SETTINGS },
] as const
