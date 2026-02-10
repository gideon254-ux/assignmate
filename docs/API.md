# API Documentation

This document describes the REST API endpoints available in Assignmate.

## Base URL

```
Production: https://your-domain.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication

All API endpoints (except authentication endpoints) require a valid session. The API uses NextAuth.js session management via cookies.

## Endpoints

### Assignments

#### GET /api/assignments

Retrieve all assignments for the authenticated user.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string | null",
    "subject": "string",
    "dueDate": "ISO 8601 date string",
    "priority": "low | medium | high",
    "status": "pending | in_progress | completed | overdue",
    "userId": "string",
    "createdAt": "ISO 8601 date string",
    "updatedAt": "ISO 8601 date string"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server error

---

#### POST /api/assignments

Create a new assignment.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "subject": "string (required)",
  "dueDate": "ISO 8601 date string (required)",
  "priority": "low | medium | high (required)"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "subject": "string",
  "dueDate": "ISO 8601 date string",
  "priority": "low | medium | high",
  "status": "pending",
  "userId": "string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request data
- 401: Unauthorized
- 500: Server error

---

#### PUT /api/assignments/:id

Update an existing assignment.

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "subject": "string (optional)",
  "dueDate": "ISO 8601 date string (optional)",
  "priority": "low | medium | high (optional)",
  "status": "pending | in_progress | completed | overdue (optional)"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "subject": "string",
  "dueDate": "ISO 8601 date string",
  "priority": "low | medium | high",
  "status": "pending | in_progress | completed | overdue",
  "userId": "string",
  "createdAt": "ISO 8601 date string",
  "updatedAt": "ISO 8601 date string"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request data
- 401: Unauthorized
- 404: Assignment not found
- 500: Server error

---

#### PATCH /api/assignments/:id

Partially update an assignment (typically used for status updates).

**Request Body:**
```json
{
  "status": "pending | in_progress | completed | overdue"
}
```

**Response:** Same as PUT response

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Assignment not found
- 500: Server error

---

#### DELETE /api/assignments/:id

Delete an assignment.

**Response:**
```json
{
  "message": "Assignment deleted"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Assignment not found
- 500: Server error

---

### Authentication

Authentication is handled by NextAuth.js. See NextAuth.js documentation for details.

**Sign In:**
```
GET /api/auth/signin
```

**Sign Out:**
```
GET /api/auth/signout
```

**Session:**
```
GET /api/auth/session
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "errors": [
    {
      "path": ["field"],
      "message": "Validation message"
    }
  ]
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider implementing rate limiting at the Vercel level or using a middleware.

## Data Models

### Assignment

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (CUID) |
| title | string | Assignment title |
| description | string? | Optional description |
| subject | string | Subject/course name |
| dueDate | DateTime | Due date and time |
| priority | string | Priority level (low/medium/high) |
| status | string | Current status |
| userId | string | Owner's user ID |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Priority Levels

- `low`: Low priority assignments
- `medium`: Medium priority assignments (default)
- `high`: High priority assignments

### Status Values

- `pending`: Not started (default)
- `in_progress`: Currently working on it
- `completed`: Finished
- `overdue`: Past due date and not completed

## Testing

Use the following curl commands for testing:

```bash
# Get all assignments
curl -X GET http://localhost:3000/api/assignments \
  -H "Cookie: your-session-cookie"

# Create assignment
curl -X POST http://localhost:3000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "title": "Math Homework",
    "subject": "Mathematics",
    "dueDate": "2024-12-31T23:59:00.000Z",
    "priority": "high"
  }'

# Update assignment
curl -X PUT http://localhost:3000/api/assignments/123 \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "status": "completed"
  }'

# Delete assignment
curl -X DELETE http://localhost:3000/api/assignments/123 \
  -H "Cookie: your-session-cookie"
```
