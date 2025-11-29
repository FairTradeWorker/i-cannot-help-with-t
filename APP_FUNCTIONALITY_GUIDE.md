# Complete App Functionality Guide

This document describes how every part of the FairTradeWorker application functions, from user authentication to job completion.

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [User Authentication & Profiles](#user-authentication--profiles)
3. [Job Creation & Management](#job-creation--management)
4. [Territory System](#territory-system)
5. [Payment & Billing](#payment--billing)
6. [Messaging System](#messaging-system)
7. [Analytics & Reporting](#analytics--reporting)
8. [API Integration](#api-integration)
9. [State Management](#state-management)
10. [Data Flow](#data-flow)

---

## Core Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript 5.7
- **Build Tool**: Vite 6.4
- **Styling**: Tailwind CSS 4.1
- **UI Components**: shadcn/ui v4 (40+ components)
- **State**: React Hooks + Spark KV (persistent storage)
- **Maps**: react-simple-maps (React 19 compatible)
- **Animations**: Framer Motion 12
- **Icons**: Phosphor Icons

### Application Structure
```
src/
├── App.tsx                 # Main app router & navigation
├── components/             # All React components (160+ files)
│   ├── ui/                # shadcn/ui base components
│   ├── HomeownerDashboard.tsx
│   ├── ContractorDashboard.tsx
│   ├── OperatorDashboard.tsx
│   ├── JobBrowser.tsx
│   ├── TerritoryMapPage.tsx
│   └── ...
├── lib/                    # Utilities & services
│   ├── store.ts           # Data persistence (Spark KV)
│   ├── types.ts           # TypeScript definitions
│   ├── ai-service.ts      # AI/ML integration
│   ├── territory-pricing.ts
│   └── ...
└── pages/                  # Page components
    └── First300Page.tsx
```

### Navigation System
The app uses a tab-based navigation system in `App.tsx`:
- **Home** - Main dashboard
- **Territories** - Territory map & claiming
- **Jobs** - Job browser & posting
- **Contractors** - Browse contractors
- **Messages** - In-app messaging
- **Payment** - Payment management
- **Notifications** - System notifications
- **First 300 Launch** - First Priority launch page

---

## User Authentication & Profiles

### User Types
1. **Homeowner** - Posts jobs, pays contractors
2. **Contractor** - Bids on jobs, completes work
3. **Subcontractor** - Specialized trades (plumbing, electrical, etc.)
4. **General Contractor** - Manages multi-trade projects
5. **Territory Operator** - Owns territory, recruits contractors
6. **Admin** - Platform administration

### Authentication Flow
1. User signs up with email/password
2. Selects user type (Homeowner, Contractor, etc.)
3. Profile creation:
   - **Homeowners**: Basic info, address
   - **Contractors**: Licenses, insurance, service areas, specialties
   - **Operators**: Business info, tax ID (if LLC/Corp)
4. Profile stored in `window.spark.kv` (or Supabase KV proxy)
5. Current user session maintained in `dataStore`

### Profile Management
- **Component**: `UserProfile.tsx`
- **Storage**: `src/lib/store.ts` - `DataStore` class
- **Keys**: 
  - `current-user` - Active session
  - `users` - All users array
- **Features**:
  - Edit profile information
  - Upload profile photos
  - Manage licenses & insurance
  - Update service areas
  - View ratings & reviews

---

## Job Creation & Management

### Job Creation Methods

#### 1. Video Job Creation (60 seconds)
**Component**: `VideoJobCreator.tsx`

**Flow:**
1. User records 60-second video
2. Video uploaded to storage
3. AI extracts middle frame (keyframe)
4. GPT-4 Vision analyzes frame:
   - Damage type identification
   - Location detection
   - Urgency assessment
5. AI generates scope:
   - Materials list with quantities
   - Labor hours estimate
   - Cost range (min/max)
   - Confidence score (85%+)
6. User reviews and edits scope
7. Selects service category (60 options)
8. Sets urgency level
9. Job published to platform

**Storage:**
- Video URL stored in job
- Thumbnail generated from frame
- Scope stored as JSON
- `predictionId` tracks AI prediction

#### 2. Photo Job Creation
**Component**: `PhotoJobPost.tsx`

**Flow:**
1. User uploads photos
2. AI analyzes all photos
3. Generates scope (same as video)
4. User reviews and publishes

#### 3. Text Job Creation
**Component**: `TextJobPost.tsx`

**Flow:**
1. User enters job description
2. AI analyzes text description
3. Generates scope
4. User reviews and publishes

### Job Data Structure
```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  status: 'posted' | 'bidding' | 'in_progress' | 'completed' | 'cancelled';
  homeownerId: string;
  contractorId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
  };
  videoUrl?: string;
  thumbnailUrl?: string;
  scope?: JobScope;
  estimatedCost?: { min: number; max: number };
  laborHours?: number;
  predictionId?: string;        // For learning loop
  actualCost?: number;          // Final cost
  actualLaborHours?: number;    // Actual hours
  actualMaterials?: Material[]; // Actual materials used
  feedbackCollected?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Job Browser
**Component**: `JobBrowser.tsx`

**Features:**
- Filter by service type, location, budget, urgency
- Map view & list view
- Sort by distance, budget, urgency
- Real-time updates (polls every 5 seconds)
- Click job card to view details

### Job Details
**Component**: `JobDetails.tsx`

**Displays:**
- Full job information
- AI-generated scope
- Video/photo gallery
- Contractor bids
- Messages thread
- Payment status
- Rating & review

### Job Status Flow
1. **Posted** - Job is live, accepting bids
2. **Bidding** - Contractors submitting bids
3. **In Progress** - Contractor accepted, work started
4. **Completed** - Work finished, awaiting payment
5. **Cancelled** - Job cancelled by homeowner

---

## Territory System

### Territory Claiming

#### First 300 System
**Components**: 
- `First300Page.tsx` - Launch page
- `First300Counter.tsx` - Live countdown
- `First300Map.tsx` - Claimed territories map
- `RealTimeTerritoryMap.tsx` - Interactive map

**Flow:**
1. User navigates to Territories page
2. Views live countdown (e.g., "247 SPOTS LEFT NATIONWIDE")
3. Browses available territories on map
4. Clicks zip code to claim
5. Modal opens with territory details
6. User enters entity information:
   - Entity Type (Individual, LLC, Corporation)
   - Email
   - Tax ID (if LLC/Corp)
7. System validates:
   - One claim per entity (hash-based validation)
   - Territory availability
   - Rate limiting (5 claims/hour)
8. Pricing determined:
   - **First 300**: FREE forever
   - **After First 300**: $500 one-time + $20/month
9. Claim processed:
   - If free: Immediate claim
   - If paid: Stripe checkout initiated
10. Territory activated
11. Countdown decrements
12. Map updates in real-time

**Storage:**
- Count: `first-300-count` in Spark KV
- Claims: `first-300-claims` array
- Ownership: `territory-ownership` hash map

### Territory Pricing Logic
**File**: `src/lib/territory-pricing.ts`

```typescript
// Check if user qualifies for First 300
const pricing = await getTerritoryPricing(entityType, email, userId, taxId);

if (pricing.isFirst300) {
  // FREE forever
  // Decrement count
  // Record claim
} else {
  // $500 + $20/month
  // Initiate Stripe checkout
  // Create subscription
}
```

### Territory Map Features
- **Real-time updates** (5-second polling)
- **Color coding**: Green (available), Red (taken), Blue (yours)
- **GeoJSON boundaries** (when available)
- **Click to claim** modal
- **Search & filter** by state/zip/city
- **Stats cards**: Total, Available, Your Territories
- **Recent claims** indicator

---

## Payment & Billing

### Payment Flow

#### For Homeowners
1. Homeowner posts job: **$20 platform fee**
2. Selects contractor
3. Chooses payment option:
   - **Full Payment** - Pay total upfront
   - **3-Month Installments** - 2% processing fee
   - **12-Month 0% Financing** - Qualified buyers only
4. Payment processed via Stripe
5. Funds held in escrow
6. After job completion, homeowner approves
7. Payment released to contractor
8. Contractor receives 100% (zero fees)

#### For Contractors
- **Zero platform fees**
- Receive 100% of job amount
- Instant payouts after job approval
- Payment history tracking

#### For Territory Operators
- **Zero fees** (they BUILD the network)
- First 300: FREE forever
- After First 300: $500 one-time + $20/month
- If subscription lapses: Downgrade to Second Priority

### Payment Components
- `PaymentScreen.tsx` - Payment interface
- `PaymentModal.tsx` - Payment dialog
- `PaymentManagement.tsx` - Payment history

### Stripe Integration
**File**: `src/lib/stripe-subscription.ts` (placeholder)

**Features:**
- One-time payment for territory claim ($500)
- Recurring subscription ($20/month)
- Subscription status checking
- Automatic downgrade on lapse

---

## Messaging System

### In-App Messaging
**Component**: `MessagesView.tsx`

**Features:**
- Real-time chat between homeowners and contractors
- Conversation history per job
- Read receipts
- Online status indicators
- Photo attachments
- Timestamps
- Unread message badges

**Storage:**
- Messages stored in `messages` array
- Keyed by job ID: `messages-${jobId}`
- Real-time updates (polling every 2 seconds)

### Notifications
**Component**: `NotificationsPage.tsx`

**Notification Types:**
- New job matches
- Bid updates
- New messages
- Job status changes
- Payment confirmations
- System announcements

**Storage:**
- Notifications stored in `notifications` array
- Marked as read/unread
- Timestamped

---

## Analytics & Reporting

### For Homeowners
- Job history
- Spending analysis
- Contractor ratings given
- Project timelines

### For Contractors
**Component**: `ContractorDashboard.tsx`

- Earnings dashboard (total, available, pending)
- Job statistics (completed, win rate, average bid)
- Performance metrics (response time, completion rate)
- Rating trends
- Territory revenue analysis

### For Territory Operators
**Component**: `OperatorDashboard.tsx`

- Territory analytics
- Contractor network size
- Job volume per territory
- Revenue tracking (8% share from all jobs)
- Growth metrics
- Portfolio value

### For Admins
**Component**: `AdminDashboard.tsx`

- Platform-wide analytics
- User growth
- Job completion rates
- Top states/services
- Revenue by month
- AI learning metrics

---

## API Integration

### Intelligence APIs
**Components**: `IntelligenceAPIMarketplace.tsx`, `APIPage.tsx`

**Available APIs:**
1. **AI Scope API** - $2,499/mo (ENTERPRISE)
2. **Instant Quote API** - $499/mo
3. **Contractor Match API** - $299/mo
4. **Demand Heatmap API** - $199/mo
5. **34 Premium APIs** - Unlock May 27, 2026

**Features:**
- API key generation & management
- Usage tracking per endpoint
- Rate limiting by tier
- Learning dashboard (accuracy metrics)
- Documentation browser

**File**: `src/lib/intelligence-db.ts`

### Route Optimization API
**Component**: `RouteOptimizer.tsx`

**Integration:**
- Trueway Routing API
- Multi-stop route optimization
- Cost calculations
- Turn-by-turn directions

**File**: `src/lib/routing-api.ts`

---

## State Management

### Data Storage
**File**: `src/lib/store.ts`

**Storage Backend:**
- **Primary**: Spark KV (`window.spark.kv`)
- **Fallback**: Supabase KV Proxy (`/api/spark/kv/{key}`)
- **Development**: localStorage (if both fail)

**Key Structure:**
- `current-user` - Active user session
- `users` - All users array
- `jobs` - All jobs array
- `territories` - Territory data
- `messages-${jobId}` - Messages per job
- `notifications` - All notifications
- `first-300-count` - First 300 countdown
- `first-300-claims` - First 300 claims array

### DataStore Class
```typescript
class DataStore {
  // Users
  async getCurrentUser(): Promise<User | null>
  async setCurrentUser(user: User): Promise<void>
  async getUsers(): Promise<User[]>
  async saveUser(user: User): Promise<void>
  
  // Jobs
  async getJobs(): Promise<Job[]>
  async getJobById(id: string): Promise<Job | null>
  async saveJob(job: Job): Promise<void>
  
  // Territories
  async getTerritories(): Promise<Territory[]>
  async getTerritoryById(id: string): Promise<Territory | null>
  
  // Messages
  async getMessages(jobId: string): Promise<Message[]>
  async sendMessage(message: Message): Promise<void>
  
  // Notifications
  async getNotifications(userId: string): Promise<Notification[]>
  async markNotificationRead(id: string): Promise<void>
}
```

### React State
- **Local State**: `useState` for component-level state
- **Shared State**: Props drilling or Context (where needed)
- **Persistent State**: DataStore (Spark KV/Supabase)
- **Cache**: SWR hooks (see `src/lib/cache.ts`)

---

## Data Flow

### Job Creation Flow
```
User → VideoJobCreator
  ↓
Video Upload → AI Service
  ↓
GPT-4 Vision Analysis → Scope Generation
  ↓
User Review & Edit → Job Creation
  ↓
DataStore.saveJob() → Spark KV/Supabase
  ↓
Job appears in JobBrowser
```

### Territory Claim Flow
```
User → TerritoryMapPage
  ↓
Click Zip Code → Claim Modal
  ↓
Entity Validation → Territory Pricing
  ↓
Rate Limit Check → Process Claim
  ↓
If First 300: FREE claim
  ↓
If After 300: Stripe Checkout
  ↓
Record Ownership → Update Map
  ↓
Decrement First 300 Count
```

### Payment Flow
```
Homeowner → Select Contractor
  ↓
Payment Modal → Select Payment Option
  ↓
Stripe Checkout → Payment Processing
  ↓
Funds in Escrow → Job Completion
  ↓
Homeowner Approval → Payment Release
  ↓
Contractor Receives 100% (Zero Fees)
```

### AI Learning Loop
```
Job Created → AI Prediction (predictionId)
  ↓
Contractor Completes Job → Feedback Form
  ↓
Record Actual vs Predicted → Learning Database
  ↓
Calculate Accuracy → Update AI Model
  ↓
Next Prediction Uses Improved Model
```

---

## Key Files Reference

### Core Components
- `App.tsx` - Main router & navigation
- `HomeownerDashboard.tsx` - Homeowner interface
- `ContractorDashboard.tsx` - Contractor interface
- `OperatorDashboard.tsx` - Territory operator interface
- `JobBrowser.tsx` - Browse & filter jobs
- `TerritoryMapPage.tsx` - Territory map & claiming
- `MessagesView.tsx` - In-app messaging
- `PaymentScreen.tsx` - Payment interface

### Core Services
- `src/lib/store.ts` - Data persistence
- `src/lib/ai-service.ts` - AI/ML integration
- `src/lib/territory-pricing.ts` - Territory pricing logic
- `src/lib/territory-validation.ts` - Claim validation
- `src/lib/first300.ts` - First 300 system
- `src/lib/routing-api.ts` - Route optimization
- `src/lib/intelligence-db.ts` - API key management

### Types & Interfaces
- `src/lib/types.ts` - All TypeScript definitions
- `src/types/intelligence-api.ts` - API types

---

## Environment Variables

Required for full functionality:

```bash
# Supabase (for KV storage)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Upstash Redis (for rate limiting)
VITE_UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
VITE_UPSTASH_REDIS_REST_TOKEN=xxx

# Sentry (for monitoring)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# Trueway Routing API
VITE_TRUEWAY_API_KEY=xxx

# Stripe (for payments)
VITE_STRIPE_PUBLIC_KEY=xxx

# KV Proxy Toggle
VITE_USE_KV_PROXY=true
```

---

## Error Handling

### Error Boundaries
- **Component**: `ErrorBoundary.tsx`
- Wraps entire app in `App.tsx`
- Catches React errors gracefully
- Shows user-friendly error UI

### Try-Catch Blocks
- All async operations wrapped in try-catch
- Errors logged to console
- User-friendly error messages via toast notifications
- Sentry integration for production error tracking

### Fallback Behavior
- Rate limiting: Fail open (allow request if Redis down)
- KV storage: Fallback to localStorage
- API calls: Show error message, allow retry

---

## Performance Optimizations

### Code Splitting
- Lazy-loaded components
- Route-based splitting
- Dynamic imports

### Caching
- SWR for API responses
- Cache-Control headers
- LocalStorage for offline access

### Database
- Indexes on all query fields
- Composite indexes for common queries
- Connection pooling (Supabase handles this)

### Asset Optimization
- Image compression
- Lazy-loaded GeoJSON by state
- Code minification & tree-shaking

---

## Security Features

### Input Validation
- All user inputs sanitized
- Type checking with TypeScript
- Zod validation schemas

### Authentication
- Session management
- Secure token storage
- Rate limiting on auth endpoints

### API Security
- Rate limiting (100 req/15min per IP)
- API key authentication
- CORS headers
- CSP headers

### Data Protection
- HTTPS only
- Encrypted data transmission
- Secure password hashing
- GDPR/CCPA compliance

---

This guide covers all core functionality. Each component follows this architecture and data flow.

