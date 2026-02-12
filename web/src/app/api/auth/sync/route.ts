import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, name } = await request.json()

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    })

    if (!user) {
      // Check if user exists with this email
      user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            firebaseUid,
            email,
            name: name || email.split('@')[0],
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
          },
        })
      } else {
        // Update existing user with firebaseUid
        user = await prisma.user.update({
          where: { email },
          data: {
            firebaseUid,
            lastLoginAt: new Date(),
          },
        })
      }
    } else {
      // Update last login
      user = await prisma.user.update({
        where: { firebaseUid },
        data: {
          lastLoginAt: new Date(),
        },
      })
    }

    return NextResponse.json({
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      image: user.image,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { message: 'Failed to sync user' },
      { status: 500 }
    )
  }
}