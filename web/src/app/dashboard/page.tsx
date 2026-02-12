'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/common/Card'
import { useAssignments } from '@/hooks/useAssignments'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import { FileText, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { assignments, loading: assignmentsLoading } = useAssignments()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Calculate stats
  const stats = {
    total: assignments.length,
    completed: assignments.filter((a) => a.status === 'completed').length,
    pending: assignments.filter(
      (a) => ['pending', 'in_progress'].includes(a.status) && new Date(a.dueDate) >= new Date()
    ).length,
    overdue: assignments.filter((a) => a.status !== 'completed' && new Date(a.dueDate) < new Date())
      .length,
  }

  const upcomingAssignments = assignments
    .filter(
      (a) => ['pending', 'in_progress'].includes(a.status) && new Date(a.dueDate) >= new Date()
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const recentAssignments = [...assignments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const statCards = [
    {
      title: 'Total Assignments',
      value: stats.total,
      icon: FileText,
      color: 'text-primary-700',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  if (authLoading || assignmentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary-600 h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header title="Dashboard" description="Overview of your assignments and progress" />

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
              {upcomingAssignments.length === 0 ? (
                <p className="text-gray-500">No upcoming assignments</p>
              ) : (
                upcomingAssignments.map((assignment) => (
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
              {recentAssignments.length === 0 ? (
                <p className="text-gray-500">No recent activity</p>
              ) : (
                recentAssignments.map((assignment) => (
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
                          ? 'bg-green-100 text-green-700'
                          : assignment.status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
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
