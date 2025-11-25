# 🎖️ ServiceHub Phase 1: Core Infrastructure Sub-Issues

**Phase:** Core Infrastructure (Week 1)  
**Lead Orchestrator:** Lead Agent  
**Status:** Planning Complete  
**Created:** 2025-11-25

---

## Overview

This document outlines 5 parallelizable sub-issues for Phase 1 of the ServiceHub Full System Build. Each issue has clear specifications, dependencies, acceptance criteria, and assigned agents.

### Dependency Graph

```
                    ┌─────────────────────┐
                    │  Issue 1: Database  │
                    │    Schema Design    │
                    │     (Agent-DB)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
┌─────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│  Issue 2: Auth      │ │  Issue 3: Job   │ │  Issue 5: Admin     │
│    System           │ │  Creation Flow  │ │    Dashboard        │
│   (Agent-DB/API)    │ │   (Agent-API)   │ │    (Agent-UI)       │
└─────────────────────┘ └─────────────────┘ └─────────────────────┘
              │                │
              ▼                │
┌─────────────────────┐        │
│  Issue 4: Mobile    │◄───────┘
│    App Shell        │
│  (Agent-Mobile)     │
└─────────────────────┘
```

---

## Issue 1: Database Schema Design

**Assigned to:** Agent-DB  
**Depends on:** None  
**Priority:** P0 (Critical Path)  
**Time Estimate:** 8 hours

### Description

Design and implement the complete Supabase database schema for ServiceHub, including all tables, relationships, Row Level Security (RLS) policies, and database functions/triggers. This is the foundation that all other features depend on.

### Files to Create/Modify

```
supabase/
├── migrations/
│   ├── 00001_initial_schema.sql          # Core tables
│   ├── 00002_rls_policies.sql            # Row Level Security
│   ├── 00003_functions_triggers.sql      # Database functions
│   └── 00004_seed_data.sql               # Demo/test data
├── config.toml                            # Supabase project config
└── seed.sql                               # Development seed data

docs/
└── database/
    ├── ERD.md                             # Entity Relationship Diagram
    └── SCHEMA_REFERENCE.md                # Table documentation
```

### Schema Requirements

#### Core Tables

1. **users** - Extended user profiles
   - `id` (UUID, FK to auth.users)
   - `email` (TEXT, UNIQUE)
   - `full_name` (TEXT)
   - `phone` (TEXT)
   - `role` (ENUM: homeowner, contractor, subcontractor, operator, admin)
   - `avatar_url` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

2. **territories** - Geographic ownership zones
   - `id` (UUID, PK)
   - `zip_code` (TEXT, UNIQUE)
   - `city` (TEXT)
   - `state` (TEXT, 2-char)
   - `county` (TEXT)
   - `owner_id` (UUID, FK to users, nullable)
   - `price` (DECIMAL - dynamic: first 10 free, then $500+)
   - `claimed_at` (TIMESTAMPTZ)
   - `revenue_share_percent` (DECIMAL, default 8.0)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

3. **jobs** - Service requests
   - `id` (UUID, PK)
   - `homeowner_id` (UUID, FK to users)
   - `territory_id` (UUID, FK to territories)
   - `title` (TEXT)
   - `description` (TEXT)
   - `category` (TEXT - 60 service categories)
   - `status` (ENUM: draft, posted, bidding, assigned, in_progress, completed, disputed)
   - `urgency` (ENUM: low, medium, high, emergency)
   - `video_url` (TEXT)
   - `video_frame_url` (TEXT)
   - `ai_scope` (JSONB)
   - `ai_confidence` (DECIMAL)
   - `estimated_cost_min` (DECIMAL)
   - `estimated_cost_max` (DECIMAL)
   - `actual_cost` (DECIMAL)
   - `location_address` (TEXT)
   - `location_lat` (DECIMAL)
   - `location_lng` (DECIMAL)
   - `created_at`, `updated_at`, `completed_at` (TIMESTAMPTZ)

