import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { prisma } from '@/lib/database'
import { z } from 'zod'

const registerSchema = z.object({
  idToken: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idToken, name, email } = registerSchema.parse(body)
    
    // Verify the Firebase ID token (you'd need Firebase Admin SDK for this)
    // For now, we'll trust the client and create the user record
    // In production, verify the token server-side
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user in database
    // Note: In a real implementation, you'd decode the Firebase token
    // to get the firebaseUid. For now, we'll use a placeholder.
    const firebaseUid = 'temp_' + Date.now()
    
    await prisma.user.create({
      data: {
        firebaseUid,
        email,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      },
    })

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid data', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    )
  }
}