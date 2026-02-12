import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { z } from 'zod'

const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  dueDate: z.string().datetime(),
  priority: z.enum(['low', 'medium', 'high']),
  userId: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const assignments = await prisma.assignment.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
    return NextResponse.json(
      { message: 'Failed to fetch assignments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAssignmentSchema.parse(body)

    const assignment = await prisma.assignment.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        subject: validatedData.subject,
        dueDate: new Date(validatedData.dueDate),
        priority: validatedData.priority,
        status: 'pending',
        userId: validatedData.userId,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create assignment:', error)
    return NextResponse.json(
      { message: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}