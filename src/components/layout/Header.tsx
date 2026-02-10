import * as React from 'react'
import { cn } from '@/utils/helpers'

interface HeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Header component for page titles
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-base text-gray-600">{description}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </div>
  )
}
