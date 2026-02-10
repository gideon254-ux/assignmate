/**
 * TypeScript type definitions for Assignmate
 */

export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Assignment {
  id: string
  title: string
  description: string | null
  subject: string
  dueDate: Date
  priority: string
  status: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateAssignmentInput {
  title: string
  description?: string
  subject: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
}

export interface UpdateAssignmentInput extends Partial<CreateAssignmentInput> {
  status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  isInteractive?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}
