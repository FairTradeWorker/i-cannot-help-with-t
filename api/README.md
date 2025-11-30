# 🔌 FairTradeWorker API Documentation

## Base URL

```
Production: https://your-domain.vercel.app/api
Development: http://localhost:3000/api
```

---

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Auth Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "role": "homeowner"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

#### GET `/api/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "homeowner"
}
```

#### POST `/api/auth/refresh`
Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh-token"
}
```

---

## Jobs API

### GET `/api/jobs`
List jobs with optional filters.

**Query Parameters:**
- `status` - Filter by status (posted, assigned, in_progress, completed, cancelled)
- `urgency` - Filter by urgency (normal, urgent, emergency)
- `homeownerId` - Filter by homeowner
- `contractorId` - Filter by contractor
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**
```
GET /api/jobs?status=posted&urgency=urgent&limit=20
```

### POST `/api/jobs`
Create a new job.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Roof Repair",
  "description": "Need roof fixed",
  "address": {
    "street": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zip": "78701",
    "lat": 30.2672,
    "lng": -97.7431
  },
  "urgency": "urgent",
  "scope": { ... },
  "estimatedCost": { "min": 1000, "max": 2000 },
  "laborHours": 8
}
```

### GET `/api/jobs/[id]`
Get job by ID.

### PUT `/api/jobs/[id]`
Update job (requires ownership).

**Headers:**
```
Authorization: Bearer <token>
```

### POST `/api/jobs/[id]/bids`
Create a bid on a job (contractors only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "amount": 1500,
  "message": "I can complete this in 2 days"
}
```

---

## Messages API

### GET `/api/messages?jobId=xxx`
Get messages for a job.

**Headers:**
```
Authorization: Bearer <token>
```

### POST `/api/messages`
Send a message.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "jobId": "job-id",
  "recipientId": "user-id",
  "content": "Hello, I'm interested in your job"
}
```

---

## Territories API

### GET `/api/territories`
List territories with optional filters.

**Query Parameters:**
- `zipCode` - Filter by zip code
- `ownerId` - Filter by owner
- `status` - Filter by status
- `limit` - Number of results
- `offset` - Pagination offset

### GET `/api/territories/available`
Get available (unclaimed) territories.

### POST `/api/territories/claim`
Claim a territory.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "zipCode": "78701"
}
```

---

## Notifications API

### GET `/api/notifications`
Get user notifications.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `unreadOnly` - Only unread notifications
- `limit` - Number of results
- `offset` - Pagination offset

### PATCH `/api/notifications/[id]`
Mark notification as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "read": true
}
```

---

## Users API

### GET `/api/users/[id]`
Get user by ID (public).

### PUT `/api/users/[id]`
Update user profile (requires ownership).

**Headers:**
```
Authorization: Bearer <token>
```

---

## Payments API

### POST `/api/payments/create-intent`
Create Stripe payment intent.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "amount": 500,
  "currency": "USD",
  "description": "Territory claim fee"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

---

## File Upload API

### POST `/api/upload`
Upload file (video/image).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` - The file to upload
- `type` - File type (video, image, thumbnail)

**Response:**
```json
{
  "url": "https://storage.example.com/file.jpg",
  "fileName": "video.mp4",
  "size": 1234567,
  "type": "video/mp4"
}
```

---

## Health Check

### GET `/api/health`
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "services": {
    "supabase": { "status": "up", "latency": 45 },
    "redis": { "status": "up", "latency": 12 }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

## Rate Limiting

- **Public APIs**: 100 requests / 15 minutes per IP
- **Territory Claims**: 5 claims / hour per user
- **Job Creation**: 10 jobs / hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
Retry-After: 60
```

---

## Pagination

List endpoints support pagination:

```
GET /api/jobs?limit=20&offset=40
```

Returns 20 results starting from offset 40.

---

## Caching

- **Public endpoints**: Cache-Control: `public, max-age=30, stale-while-revalidate=60`
- **Private endpoints**: Cache-Control: `private, max-age=0, must-revalidate`

---

*Complete API documentation for FairTradeWorker* 🚀

