'use client'

import * as React from 'react'
import { cn } from '@/utils/helpers'
import { CardProps } from '@/types'

/**
 * Card component for content organization
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, isInteractive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
          isInteractive &&
            'transition-shadow hover:shadow-md cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
