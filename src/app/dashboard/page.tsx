import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/common/Card'
import { prisma } from '@/lib/database'
import { format } from 'date-fns'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'

async function getDashboardData(userId: string) {
  const [totalAssignments, completedAssignments, pendingAssignments, overdueAssignments] =
    await Promise.all([
      prisma.assignment.count({ where: { userId } }),
      prisma.assignment.count({ where: { userId, status: 'completed' } }),
      prisma.assignment.count({
        where: {
          userId,
          status: { in: ['pending', 'in_progress'] },
          dueDate: { gte: new Date() },
        },
      }),
      prisma.assignment.count({
        where: {
          userId,
          status: { not: 'completed' },
          dueDate: { lt: new Date() },
        },
      }),
    ])

  const recentAssignments = await prisma.assignment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const upcomingAssignments = await prisma.assignment.findMany({
    where: {
      userId,
      status: { in: ['pending', 'in_progress'] },
      dueDate: { gte: new Date() },
    },
    orderBy: { dueDate: 'asc' },
    take: 5,
  })

  return {
    stats: {
      total: totalAssignments,
      completed: completedAssignments,
      pending: pendingAssignments,
      overdue: overdueAssignments,
    },
    recentAssignments,
    upcomingAssignments,
  }
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const data = await getDashboardData(session.user.id)

  const statCards = [
    {
      title: 'Total Assignments',
      value: data.stats.total,
      icon: FileText,
      color: 'text-primary-700',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Completed',
      value: data.stats.completed,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: data.stats.pending,
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Overdue',
      value: data.stats.overdue,
      icon: AlertCircle,
      color: 'text-error-600',
      bgColor: 'bg-red-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          title="Dashboard"
          description="Overview of your assignments and progress"
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-center gap-4">
                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            <div className="mt-4 space-y-3">
              {data.upcomingAssignments.length === 0 ? (
                <p className="text-gray-500">No upcoming assignments</p>
              ) : (
                data.upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">{assignment.subject}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {format(new Date(assignment.dueDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="mt-4 space-y-3">
              {data.recentAssignments.length === 0 ? (
                <p className="text-gray-500">No recent activity</p>
              ) : (
                data.recentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">
                        Added {format(new Date(assignment.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        assignment.status === 'completed'
                          ? 'bg-green-100 text-success-600'
                          : assignment.status === 'overdue'
                          ? 'bg-red-100 text-error-600'
                          : 'bg-amber-100 text-warning-600'
                      }`}
                    >
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