4. **bids** - Contractor proposals
   - `id` (UUID, PK)
   - `job_id` (UUID, FK to jobs)
   - `contractor_id` (UUID, FK to users)
   - `amount` (DECIMAL)
   - `timeline_days` (INTEGER)
   - `message` (TEXT)
   - `status` (ENUM: pending, accepted, rejected, withdrawn)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

5. **contractor_profiles** - Extended contractor info
   - `user_id` (UUID, FK to users, PK)
   - `business_name` (TEXT)
   - `license_number` (TEXT)
   - `license_state` (TEXT)
   - `license_verified` (BOOLEAN)
   - `insurance_verified` (BOOLEAN)
   - `insurance_amount` (DECIMAL)
   - `service_categories` (TEXT[])
   - `service_radius_miles` (INTEGER)
   - `rating_avg` (DECIMAL)
   - `rating_count` (INTEGER)
   - `jobs_completed` (INTEGER)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

6. **messages** - Chat system
   - `id` (UUID, PK)
   - `conversation_id` (UUID, indexed)
   - `sender_id` (UUID, FK to users)
   - `recipient_id` (UUID, FK to users)
   - `job_id` (UUID, FK to jobs, nullable)
   - `content` (TEXT)
   - `read_at` (TIMESTAMPTZ)
   - `created_at` (TIMESTAMPTZ)

7. **payments** - Financial transactions
   - `id` (UUID, PK)
   - `job_id` (UUID, FK to jobs)
   - `payer_id` (UUID, FK to users)
   - `amount` (DECIMAL)
   - `operator_fee` (DECIMAL)
   - `contractor_amount` (DECIMAL)
   - `status` (ENUM: pending, processing, completed, refunded, failed)
   - `stripe_payment_intent_id` (TEXT)
   - `payment_method` (ENUM: card, bank, wallet)
   - `created_at`, `completed_at` (TIMESTAMPTZ)

8. **learning_feedback** - AI improvement loop
   - `id` (UUID, PK)
   - `job_id` (UUID, FK to jobs)
   - `prediction_type` (TEXT)
   - `predicted_value` (JSONB)
   - `actual_value` (JSONB)
   - `accuracy_score` (DECIMAL)
   - `created_at` (TIMESTAMPTZ)

9. **push_tokens** - Mobile notifications
   - `id` (UUID, PK)
   - `user_id` (UUID, FK to users)
   - `token` (TEXT)
   - `platform` (ENUM: ios, android, web)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

10. **legal_consents** - Compliance tracking
    - `id` (UUID, PK)
    - `user_id` (UUID, FK to users)
    - `consent_type` (TEXT)
    - `version` (TEXT)
    - `ip_address` (TEXT)
    - `user_agent` (TEXT)
    - `consented_at` (TIMESTAMPTZ)

### RLS Policies Required

- Users can only read/update their own profile
- Homeowners can only see their own jobs
- Contractors can see posted jobs in their service area
- Operators can see all jobs in their territories
- Messages are private to sender/recipient
- Payment records visible only to involved parties
- Admin role bypasses all RLS

### Acceptance Criteria

- [ ] All 10+ core tables created with proper constraints
- [ ] Foreign key relationships established correctly
- [ ] Indexes created for frequently queried columns
- [ ] RLS policies enable proper data isolation
- [ ] Database functions for:
  - [ ] Calculate territory price based on claim count
  - [ ] Auto-update `updated_at` timestamps
  - [ ] Calculate operator revenue on job completion
- [ ] Seed data includes demo users, territories, and jobs
- [ ] ERD diagram documents all relationships
- [ ] Schema passes Supabase migration test
- [ ] TypeScript types generated from schema

---

## Issue 2: Authentication System

**Assigned to:** Agent-DB (Supabase setup) + Agent-API (business logic)  
**Depends on:** Issue 1 (Database Schema)  
**Priority:** P0 (Critical Path)  
**Time Estimate:** 6 hours

### Description

Implement complete authentication system using Supabase Auth with role-based access control (RBAC). Support multiple user roles with appropriate permissions and JWT claims.

### Files to Create/Modify

