import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { Header } from '@/components/layout/Header'
import { AssignmentsList } from '@/components/features/assignments/AssignmentsList'
import { CreateAssignmentButton } from '@/components/features/assignments/CreateAssignmentButton'

async function getAssignments(userId: string) {
  return await prisma.assignment.findMany({
    where: { userId },
    orderBy: { dueDate: 'asc' },
  })
}

export default async function AssignmentsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const assignments = await getAssignments(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          title="Assignments"
          description="Manage all your assignments in one place"
        >
          <CreateAssignmentButton />
        </Header>

        <AssignmentsList initialAssignments={assignments} />
      </div>
    </div>
  )
}
