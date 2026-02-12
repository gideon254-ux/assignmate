# Assignmate

A student assignment organizer application that helps students manage their academic workload efficiently. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Assignment Management**: Create, read, update, and delete assignments
- **Dashboard Overview**: Visual statistics and recent activity tracking
- **Calendar View**: Monthly calendar with assignment deadlines
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Status Tracking**: Track pending, in-progress, completed, and overdue assignments
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Google Authentication**: Secure login with Google OAuth
- **Real-time Updates**: Instant updates across all views

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google Provider
- **Deployment**: Vercel
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone git@github.com:username/assignmate.git
cd assignmate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret key
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

5. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

7. Visit: http://localhost:3000

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

Check test coverage:
```bash
npm run test:coverage
```

## Project Structure

```
assignmate/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── prisma/
│   └── schema.prisma           # Database schema
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── assignments/       # Assignments page
│   │   ├── calendar/          # Calendar page
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── common/            # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   └── features/          # Feature-specific components
│   ├── lib/                   # Library configurations
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── tests/
│   ├── unit/                  # Unit tests
│   └── integration/           # Integration tests
├── docs/                      # Documentation
├── .env.example               # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

## API Documentation

See [API.md](docs/API.md) for API endpoint documentation.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## License

MIT