```
src/
├── lib/
│   ├── supabase.ts                       # Supabase client initialization
│   ├── auth.ts                           # Auth utilities & hooks
│   └── rbac.ts                           # Role-based access control
├── hooks/
│   ├── useAuth.ts                        # Auth state hook
│   ├── useUser.ts                        # Current user hook
│   └── usePermissions.ts                 # Permission checking hook
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx                 # Email/password login
│   │   ├── SignupForm.tsx                # Registration with role selection
│   │   ├── ForgotPassword.tsx            # Password reset flow
│   │   ├── RoleSelector.tsx              # Role selection UI
│   │   └── ProtectedRoute.tsx            # Route guard component
│   └── LoginModal.tsx                    # Update existing modal
├── contexts/
│   └── AuthContext.tsx                   # Auth state provider
└── types/
    └── auth.ts                           # Auth type definitions

supabase/
└── functions/
    └── create-user-profile/
        └── index.ts                      # Trigger on user signup
```

### Auth Requirements

#### Supported Auth Methods
- Email/Password (primary)
- Magic Link (optional)
- OAuth: Google, Apple (future)

#### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| `homeowner` | Create jobs, view own jobs, message contractors, make payments |
| `contractor` | Browse jobs, submit bids, manage profile, view earnings |
| `subcontractor` | Browse local jobs, get hired by GCs, manage profile |
| `operator` | View territory analytics, approve contractors, earn revenue share |
| `admin` | Full access, user management, system configuration |

#### JWT Custom Claims
```typescript
{
  role: 'homeowner' | 'contractor' | 'subcontractor' | 'operator' | 'admin',
  territories: string[],  // For operators
  verified: boolean,
  subscription_tier: 'free' | 'professional' | 'enterprise'
}
```

### Acceptance Criteria

- [ ] Supabase client properly initialized with env variables
- [ ] Email/password signup creates user profile automatically
- [ ] Role selection happens during signup flow
- [ ] JWT includes custom claims for role and permissions
- [ ] `useAuth` hook provides:
  - [ ] `user` - current user object
  - [ ] `session` - current session
  - [ ] `signIn()` - login function
  - [ ] `signUp()` - registration function
  - [ ] `signOut()` - logout function
  - [ ] `loading` - auth state loading
- [ ] `usePermissions` hook checks role-based access
- [ ] `ProtectedRoute` component guards private routes
- [ ] Password reset flow works end-to-end
- [ ] Auth state persists across page refreshes
- [ ] Legal consent modal shown on first login
- [ ] Existing LoginModal updated to use Supabase

---

## Issue 3: Job Creation Flow

**Assigned to:** Agent-API  
**Depends on:** Issue 1 (Database Schema), Issue 2 (Authentication)  
**Priority:** P1 (Core Feature)  
**Time Estimate:** 10 hours

### Description

Implement the complete job creation flow: video upload → Supabase Storage → AI scope generation → job dispatch to contractors. This is the core innovation of the platform.

### Files to Create/Modify

```
src/
├── api/
│   └── jobs/
│       ├── create.ts                     # Job creation endpoint
│       ├── analyze-video.ts              # Video frame extraction + AI
│       ├── generate-scope.ts             # AI scope generation
│       └── dispatch.ts                   # Notify matching contractors
├── lib/
│   ├── storage.ts                        # Supabase Storage utilities
│   ├── video-processor.ts                # Video frame extraction
│   └── job-matcher.ts                    # Match jobs to contractors
├── components/
│   ├── jobs/
│   │   ├── VideoUpload.tsx               # Enhanced video uploader
│   │   ├── JobScopePreview.tsx           # AI-generated scope display
│   │   ├── JobConfirmation.tsx           # Review before posting
│   │   └── JobStatusTracker.tsx          # Real-time status updates
│   └── VideoJobCreator.tsx               # Update existing component
├── hooks/
│   ├── useJobCreation.ts                 # Job creation state machine
│   └── useVideoUpload.ts                 # Upload progress & status
└── types/
    └── jobs.ts                           # Job type definitions

supabase/
├── storage/
│   └── buckets.sql                       # Storage bucket configuration
└── functions/
    ├── process-video/
    │   └── index.ts                      # Video processing edge function
    └── dispatch-job/
        └── index.ts                      # Job notification function
```

