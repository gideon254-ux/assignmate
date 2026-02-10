'use client'

import * as React from 'react'
import { cn } from '@/utils/helpers'
import { InputProps } from '@/types'

/**
 * Input component with label and error states
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded border px-4 text-sm text-gray-900 placeholder-gray-500',
            'border-gray-300 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10',
            error && 'border-error-600 focus:border-error-600 focus:ring-error-600/10',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
