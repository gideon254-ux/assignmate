'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/helpers'
import { NAVIGATION_ITEMS, APP_NAME } from '@/utils/constants'
import { Menu, X, User, Shield } from 'lucide-react'

/**
 * Navigation component with mobile menu support
 */
export const Navigation: React.FC = () => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Add admin link if user is admin
  const navigationItems = React.useMemo(() => {
    const items = [...NAVIGATION_ITEMS]
    if (user?.isAdmin) {
      items.push({ name: 'Admin', href: '/admin' })
    }
    return items
  }, [user])

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 bg-gray-900">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-700">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <span className="text-lg font-bold text-white">{APP_NAME}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {user &&
            navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors',
                  pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-white'
                )}
              >
                {item.name === 'Admin' && <Shield className="h-3 w-3" />}
                {item.name}
              </Link>
            ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-300">{user.name}</span>
              <button
                onClick={handleSignOut}
                className="rounded px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-900"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>

        <button
          className="rounded p-2 text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-16 w-full bg-gray-900 p-4 md:hidden">
          <div className="flex flex-col gap-4">
            {user &&
              navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded px-4 py-2 text-sm font-medium',
                    pathname === item.href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name === 'Admin' && <Shield className="h-3 w-3" />}
                  {item.name}
                </Link>
              ))}
            {user ? (
              <button
                onClick={() => {
                  handleSignOut()
                  setIsMobileMenuOpen(false)
                }}
                className="rounded bg-gray-800 px-4 py-2 text-left text-sm font-medium text-white hover:bg-gray-700"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded bg-primary-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
