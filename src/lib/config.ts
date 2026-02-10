export const config = {
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000/api',
  databaseUrl: process.env.DATABASE_URL || '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
}
