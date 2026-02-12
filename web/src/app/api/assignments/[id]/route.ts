import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { z } from 'zod'

const updateAssignmentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  subject: z.string().min(1).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'overdue']).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateAssignmentSchema.parse(body)

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: params.id },
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { message: 'Assignment not found' },
        { status: 404 }
      )
    }

    const assignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update assignment:', error)
    return NextResponse.json(
      { message: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: params.id },
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { message: 'Assignment not found' },
        { status: 404 }
      )
    }

    const assignment = await prisma.assignment.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Failed to update assignment:', error)
    return NextResponse.json(
      { message: 'Failed to update assignment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: params.id },
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { message: 'Assignment not found' },
        { status: 404 }
      )
    }

    await prisma.assignment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Assignment deleted' })
  } catch (error) {
    console.error('Failed to delete assignment:', error)
    return NextResponse.json(
      { message: 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}