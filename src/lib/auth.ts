import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './database'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const authConfig = NextAuth({
  secret: "M+lB+F9W4BF0X0aETvXtUZlWvpjH+nLdZqiGretaf+A=",
  trustHost: true,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentialsSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session?.user && token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/api/auth/error',
  },
})

export const handlers = authConfig.handlers
export const auth = authConfig.auth
export const signIn = authConfig.signIn
export const signOut = authConfig.signOut
