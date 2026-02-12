import { useEffect, useState } from 'react'
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface AdminUser {
  id: string
  email: string
  name: string
  createdAt: Date
  lastLoginAt: Date
  isAdmin: boolean
  assignmentCount: number
}

export interface AppStats {
  totalUsers: number
  totalAssignments: number
  assignmentsByStatus: Record<string, number>
  assignmentsByPriority: Record<string, number>
  recentUsers: AdminUser[]
  activeUsersToday: number
}

interface UseAdminAnalyticsReturn {
  users: AdminUser[]
  stats: AppStats | null
  loading: boolean
  error: Error | null
  toggleAdminStatus: (userId: string, isAdmin: boolean) => Promise<void>
  refreshStats: () => Promise<void>
}

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AppStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Real-time users subscription
  useEffect(() => {
    setLoading(true)

    const q = query(collection(db, 'users'))

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const usersData: AdminUser[] = []

        for (const userDoc of snapshot.docs) {
          const data = userDoc.data()

          // Get assignment count for each user
          const assignmentsQuery = query(
            collection(db, 'assignments'),
            where('userId', '==', userDoc.id)
          )
          const assignmentsSnapshot = await getDocs(assignmentsQuery)

          usersData.push({
            id: userDoc.id,
            email: data.email,
            name: data.name,
            createdAt: data.createdAt?.toDate() || new Date(),
            lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
            isAdmin: data.isAdmin || false,
            assignmentCount: assignmentsSnapshot.size,
          })
        }

        setUsers(usersData)
        await calculateStats(usersData)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error fetching admin data:', err)
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const calculateStats = async (usersData: AdminUser[]) => {
    try {
      // Get all assignments
      const assignmentsSnapshot = await getDocs(collection(db, 'assignments'))
      const assignments = assignmentsSnapshot.docs.map((doc) => doc.data())

      // Calculate stats
      const assignmentsByStatus: Record<string, number> = {}
      const assignmentsByPriority: Record<string, number> = {}

      assignments.forEach((assignment) => {
        assignmentsByStatus[assignment.status] = (assignmentsByStatus[assignment.status] || 0) + 1
        assignmentsByPriority[assignment.priority] =
          (assignmentsByPriority[assignment.priority] || 0) + 1
      })

      // Active users today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const activeUsersToday = usersData.filter((u) => u.lastLoginAt >= today).length

      setStats({
        totalUsers: usersData.length,
        totalAssignments: assignments.length,
        assignmentsByStatus,
        assignmentsByPriority,
        recentUsers: usersData
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 10),
        activeUsersToday,
      })
    } catch (err) {
      console.error('Error calculating stats:', err)
    }
  }

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    await updateDoc(doc(db, 'users', userId), { isAdmin })
  }

  const refreshStats = async () => {
    await calculateStats(users)
  }

  return {
    users,
    stats,
    loading,
    error,
    toggleAdminStatus,
    refreshStats,
  }
}