### Job Creation Pipeline

```
1. User uploads 60-second video
   ↓
2. Video stored in Supabase Storage (jobs-videos bucket)
   ↓
3. Extract middle frame (30s mark)
   ↓
4. Store frame in Supabase Storage (job-frames bucket)
   ↓
5. AI Vision analyzes frame:
   - Damage type identification
   - Severity assessment
   - Location detection
   - Material identification
   ↓
6. AI generates detailed scope:
   - Materials list with quantities
   - Labor hour estimates
   - Cost range (min/max)
   - Recommendations
   - Risk warnings
   - Permit requirements
   - Confidence score
   ↓
7. User reviews and confirms job
   ↓
8. Job saved to database with status 'posted'
   ↓
9. Matching contractors notified via push
```

### Storage Configuration

```sql
-- Supabase Storage Buckets
- jobs-videos (public: false, max: 100MB, allowed: mp4, mov, avi)
- job-frames (public: true, max: 5MB, allowed: jpg, png, webp)
- contractor-documents (public: false, max: 10MB, allowed: pdf, jpg, png)
```

### AI Scope Output Schema

```typescript
interface AIJobScope {
  category: string;           // One of 60 service categories
  subcategory: string;
  severity: 'minor' | 'moderate' | 'severe' | 'emergency';
  description: string;
  
  materials: {
    name: string;
    quantity: number;
    unit: string;
    estimated_cost: number;
  }[];
  
  labor: {
    task: string;
    hours: number;
    skill_level: 'basic' | 'skilled' | 'specialist';
  }[];
  
  cost_estimate: {
    materials_low: number;
    materials_high: number;
    labor_low: number;
    labor_high: number;
    total_low: number;
    total_high: number;
  };
  
  recommendations: string[];
  risks: string[];
  permits_required: string[];
  
  confidence: number;         // 0-100
  analysis_notes: string;
}
```

### Acceptance Criteria

- [ ] Video upload supports MP4, MOV, AVI up to 100MB
- [ ] Upload shows progress percentage
- [ ] Videos stored in Supabase Storage with secure URLs
- [ ] Frame extraction happens at 30-second mark
- [ ] AI vision correctly identifies damage type
- [ ] AI scope includes:
  - [ ] Materials list with costs
  - [ ] Labor hour estimates
  - [ ] Cost range (min/max)
  - [ ] Recommendations
  - [ ] Risk warnings
  - [ ] Permit requirements
  - [ ] Confidence score (target: 85%+)
- [ ] User can edit AI-generated scope before posting
- [ ] Job saved to database with all metadata
- [ ] Matching contractors notified (by location + category)
- [ ] Job appears in contractor browse queue
- [ ] Processing time < 30 seconds total
- [ ] Error handling for:
  - [ ] Upload failures
  - [ ] Invalid video formats
  - [ ] AI analysis failures
  - [ ] Network timeouts

---

## Issue 4: Contractor Mobile App Shell

**Assigned to:** Agent-Mobile  
**Depends on:** Issue 1 (Database Schema), Issue 2 (Authentication), Issue 3 (partial - job types)  
**Priority:** P1 (Core Feature)  
**Time Estimate:** 12 hours

### Description

Create the Expo React Native mobile app shell for contractors, including navigation structure, push notification setup, and core screens. The app should be ready for feature development.

### Files to Create (New Project)

