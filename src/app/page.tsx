import Link from 'next/link'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { APP_NAME, APP_DESCRIPTION } from '@/utils/constants'
import { CheckCircle, Calendar, Bell, LayoutDashboard } from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Organize Assignments',
      description: 'Keep all your assignments in one place with easy categorization by subject and priority.',
    },
    {
      icon: Calendar,
      title: 'Track Deadlines',
      description: 'Never miss a deadline with our calendar view and due date reminders.',
    },
    {
      icon: Bell,
      title: 'Get Notified',
      description: 'Receive notifications for upcoming deadlines and overdue assignments.',
    },
    {
      icon: CheckCircle,
      title: 'Track Progress',
      description: 'Monitor your completion status and stay on top of your workload.',
    },
  ]

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to {APP_NAME}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {APP_DESCRIPTION}. Manage your academic workload efficiently and never miss a deadline again.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/api/auth/signin">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Features</h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to stay organized and succeed in your studies.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <feature.icon className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join thousands of students who use {APP_NAME} to stay organized and achieve their academic goals.
          </p>
          <div className="mt-8">
            <Link href="/api/auth/signin">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
