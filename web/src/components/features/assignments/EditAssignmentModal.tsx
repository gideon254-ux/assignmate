'use client'

import * as React from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Assignment, useAssignments } from '@/hooks/useAssignments'
import { format } from 'date-fns'

interface EditAssignmentModalProps {
  assignment: Assignment
  isOpen: boolean
  onClose: () => void
}

export const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
}) => {
  const { updateAssignment, isUpdating } = useAssignments()
  const [formData, setFormData] = React.useState({
    title: assignment.title,
    description: assignment.description || '',
    subject: assignment.subject,
    dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm"),
    priority: assignment.priority,
    status: assignment.status,
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await updateAssignment(assignment.id, {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        dueDate: new Date(formData.dueDate),
        priority: formData.priority as any,
        status: formData.status as any,
      })
      onClose()
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update assignment' })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Assignment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
        />

        <Input
          label="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          error={errors.subject}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[100px] w-full rounded border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10"
          />
        </div>

        <Input
          label="Due Date"
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          error={errors.dueDate}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="h-11 w-full rounded border border-gray-300 px-4 text-sm text-gray-900 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="h-11 w-full rounded border border-gray-300 px-4 text-sm text-gray-900 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {errors.submit && <p className="text-sm text-error-600">{errors.submit}</p>}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isUpdating === assignment.id} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}