```
mobile/
├── app.json                              # Expo configuration
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── babel.config.js                       # Babel configuration
├── eas.json                              # EAS Build configuration
│
├── src/
│   ├── App.tsx                           # Root component
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx             # Root stack navigator
│   │   ├── AuthNavigator.tsx             # Auth flow screens
│   │   ├── MainTabNavigator.tsx          # Main bottom tabs
│   │   └── linking.ts                    # Deep linking config
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx           # Login screen
│   │   │   ├── SignupScreen.tsx          # Registration screen
│   │   │   └── ForgotPasswordScreen.tsx  # Password reset
│   │   ├── home/
│   │   │   └── HomeScreen.tsx            # Dashboard/home
│   │   ├── jobs/
│   │   │   ├── JobsListScreen.tsx        # Available jobs
│   │   │   ├── JobDetailScreen.tsx       # Job details + bid
│   │   │   └── MyJobsScreen.tsx          # Assigned jobs
│   │   ├── earnings/
│   │   │   └── EarningsScreen.tsx        # Earnings dashboard
│   │   ├── messages/
│   │   │   ├── ConversationsScreen.tsx   # Chat list
│   │   │   └── ChatScreen.tsx            # Individual chat
│   │   └── profile/
│   │       ├── ProfileScreen.tsx         # User profile
│   │       └── SettingsScreen.tsx        # App settings
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx                # Custom button
│   │   │   ├── Input.tsx                 # Custom input
│   │   │   ├── Card.tsx                  # Card component
│   │   │   └── Loading.tsx               # Loading spinner
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx               # Job list item
│   │   │   └── BidForm.tsx               # Bid submission form
│   │   └── navigation/
│   │       └── TabBar.tsx                # Custom tab bar
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                    # Auth hook (Supabase)
│   │   ├── usePushNotifications.ts       # Push setup hook
│   │   └── useLocation.ts                # Location permissions
│   │
│   ├── lib/
│   │   ├── supabase.ts                   # Supabase client
│   │   ├── notifications.ts              # Push notification utils
│   │   └── storage.ts                    # Async storage utils
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx               # Auth provider
│   │   └── NotificationContext.tsx       # Notification provider
│   │
│   ├── types/
│   │   ├── navigation.ts                 # Navigation types
│   │   ├── api.ts                        # API response types
│   │   └── index.ts                      # Shared types
│   │
│   └── constants/
│       ├── colors.ts                     # Color palette
│       ├── layout.ts                     # Layout constants
│       └── api.ts                        # API endpoints
│
├── assets/
│   ├── images/
│   │   ├── logo.png                      # App logo
│   │   ├── icon.png                      # App icon
│   │   └── splash.png                    # Splash screen
│   └── fonts/                            # Custom fonts
│
└── app/                                  # Expo Router (if using)
    ├── _layout.tsx
    ├── index.tsx
    └── (tabs)/
        └── _layout.tsx
```

### Navigation Structure

```
RootNavigator
├── AuthNavigator (when logged out)
│   ├── Login
│   ├── Signup
│   └── ForgotPassword
│
└── MainTabNavigator (when logged in)
    ├── Home (Dashboard)
    ├── Jobs (Browse + My Jobs)
    │   ├── JobsList
    │   ├── JobDetail
    │   └── MyJobs
    ├── Messages
    │   ├── Conversations
    │   └── Chat
    ├── Earnings
    └── Profile
        ├── Profile
        └── Settings
```

### Push Notification Setup

```typescript
// Expo Push Token Registration
async function registerForPushNotifications() {
  // Request permissions
  // Get Expo push token
  // Save token to Supabase (push_tokens table)
  // Handle foreground notifications
  // Handle background notifications
  // Deep link to relevant screen
}

// Notification Types
- new_job_posted       → Navigate to JobDetail
- bid_accepted         → Navigate to MyJobs
- new_message          → Navigate to Chat
- payment_received     → Navigate to Earnings
- job_update           → Navigate to JobDetail
```

### Acceptance Criteria

- [ ] Expo project initializes without errors
- [ ] TypeScript configured properly
- [ ] Navigation stack works correctly:
  - [ ] Auth screens (Login, Signup, ForgotPassword)
  - [ ] Main tab navigator (Home, Jobs, Messages, Earnings, Profile)
  - [ ] Deep navigation (Jobs → JobDetail)
- [ ] Supabase client connects successfully
- [ ] Authentication flow works:
  - [ ] Login with email/password
  - [ ] Signup with role selection
  - [ ] Password reset
  - [ ] Session persistence
- [ ] Push notifications configured:
  - [ ] Permissions requested on first launch
  - [ ] Token saved to database
  - [ ] Foreground notifications display
  - [ ] Tap notification navigates correctly
