import * as React from 'react'
import { APP_NAME } from '@/utils/constants'

/**
 * Footer component
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-700">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{APP_NAME}</span>
          </div>
          <p className="text-sm text-gray-500">
            {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
