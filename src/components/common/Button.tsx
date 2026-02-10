'use client'

import * as React from 'react'
import { cn } from '@/utils/helpers'
import { ButtonProps } from '@/types'

/**
 * Button component with multiple variants
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-primary-700 text-white hover:bg-primary-900 active:bg-primary-900/50 disabled:bg-gray-300 disabled:text-gray-500',
      secondary:
        'border-2 border-primary-700 text-primary-700 bg-transparent hover:bg-primary-700/5 active:bg-primary-700/10 disabled:border-gray-300 disabled:text-gray-500',
      tertiary:
        'bg-transparent text-primary-700 hover:underline active:text-primary-900 disabled:text-gray-500',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm h-10',
      md: 'px-6 py-3 text-sm h-11',
      lg: 'px-8 py-3 text-base h-12',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
