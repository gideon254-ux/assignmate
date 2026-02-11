import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')
  
  // Redirect to login with error message
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error)}`)
  }
  
  redirect('/login')
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')
  
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error)}`)
  }
  
  redirect('/login')
}