- [ ] Location permissions requested (for job matching)
- [ ] Basic UI components created with consistent styling
- [ ] App builds successfully for iOS and Android (Expo Go)
- [ ] Deep linking configured for:
  - [ ] `servicehub://job/{id}`
  - [ ] `servicehub://chat/{id}`
  - [ ] `servicehub://earnings`
- [ ] Splash screen displays correctly
- [ ] App icon configured

---

## Issue 5: Admin Dashboard Shell

**Assigned to:** Agent-UI  
**Depends on:** Issue 1 (Database Schema), Issue 2 (Authentication)  
**Priority:** P2 (Supporting Feature)  
**Time Estimate:** 8 hours

### Description

Create the admin dashboard shell using the existing Next.js/React structure with basic CRUD operations for platform management. This provides administrators with tools to manage users, jobs, territories, and view analytics.

### Files to Create/Modify

```
src/
├── components/
│   └── admin/
│       ├── AdminLayout.tsx               # Admin layout wrapper
│       ├── AdminSidebar.tsx              # Navigation sidebar
│       ├── AdminHeader.tsx               # Header with user info
│       │
│       ├── dashboard/
│       │   ├── AdminOverview.tsx         # Main dashboard
│       │   └── StatCard.tsx              # Metric card component
│       │
│       ├── users/
│       │   ├── UsersList.tsx             # Users table
│       │   ├── UserDetail.tsx            # User detail view
│       │   ├── UserForm.tsx              # Create/edit user
│       │   └── UserFilters.tsx           # Search & filters
│       │
│       ├── jobs/
│       │   ├── JobsList.tsx              # Jobs table
│       │   ├── JobDetail.tsx             # Job detail view
│       │   └── JobFilters.tsx            # Search & filters
│       │
│       ├── territories/
│       │   ├── TerritoriesList.tsx       # Territories table
│       │   ├── TerritoryDetail.tsx       # Territory detail
│       │   └── TerritoryMap.tsx          # Map visualization
│       │
│       ├── analytics/
│       │   ├── AnalyticsOverview.tsx     # Analytics dashboard
│       │   ├── RevenueChart.tsx          # Revenue over time
│       │   └── GrowthMetrics.tsx         # User/job growth
│       │
│       └── common/
│           ├── DataTable.tsx             # Reusable data table
│           ├── SearchInput.tsx           # Search component
│           ├── Pagination.tsx            # Pagination component
│           └── ConfirmModal.tsx          # Confirmation dialog
│
├── pages/ (or routes in App.tsx)
│   └── admin/
│       ├── index.tsx                     # Admin home (redirect to dashboard)
│       ├── dashboard.tsx                 # Overview dashboard
│       ├── users.tsx                     # Users management
│       ├── jobs.tsx                      # Jobs management
│       ├── territories.tsx               # Territory management
│       └── analytics.tsx                 # Analytics page
│
├── hooks/
│   └── admin/
│       ├── useAdminAuth.ts               # Admin auth check
│       ├── useUsers.ts                   # Users CRUD hook
│       ├── useAdminJobs.ts               # Jobs management hook
│       └── useTerritories.ts             # Territories hook
│
└── lib/
    └── admin/
        └── api.ts                        # Admin API functions
```

### Admin Pages & Features

#### 1. Dashboard Overview
- Total users (by role)
- Total jobs (by status)
- Total territories (claimed vs. available)
- Revenue this month
- Platform accuracy trend
- Recent activity feed

#### 2. Users Management
- List all users with role filter
- Search by name, email
- View user details
- Edit user role
- Suspend/activate user
- View user's jobs/bids
- Manual verification toggle

#### 3. Jobs Management
- List all jobs with status filter
- Search by title, homeowner, contractor
- View job details with AI scope
- Update job status (for disputes)
- View bid history
- Force assign contractor

#### 4. Territories Management
- List all territories with claim status
- View territory owner
- Territory revenue breakdown
- Reset territory ownership
- Adjust pricing
- View territory analytics

#### 5. Analytics
- Revenue by time period
- User growth chart
- Jobs by category
- Geographic distribution
- AI accuracy over time
- Platform health metrics

