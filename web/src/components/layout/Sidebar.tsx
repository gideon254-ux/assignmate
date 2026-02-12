'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/helpers'
import { NAVIGATION_ITEMS } from '@/utils/constants'
import { LayoutDashboard, FileText, Calendar, Settings } from 'lucide-react'

const iconMap = {
  Dashboard: LayoutDashboard,
  Assignments: FileText,
  Calendar: Calendar,
  Settings: Settings,
}

/**
 * Sidebar component for navigation
 */
export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <nav className="flex-1 space-y-1 p-4">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = iconMap[item.name as keyof typeof iconMap]
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
