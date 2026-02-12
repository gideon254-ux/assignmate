'use client'

import * as React from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Assignment } from '@/types'
import { AlertTriangle } from 'lucide-react'

interface DeleteAssignmentModalProps {
  assignment: Assignment
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteAssignmentModal: React.FC<DeleteAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Assignment">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
          <AlertTriangle className="h-6 w-6 text-error-600" />
          <p className="text-sm text-gray-700">
            Are you sure you want to delete <strong>{assignment.title}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} className="flex-1 bg-error-600 hover:bg-red-700">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
