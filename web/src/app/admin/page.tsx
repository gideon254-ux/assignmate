'use client'

import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useAdminAnalytics, AdminUser } from '@/hooks/useAdminAnalytics'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import {
  Users,
  FileText,
  Activity,
  Shield,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { redirect } from 'next/navigation'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { users, stats, loading, error, toggleAdminStatus, refreshStats } = useAdminAnalytics()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  // Redirect non-admin users
  if (!loading && (!user || !user.isAdmin)) {
    redirect('/dashboard')
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string
    value: number
    icon: any
    color: string
  }) => (
    <Card className="flex items-center gap-4">
      <div className={`rounded-lg p-3 ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary-200 border-t-primary-600 mb-4 h-12 w-12 animate-spin rounded-full border-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error loading admin data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor app usage and manage users</p>
        </div>
        <Button onClick={refreshStats} variant="secondary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
          <StatCard
            title="Total Assignments"
            value={stats.totalAssignments}
            icon={FileText}
            color="bg-green-500"
          />
          <StatCard
            title="Active Today"
            value={stats.activeUsersToday}
            icon={Activity}
            color="bg-orange-500"
          />
          <StatCard
            title="Admin Users"
            value={users.filter((u) => u.isAdmin).length}
            icon={Shield}
            color="bg-purple-500"
          />
        </div>
      )}

      {/* Assignment Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Assignments by Status</h3>
            <div className="space-y-2">
              {Object.entries(stats.assignmentsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-gray-600">{status.replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Assignments by Priority</h3>
            <div className="space-y-2">
              {Object.entries(stats.assignmentsByPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <span className="capitalize text-gray-600">{priority}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <div className="mb-4 flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-primary-200 w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Created</th>
                <th className="pb-3 font-medium">Last Login</th>
                <th className="pb-3 font-medium">Assignments</th>
                <th className="pb-3 font-medium">Admin</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((userData) => (
                <>
                  <tr key={userData.id} className="group">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{userData.name}</p>
                        <p className="text-sm text-gray-500">{userData.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {format(userData.createdAt, 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {format(userData.lastLoginAt, 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="py-3 text-sm text-gray-600">{userData.assignmentCount}</td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleAdminStatus(userData.id, !userData.isAdmin)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          userData.isAdmin
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        disabled={userData.id === user?.id}
                      >
                        {userData.isAdmin ? 'Admin' : 'User'}
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          setExpandedUser(expandedUser === userData.id ? null : userData.id)
                        }
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        {expandedUser === userData.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedUser === userData.id && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 px-4 py-3">
                        <div className="text-sm text-gray-600">
                          <p>
                            <strong>User ID:</strong> {userData.id}
                          </p>
                          <p>
                            <strong>Total Assignments:</strong> {userData.assignmentCount}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
