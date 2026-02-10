# Contributing Guide

Thank you for your interest in contributing to Assignmate! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone git@github.com:your-username/assignmate.git`
3. Install dependencies: `npm install`
4. Copy environment file: `cp .env.example .env.local`
5. Configure your environment variables
6. Run migrations: `npx prisma migrate dev`
7. Start development server: `npm run dev`

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define interfaces for all props and data structures
- Avoid using `any` type
- Use strict mode enabled

### React Components

- Use functional components with hooks
- Use proper React.FC typing
- Implement error boundaries where appropriate
- Use React.memo for expensive components

### Naming Conventions

- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `helpers.ts`)
- Constants: UPPER_SNAKE_CASE for true constants
- Files: Match the default export name

### Code Formatting

We use Prettier for code formatting:

```bash
npm run format
```

### Linting

Run ESLint before committing:

```bash
npm run lint
```

## Git Workflow

### Branch Naming

- Features: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`

### Commit Messages

Use conventional commits format:

```
<type>: <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build, dependencies, configuration

Examples:
```
feat: add calendar view for assignments
fix: resolve date formatting in dashboard
docs: update API documentation for assignments
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Push to your fork
6. Create a Pull Request to the main repository
7. Wait for code review and approval
8. Merge after approval

### Pre-Commit Checklist

- [ ] Code follows project style guidelines
- [ ] All tests passing
- [ ] No linting errors
- [ ] No console.log statements left
- [ ] No commented-out code
- [ ] TypeScript types are correct
- [ ] Component has proper PropTypes/interfaces
- [ ] Documentation updated (if needed)

## Testing

### Unit Tests

Write tests for utility functions and hooks:

```typescript
// tests/unit/helpers.test.ts
import { cn } from '@/utils/helpers'

describe('cn utility', () => {
  it('should merge classes correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })
})
```

### Integration Tests

Test critical user flows:

```typescript
// tests/integration/assignments.test.ts
import { render, screen, fireEvent } from '@testing-library/react'
import AssignmentsList from '@/components/features/assignments/AssignmentsList'

describe('AssignmentsList', () => {
  it('should render assignments', () => {
    // Test implementation
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- helpers.test.ts

# Check coverage
npm run test:coverage
```

## Component Guidelines

### Structure

```tsx
'use client' // if needed

import * as React from 'react'
import { ComponentProps } from '@/types'

/**
 * Component description
 */
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Props

- Use TypeScript interfaces for props
- Provide JSDoc comments for complex props
- Use default values where appropriate
- Destructure props in function parameters

### Styling

- Use Tailwind CSS utility classes
- Follow the project's color palette
- Use spacing values from the design system
- No inline styles (except dynamic values)

Example:
```tsx
<div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border border-gray-200 rounded-lg">
```

## Design System

### Colors

Only use colors from the design system:

- Primary: `#3B82F6`, `#1E40AF`, `#6366F1`
- Gray: `#111827`, `#374151`, `#6B7280`, `#D1D5DB`, `#F3F4F6`
- Status: `#059669` (success), `#D97706` (warning), `#DC2626` (error)

### Typography

- Headings: Inter, system fonts
- Body: 16px, line-height 1.6
- Use font size utilities: `text-sm`, `text-base`, `text-lg`, `text-xl`

### Spacing

Use 4px baseline system:
- `p-4` (16px), `p-6` (24px)
- `m-2` (8px), `m-4` (16px)
- `gap-4` (16px), `gap-6` (24px)

## Documentation

- Update README.md for major features
- Document API changes in docs/API.md
- Add JSDoc comments to functions and components
- Update DEPLOYMENT.md for infrastructure changes

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with the `question` label

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the project
- Accept responsibility and learn from mistakes

Thank you for contributing!
