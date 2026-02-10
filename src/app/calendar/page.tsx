import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/common/Card'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

async function getCalendarData(userId: string, currentDate: Date) {
  const start = startOfMonth(currentDate)
  const end = endOfMonth(currentDate)

  const assignments = await prisma.assignment.findMany({
    where: {
      userId,
      dueDate: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { dueDate: 'asc' },
  })

  return assignments
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  const currentMonth = searchParams.month
    ? parseInt(searchParams.month)
    : new Date().getMonth()
  const currentYear = searchParams.year
    ? parseInt(searchParams.year)
    : new Date().getFullYear()

  const currentDate = new Date(currentYear, currentMonth, 1)
  const assignments = await getCalendarData(session.user.id, currentDate)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = subMonths(currentDate, 1)
  const nextMonth = addMonths(currentDate, 1)

  const getDayAssignments = (day: Date) => {
    return assignments.filter((assignment) =>
      isSameDay(new Date(assignment.dueDate), day)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header
          title="Calendar"
          description="View your assignments by due date"
        />

        <Card className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <Link
                href={`/calendar?month=${prevMonth.getMonth()}&year=${prevMonth.getFullYear()}`}
                className="rounded p-2 text-gray-600 hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <Link
                href={`/calendar?month=${nextMonth.getMonth()}&year=${nextMonth.getFullYear()}`}
                className="rounded p-2 text-gray-600 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-700"
              >
                {day}
              </div>
            ))}

            {days.map((day) => {
              const dayAssignments = getDayAssignments(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] bg-white p-2 ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  }`}
                >
                  <div
                    className={`text-sm font-medium ${
                      isToday
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayAssignments.map((assignment) => (
                      <Link
                        key={assignment.id}
                        href="/assignments"
                        className={`block truncate rounded px-2 py-1 text-xs ${
                          assignment.status === 'completed'
                            ? 'bg-green-100 text-success-600'
                            : assignment.status === 'overdue'
                            ? 'bg-red-100 text-error-600'
                            : 'bg-primary-50 text-primary-700'
                        }`}
                      >
                        {assignment.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