### CRUD Operations Required

```typescript
// Users
- listUsers(filters, pagination)
- getUser(id)
- updateUser(id, data)
- deleteUser(id)
- toggleUserStatus(id)

// Jobs
- listJobs(filters, pagination)
- getJob(id)
- updateJobStatus(id, status)
- forceAssignJob(id, contractorId)

// Territories
- listTerritories(filters, pagination)
- getTerritory(id)
- updateTerritory(id, data)
- resetTerritoryOwner(id)
```

### Acceptance Criteria

- [ ] Admin route accessible only to admin role
- [ ] Sidebar navigation to all sections
- [ ] Dashboard shows:
  - [ ] User count by role
  - [ ] Job count by status
  - [ ] Territory stats
  - [ ] Revenue metrics
  - [ ] Recent activity
- [ ] Users page:
  - [ ] Paginated list with search
  - [ ] Filter by role
  - [ ] View user details
  - [ ] Edit user role
  - [ ] Suspend/activate user
- [ ] Jobs page:
  - [ ] Paginated list with search
  - [ ] Filter by status
  - [ ] View job details
  - [ ] Update job status
  - [ ] View AI scope
- [ ] Territories page:
  - [ ] List with ownership status
  - [ ] Map visualization
  - [ ] Revenue per territory
  - [ ] Reset ownership action
- [ ] Analytics page:
  - [ ] Revenue chart
  - [ ] User growth chart
  - [ ] Category distribution
- [ ] All tables use consistent DataTable component
- [ ] Loading states shown during data fetch
- [ ] Error handling for API failures
- [ ] Confirmation dialogs for destructive actions
- [ ] Responsive design (desktop-first)

---

## Timeline Summary

| Issue | Agent | Time Est | Dependencies | Parallel? |
|-------|-------|----------|--------------|-----------|
| 1. Database Schema | Agent-DB | 8 hrs | None | ✅ Start immediately |
| 2. Authentication | Agent-DB/API | 6 hrs | Issue 1 | After Issue 1 |
| 3. Job Creation Flow | Agent-API | 10 hrs | Issues 1, 2 | After Issue 2 |
| 4. Mobile App Shell | Agent-Mobile | 12 hrs | Issues 1, 2 | After Issue 2 |
| 5. Admin Dashboard | Agent-UI | 8 hrs | Issues 1, 2 | After Issue 2 |

**Total Estimated Time:** 44 hours  
**With Parallelization:** ~24 hours (Issues 3, 4, 5 can run in parallel after Issue 2)

---

## Success Metrics for Phase 1

1. **Database** - All tables created, RLS policies active, TypeScript types generated
2. **Auth** - Users can sign up, log in, and access role-appropriate features
3. **Jobs** - Homeowners can upload video and receive AI-generated scope
4. **Mobile** - Contractors can download app, log in, and receive push notifications
5. **Admin** - Admins can view and manage all platform entities

---

## Commands for Agents

### Agent-DB
```bash
# Initialize Supabase
npx supabase init
npx supabase db push
npx supabase gen types typescript --local > src/types/database.ts
```

### Agent-Mobile
```bash
# Create Expo project
npx create-expo-app mobile --template expo-template-blank-typescript
cd mobile
npx expo install expo-notifications expo-device expo-constants
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install @supabase/supabase-js
```

### Agent-UI
```bash
# Use existing project structure
# Components go in src/components/admin/
# Hooks go in src/hooks/admin/
```

---

## Review Checklist (Lead Agent)

Before approving each PR:

- [ ] Code follows existing project conventions
- [ ] TypeScript types are properly defined
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive
- [ ] Loading states are implemented
- [ ] Responsive design is considered
- [ ] Accessibility (a11y) basics covered
- [ ] No hardcoded API keys or secrets
- [ ] PR description explains changes clearly
- [ ] Tests included (if test infrastructure exists)

---

**Phase 1 Complete Criteria:**  
All 5 issues merged, no blocking bugs, system integration tested.

**Next Phase:**  
Phase 2 will cover advanced features: payment processing, route optimization, and contractor matching algorithms.
