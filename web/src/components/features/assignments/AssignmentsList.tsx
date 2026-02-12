'use client'

import * as React from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Assignment, useAssignments } from '@/hooks/useAssignments'
import { format } from 'date-fns'
import { Edit, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import { EditAssignmentModal } from './EditAssignmentModal'
import { DeleteAssignmentModal } from './DeleteAssignmentModal'

interface AssignmentsListProps {
  initialAssignments?: Assignment[]
}

export const AssignmentsList: React.FC<AssignmentsListProps> = () => {
  const {
    optimisticAssignments,
    loading,
    error,
    updateAssignment,
    deleteAssignment,
    isUpdating,
    isDeleting,
  } = useAssignments()

  const [editingAssignment, setEditingAssignment] = React.useState<Assignment | null>(null)
  const [deletingAssignment, setDeletingAssignment] = React.useState<Assignment | null>(null)

  const handleStatusChange = async (assignmentId: string, newStatus: string) => {
    try {
      await updateAssignment(assignmentId, { status: newStatus as any })
    } catch (error) {
      console.error('Failed to update assignment:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleDelete = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId)
      setDeletingAssignment(null)
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      alert('Failed to delete assignment. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-amber-100 text-amber-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-amber-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <Loader2 className="text-primary-600 h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Loading assignments...</span>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="py-12 text-center">
        <p className="text-red-600">Error loading assignments: {error.message}</p>
        <p className="mt-2 text-sm text-gray-500">Please refresh the page to try again.</p>
      </Card>
    )
  }

  if (optimisticAssignments.length === 0) {
    return (
      <Card className="py-12 text-center">
        <p className="text-gray-500">
          No assignments yet. Create your first assignment to get started.
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {optimisticAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
              isUpdating === assignment.id || isDeleting === assignment.id ? 'opacity-50' : ''
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {assignment.status.replace('_', ' ')}
                </span>
                {(isUpdating === assignment.id || isDeleting === assignment.id) && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">{assignment.subject}</p>
              {assignment.description && (
                <p className="mt-2 text-sm text-gray-500">{assignment.description}</p>
              )}
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-gray-500">
                  Due: {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                </span>
                <span className={`font-medium ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}{' '}
                  Priority
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {assignment.status !== 'completed' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusChange(assignment.id, 'completed')}
                  disabled={isUpdating === assignment.id}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Complete
                </Button>
              )}
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setEditingAssignment(assignment)}
                disabled={isUpdating === assignment.id}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setDeletingAssignment(assignment)}
                disabled={isDeleting === assignment.id}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {editingAssignment && (
        <EditAssignmentModal
          assignment={editingAssignment}
          isOpen={!!editingAssignment}
          onClose={() => setEditingAssignment(null)}
        />
      )}

      {deletingAssignment && (
        <DeleteAssignmentModal
          assignment={deletingAssignment}
          isOpen={!!deletingAssignment}
          onClose={() => setDeletingAssignment(null)}
          onConfirm={() => handleDelete(deletingAssignment.id)}
        />
      )}
    </>
  )
}
