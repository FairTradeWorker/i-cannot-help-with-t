/**
 * OpenAPI/Swagger Documentation for FairTradeWorker API
 * 
 * This module defines the complete API specification following OpenAPI 3.0.1 standard.
 * It includes all endpoints, schemas, and documentation for the platform.
 */

export const openApiSpec = {
  openapi: '3.0.1',
  info: {
    title: 'FairTradeWorker API',
    version: '1.0.0',
    description: `
# FairTradeWorker API Documentation

Welcome to the FairTradeWorker API. This API provides access to the revolutionary home services marketplace platform.

## Base URL

Production: \`https://api.fairtradeworker.com/v1\`

## Authentication

All API requests require authentication using Bearer tokens:

\`\`\`
Authorization: Bearer <your_access_token>
\`\`\`

## Rate Limiting

- Standard tier: 100 requests/minute
- Professional tier: 1,000 requests/minute
- Enterprise tier: 10,000 requests/minute

## Error Handling

All errors follow RFC 7807 Problem Details format:

\`\`\`json
{
  "type": "https://api.fairtradeworker.com/errors/validation",
  "title": "Validation Error",
  "status": 400,
  "detail": "The request body contains invalid fields",
  "instance": "/v1/jobs/create"
}
\`\`\`
`,
    contact: {
      name: 'FairTradeWorker API Support',
      email: 'api-support@fairtradeworker.com',
      url: 'https://fairtradeworker.com/support',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://api.fairtradeworker.com/v1',
      description: 'Production server',
    },
    {
      url: 'https://staging-api.fairtradeworker.com/v1',
      description: 'Staging server',
    },
    {
      url: 'http://localhost:3000/v1',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication and authorization' },
    { name: 'Users', description: 'User management operations' },
    { name: 'Jobs', description: 'Job posting and management' },
    { name: 'Bids', description: 'Bid submission and management' },
    { name: 'Contractors', description: 'Contractor profiles and operations' },
    { name: 'Territories', description: 'Territory management' },
    { name: 'Payments', description: 'Payment processing' },
    { name: 'Messages', description: 'Messaging system' },
    { name: 'Notifications', description: 'Notification management' },
    { name: 'Intelligence', description: 'AI-powered intelligence APIs' },
  ],
  paths: {
    // Authentication endpoints
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user and receive access tokens',
        operationId: 'login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Successful login',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'User registration',
        description: 'Register a new user account',
        operationId: 'register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        operationId: 'refreshToken',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
                required: ['refreshToken'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'New tokens issued',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        operationId: 'logout',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/auth/password/reset': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset',
        operationId: 'requestPasswordReset',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                },
                required: ['email'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Reset email sent' },
        },
      },
    },

    // User endpoints
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        operationId: 'getCurrentUser',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update current user profile',
        operationId: 'updateCurrentUser',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated user profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },

    // Jobs endpoints
    '/jobs': {
      get: {
        tags: ['Jobs'],
        summary: 'List jobs',
        operationId: 'listJobs',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['posted', 'bidding', 'assigned', 'in_progress', 'completed'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'urgency', in: 'query', schema: { type: 'string', enum: ['normal', 'urgent', 'emergency'] } },
          { name: 'lat', in: 'query', schema: { type: 'number' } },
          { name: 'lng', in: 'query', schema: { type: 'number' } },
          { name: 'radius', in: 'query', schema: { type: 'number', description: 'Radius in miles' } },
        ],
        responses: {
          200: {
            description: 'List of jobs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Job' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Jobs'],
        summary: 'Create a new job',
        operationId: 'createJob',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateJobRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Job created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
              },
            },
          },
        },
      },
    },
    '/jobs/{jobId}': {
      get: {
        tags: ['Jobs'],
        summary: 'Get job details',
        operationId: 'getJob',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Job details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
              },
            },
          },
          404: {
            description: 'Job not found',
          },
        },
      },
      patch: {
        tags: ['Jobs'],
        summary: 'Update job',
        operationId: 'updateJob',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateJobRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Updated job',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Job' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Jobs'],
        summary: 'Delete job',
        operationId: 'deleteJob',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          204: { description: 'Job deleted' },
        },
      },
    },

    // Bids endpoints
    '/jobs/{jobId}/bids': {
      get: {
        tags: ['Bids'],
        summary: 'List bids for a job',
        operationId: 'listBids',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'List of bids',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Bid' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Bids'],
        summary: 'Submit a bid',
        operationId: 'createBid',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'jobId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBidRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Bid submitted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Bid' },
              },
            },
          },
        },
      },
    },
    '/bids/{bidId}/accept': {
      post: {
        tags: ['Bids'],
        summary: 'Accept a bid',
        operationId: 'acceptBid',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'bidId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Bid accepted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Bid' },
              },
            },
          },
        },
      },
    },

    // Contractors endpoints
    '/contractors': {
      get: {
        tags: ['Contractors'],
        summary: 'List contractors',
        operationId: 'listContractors',
        parameters: [
          { name: 'specialty', in: 'query', schema: { type: 'string' } },
          { name: 'rating', in: 'query', schema: { type: 'number', minimum: 0, maximum: 5 } },
          { name: 'verified', in: 'query', schema: { type: 'boolean' } },
          { name: 'lat', in: 'query', schema: { type: 'number' } },
          { name: 'lng', in: 'query', schema: { type: 'number' } },
          { name: 'radius', in: 'query', schema: { type: 'number' } },
        ],
        responses: {
          200: {
            description: 'List of contractors',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Contractor' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/contractors/{contractorId}': {
      get: {
        tags: ['Contractors'],
        summary: 'Get contractor profile',
        operationId: 'getContractor',
        parameters: [
          { name: 'contractorId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Contractor profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Contractor' },
              },
            },
          },
        },
      },
    },

    // Territories endpoints
    '/territories': {
      get: {
        tags: ['Territories'],
        summary: 'List territories',
        operationId: 'listTerritories',
        parameters: [
          { name: 'state', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['available', 'claimed'] } },
        ],
        responses: {
          200: {
            description: 'List of territories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Territory' },
                },
              },
            },
          },
        },
      },
    },
    '/territories/{territoryId}/claim': {
      post: {
        tags: ['Territories'],
        summary: 'Claim a territory',
        operationId: 'claimTerritory',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'territoryId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Territory claimed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Territory' },
              },
            },
          },
        },
      },
    },

    // Payments endpoints
    '/payments': {
      get: {
        tags: ['Payments'],
        summary: 'List payment history',
        operationId: 'listPayments',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Payment history',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Payment' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Payments'],
        summary: 'Create a payment',
        operationId: 'createPayment',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePaymentRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Payment created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Payment' },
              },
            },
          },
        },
      },
    },

    // Intelligence API endpoints
    '/intelligence/job-scope': {
      post: {
        tags: ['Intelligence'],
        summary: 'AI Job Scope Generation',
        description: 'Analyze video/image to generate detailed job scope',
        operationId: 'generateJobScope',
        security: [{ bearerAuth: [], apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JobScopeRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Generated job scope',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/JobScopeResponse' },
              },
            },
          },
        },
      },
    },
    '/intelligence/instant-quote': {
      post: {
        tags: ['Intelligence'],
        summary: 'Instant Quote Generation',
        description: 'Get instant price estimates for jobs',
        operationId: 'getInstantQuote',
        security: [{ bearerAuth: [], apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/QuoteRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Price estimate',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/QuoteResponse' },
              },
            },
          },
        },
      },
    },
    '/intelligence/contractor-match': {
      post: {
        tags: ['Intelligence'],
        summary: 'Contractor Matching',
        description: 'Find best-matched contractors for a job',
        operationId: 'matchContractors',
        security: [{ bearerAuth: [], apiKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContractorMatchRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Matched contractors',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ContractorMatchResponse' },
              },
            },
          },
        },
      },
    },
    '/intelligence/demand-heatmap': {
      get: {
        tags: ['Intelligence'],
        summary: 'Demand Heatmap',
        description: 'Get demand heatmap data for a region',
        operationId: 'getDemandHeatmap',
        security: [{ bearerAuth: [], apiKey: [] }],
        parameters: [
          { name: 'region', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Heatmap data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HeatmapResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      // Auth schemas
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          remember: { type: 'boolean' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password', 'name', 'role'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string', minLength: 2 },
          role: { type: 'string', enum: ['homeowner', 'contractor', 'subcontractor', 'operator'] },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresAt: { type: 'integer' },
        },
      },

      // User schemas
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['homeowner', 'contractor', 'subcontractor', 'operator', 'admin'] },
          avatar: { type: 'string', format: 'uri' },
          emailVerified: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          avatar: { type: 'string', format: 'uri' },
          phone: { type: 'string' },
        },
      },

      // Job schemas
      Job: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          urgency: { type: 'string', enum: ['normal', 'urgent', 'emergency'] },
          status: { type: 'string', enum: ['draft', 'posted', 'bidding', 'assigned', 'in_progress', 'completed', 'cancelled'] },
          address: { $ref: '#/components/schemas/Address' },
          estimatedCost: {
            type: 'object',
            properties: {
              min: { type: 'number' },
              max: { type: 'number' },
            },
          },
          laborHours: { type: 'number' },
          materials: { type: 'array', items: { type: 'string' } },
          scope: { type: 'array', items: { type: 'string' } },
          photos: { type: 'array', items: { type: 'string', format: 'uri' } },
          homeownerId: { type: 'string' },
          assignedContractorId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateJobRequest: {
        type: 'object',
        required: ['title', 'description', 'category', 'address'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          urgency: { type: 'string', enum: ['normal', 'urgent', 'emergency'] },
          address: { $ref: '#/components/schemas/Address' },
          photos: { type: 'array', items: { type: 'string', format: 'uri' } },
        },
      },
      UpdateJobRequest: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
        },
      },
      Address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          zip: { type: 'string' },
          country: { type: 'string', default: 'US' },
        },
      },

      // Bid schemas
      Bid: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          jobId: { type: 'string' },
          contractorId: { type: 'string' },
          amount: { type: 'number' },
          message: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'accepted', 'rejected', 'withdrawn'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateBidRequest: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'number', minimum: 0 },
          message: { type: 'string' },
        },
      },

      // Contractor schemas
      Contractor: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          name: { type: 'string' },
          specialties: { type: 'array', items: { type: 'string' } },
          rating: { type: 'number', minimum: 0, maximum: 5 },
          completedJobs: { type: 'integer' },
          verified: { type: 'boolean' },
          serviceRadius: { type: 'number' },
          hourlyRate: { type: 'number' },
          availability: { type: 'string', enum: ['available', 'busy', 'unavailable'] },
        },
      },

      // Territory schemas
      Territory: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          state: { type: 'string' },
          zipCodes: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['available', 'claimed'] },
          price: { type: 'number' },
          operatorId: { type: 'string' },
        },
      },

      // Payment schemas
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          jobId: { type: 'string' },
          amount: { type: 'number' },
          platformFee: { type: 'number' },
          netAmount: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'in_escrow', 'released'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePaymentRequest: {
        type: 'object',
        required: ['jobId', 'amount', 'paymentMethodId'],
        properties: {
          jobId: { type: 'string' },
          amount: { type: 'number' },
          paymentMethodId: { type: 'string' },
        },
      },

      // Intelligence API schemas
      JobScopeRequest: {
        type: 'object',
        required: ['media'],
        properties: {
          media: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['video', 'image'] },
              url: { type: 'string', format: 'uri' },
              base64: { type: 'string' },
            },
          },
          context: { type: 'string' },
        },
      },
      JobScopeResponse: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          category: { type: 'string' },
          description: { type: 'string' },
          scope: { type: 'array', items: { type: 'string' } },
          materials: { type: 'array', items: { type: 'string' } },
          estimatedHours: { type: 'number' },
          estimatedCost: {
            type: 'object',
            properties: {
              min: { type: 'number' },
              max: { type: 'number' },
            },
          },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
      QuoteRequest: {
        type: 'object',
        required: ['category', 'location'],
        properties: {
          category: { type: 'string' },
          location: { type: 'string' },
          description: { type: 'string' },
        },
      },
      QuoteResponse: {
        type: 'object',
        properties: {
          estimatedCost: {
            type: 'object',
            properties: {
              min: { type: 'number' },
              max: { type: 'number' },
            },
          },
          laborHours: { type: 'number' },
          materials: { type: 'array', items: { type: 'string' } },
          confidence: { type: 'number' },
        },
      },
      ContractorMatchRequest: {
        type: 'object',
        required: ['jobId'],
        properties: {
          jobId: { type: 'string' },
          limit: { type: 'integer', default: 10 },
        },
      },
      ContractorMatchResponse: {
        type: 'object',
        properties: {
          matches: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                contractor: { $ref: '#/components/schemas/Contractor' },
                matchScore: { type: 'number', minimum: 0, maximum: 1 },
                reasons: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
      HeatmapResponse: {
        type: 'object',
        properties: {
          region: { type: 'string' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' },
                intensity: { type: 'number' },
              },
            },
          },
        },
      },

      // Common schemas
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          type: { type: 'string', format: 'uri' },
          title: { type: 'string' },
          status: { type: 'integer' },
          detail: { type: 'string' },
          instance: { type: 'string' },
        },
      },
    },
  },
};

/**
 * Get the OpenAPI specification as JSON string
 */
export function getOpenApiJson(): string {
  return JSON.stringify(openApiSpec, null, 2);
}

/**
 * Get the OpenAPI specification object
 */
export function getOpenApiSpec(): typeof openApiSpec {
  return openApiSpec;
}

export default openApiSpec;
