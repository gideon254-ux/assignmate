'use client'

import * as React from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Plus } from 'lucide-react'
import { useAssignments } from '@/hooks/useAssignments'

/**
 * Button to open create assignment modal
 */
export const CreateAssignmentButton: React.FC = () => {
  const { createAssignment, isCreating } = useAssignments()
  const [isOpen, setIsOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    priority: 'medium',
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
      await createAssignment({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        dueDate: new Date(formData.dueDate),
        priority: formData.priority as any,
      })

      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        subject: '',
        dueDate: '',
        priority: 'medium',
      })
      setIsOpen(false)
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create assignment' })
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Assignment
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Assignment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="Enter assignment title"
          />

          <Input
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            error={errors.subject}
            placeholder="Enter subject"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] w-full rounded border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700/10"
              placeholder="Enter description (optional)"
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

          {errors.submit && <p className="text-sm text-error-600">{errors.submit}</p>}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating} className="flex-1">
              Create Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
