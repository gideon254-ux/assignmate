'use client'

import * as React from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Assignment } from '@/types'
import { format } from 'date-fns'
import { Edit, Trash2, CheckCircle } from 'lucide-react'
import { EditAssignmentModal } from './EditAssignmentModal'
import { DeleteAssignmentModal } from './DeleteAssignmentModal'

interface AssignmentsListProps {
  initialAssignments: Assignment[]
}

export const AssignmentsList: React.FC<AssignmentsListProps> = ({
  initialAssignments,
}) => {
  const [assignments, setAssignments] = React.useState(initialAssignments)
  const [editingAssignment, setEditingAssignment] = React.useState<Assignment | null>(null)
  const [deletingAssignment, setDeletingAssignment] = React.useState<Assignment | null>(null)

  const handleStatusChange = async (assignmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedAssignment = await response.json()
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? updatedAssignment : a))
        )
      }
    } catch (error) {
      console.error('Failed to update assignment:', error)
    }
  }

  const handleDelete = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
        setDeletingAssignment(null)
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-success-600'
      case 'overdue':
        return 'bg-red-100 text-error-600'
      case 'in_progress':
        return 'bg-blue-100 text-primary-700'
      default:
        return 'bg-amber-100 text-warning-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-error-600'
      case 'medium':
        return 'text-warning-600'
      default:
        return 'text-gray-600'
    }
  }

  if (assignments.length === 0) {
    return (
      <Card className="py-12 text-center">
        <p className="text-gray-500">No assignments yet. Create your first assignment to get started.</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {assignment.status !== 'completed' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatusChange(assignment.id, 'completed')}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Complete
                </Button>
              )}
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setEditingAssignment(assignment)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setDeletingAssignment(assignment)}
                className="text-error-600 hover:text-error-700"
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
          onUpdate={(updated) => {
            setAssignments((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a))
            )
            setEditingAssignment(null)
          }}
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
