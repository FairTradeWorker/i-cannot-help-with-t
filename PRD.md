# AI-Powered Home Services Marketplace

A modern, comprehensive marketplace platform connecting homeowners with qualified contractors through AI-powered job analysis, intelligent matching, transparent browsing, seamless transactions, and advanced management tools - featuring top navigation, comprehensive 50-state database, integrated chat, payment management with finance options, partner programs, admin analytics, and referral system.

**Experience Qualities**:
1. **Modern & Fluid** - Glassmorphism design, smooth animations, top navigation create an immersive, professional browsing experience
2. **Effortless** - Browse services marketplace-style, AI-powered suggestions, integrated chat, flexible payment options eliminate friction at every step
3. **Transparent** - Clear pricing, verified professionals, real-time availability, honest reviews, and comprehensive state-by-state data build marketplace trust

**Complexity Level**: Complex Application (advanced functionality, comprehensive features)
- Full marketplace platform with multi-role support (homeowner, contractor, partner, admin), comprehensive state database with interactive map, integrated chat system, payment management with multiple finance options, partner dashboard, admin analytics, referral program, and territory management

## Essential Features

### Top Navigation System
- **Functionality**: Persistent top navigation bar with dropdown menus for Homeowner (Browse, Payment), Partner (Dashboard, Finance), Admin (Analytics, User Management), and Referral (Program, My Referrals) sections
- **Purpose**: Provide easy access to all platform features with clear organization and hierarchy
- **Trigger**: Always visible at top of screen, dropdowns appear on click
- **Progression**: Click nav item → dropdown opens (if applicable) → select option → navigate to section → content loads
- **Success criteria**: All sections accessible from navigation, dropdowns work smoothly, active state clearly indicated

### 50-State Territory Database & Interactive Map
- **Functionality**: Comprehensive database of all 50 US states with interactive SVG map, clickable states showing detailed information including active contractors, total jobs, ratings, top services, licensing authority, and website
- **Purpose**: Allow users to explore contractor availability and services across all states, understand regional differences, access licensing information
- **Trigger**: User navigates to Territory section
- **Progression**: Territory page loads → map displays all states → user clicks state or selects from list → state details appear → can view licensing info → access state website
- **Success criteria**: All 50 states clickable, data accurate, licensing links work, smooth map interactions, list/map view toggle

### Integrated Chat System
- **Functionality**: Real-time messaging between homeowners and contractors with conversation list, message history, read receipts, online status indicators, and message timestamps
- **Purpose**: Centralize communication, provide clear conversation history, enable quick responses
- **Trigger**: User clicks Messages in navigation or initiates chat from job
- **Progression**: Open messages → see conversation list → select conversation → view history → type message → send → recipient receives → read receipts update
- **Success criteria**: Messages saved per conversation, real-time updates, unread indicators work, both parties can communicate

### Payment Management with Finance Options
- **Functionality**: Multiple payment options including full payment, 3-month installments, and 12-month 0% financing with clear breakdowns, processing fees, and commission details
- **Purpose**: Provide flexible payment options for homeowners, increase affordability, track payment history
- **Trigger**: Job completion or homeowner selects Payment from navigation
- **Progression**: Payment screen loads → review options → select payment method → see breakdown → confirm → process payment → receive confirmation
- **Success criteria**: All payment methods work, installment tracking accurate, payment history maintained, finance approval process clear

### Partner Dashboard
- **Functionality**: Partnership management with revenue tracking, commission breakdowns, active partnership list, payout requests, and partnership creation
- **Purpose**: Enable partnership programs, track partner revenue, manage commissions
- **Trigger**: Partner user accesses Partner dropdown → Dashboard
- **Progression**: Dashboard loads → view stats → see active partnerships → check commission breakdown → request payout → access finance options
- **Success criteria**: Revenue accurately tracked, commissions calculated correctly, payout requests processed, partnership data displayed

### Admin Analytics Dashboard
- **Functionality**: Comprehensive platform analytics including total users, contractors, homeowners, jobs, revenue, completion rates, top states, top services, revenue by month with visual charts and trends
- **Purpose**: Give administrators insight into platform performance, identify growth opportunities, track key metrics
- **Trigger**: Admin user accesses Admin dropdown → Analytics
- **Progression**: Analytics loads → view overview stats → check state rankings → review service popularity → analyze revenue trends → export data
- **Success criteria**: All metrics accurate, charts display correctly, trends calculated properly, data refreshes regularly

### Referral Program
- **Functionality**: User referral system with unique referral codes/links, email invitations, referral tracking, reward status, earnings dashboard, and program explanation
- **Purpose**: Encourage user growth through referrals, reward existing users, track referral success
- **Trigger**: User accesses Referral dropdown → Program
- **Progression**: Referral page loads → copy code/link → send invitations → track referrals → view pending/completed rewards → see earnings → withdraw rewards
- **Success criteria**: Unique codes generated, referral tracking works, rewards calculated correctly, invitation system functional
- **Functionality**: Comprehensive legal agreement system with role-specific terms, independent contractor status acknowledgment, territory ownership risk disclosures, GDPR/CCPA consent management
- **Purpose**: Protect platform from liability, ensure contractor classification compliance, meet consumer protection laws, satisfy data privacy regulations
- **Trigger**: First-time user registration, before accessing platform features
- **Progression**: Role selection → legal consent modal → review agreements → accept all required terms → IP/timestamp recorded → access granted
- **Success criteria**: All users accept required agreements, consents logged with metadata, independent contractor status properly acknowledged, territory risk disclosures accepted before purchase

### Contractor Verification & Licensing
- **Functionality**: License verification system with state-specific requirements, insurance certificate uploads, trade-specific license validation, automatic state requirement checks
- **Purpose**: Comply with state licensing laws, protect homeowners, validate contractor credentials, prevent unlicensed work
- **Trigger**: Contractor profile setup, before bidding on jobs above state thresholds
- **Progression**: Enter license info → select trade type → upload certificates → system validates against state requirements → verification request submitted → agency verification (2-5 days) → verified badge granted
- **Success criteria**: All licenses verified with state agencies, insurance meets $1M minimum, expired credentials flagged, jobs require appropriate licenses based on amount and trade type

### Contractor Classification Dashboard
- **Functionality**: Real-time independent contractor status evaluation, 6-factor compliance scoring, tax responsibility education, classification risk warnings
- **Purpose**: Demonstrate independent contractor status to avoid employee misclassification lawsuits, educate contractors on tax obligations, document platform's non-employer relationship
- **Trigger**: Contractor views compliance dashboard, periodic review notifications
- **Progression**: Load contractor profile → evaluate 6 factors (pricing control, schedule control, competition, training, uniform, supervision) → calculate score → display status → show tax responsibilities
- **Success criteria**: Score above 80% indicates proper classification, all 6 factors properly configured, contractors acknowledge 1099 status and tax responsibilities

### User Roles & Authentication
- **Functionality**: Role selection (contractor/homeowner/territory owner), profile management, demo data initialization, legal consent tracking
- **Purpose**: Enable distinct experiences for different user types with appropriate permissions, features, and legal agreements
- **Trigger**: App launch, role selection screen
- **Progression**: App load → role selection → legal consent modal → accept agreements → profile load → role-specific dashboard
- **Success criteria**: Users can switch between roles (with new consent flows), profiles persist, appropriate features visible per role, all legal consents recorded

### Video-Based Job Creation (Homeowners)
- **Functionality**: Upload video, AI analyzes damage, generates scope, creates job posting automatically
- **Purpose**: Remove friction from homeowner job posting process, provide instant professional estimates
- **Trigger**: Homeowner clicks "New Project", uploads video
- **Progression**: Video upload → AI analysis → scope generation → job auto-created with estimates → posted for contractor bidding
- **Success criteria**: Video analyzed in <30s, job appears in contractor browse queue, homeowner sees job in dashboard

### Job Matching & Browsing (Contractors)
- **Functionality**: Browse available jobs filtered by location, skills, urgency; search functionality
- **Purpose**: Help contractors discover relevant opportunities quickly
- **Trigger**: Contractor accesses "Browse Jobs" tab
- **Progression**: Load available jobs → filter/search → view details → submit bid
- **Success criteria**: Shows only jobs not yet assigned, filters work correctly, search returns relevant results

### Bidding System
- **Functionality**: Contractors submit price, timeline, message; homeowners compare bids side-by-side
- **Purpose**: Transparent marketplace for pricing negotiation and contractor selection
- **Trigger**: Contractor views job details and clicks "Submit Bid"
- **Progression**: Enter bid amount + timeline + message → submit → homeowner receives notification → homeowner reviews bids → accepts one bid
- **Success criteria**: Bids saved correctly, notifications sent, only one bid can be accepted, rejected bidders notified

### In-App Messaging
- **Functionality**: Real-time chat between homeowners and contractors per job, photo attachments, read receipts
- **Purpose**: Centralize communication, provide dispute evidence, reduce phone tag
- **Trigger**: User clicks "Messages" tab in job details
- **Progression**: Type message → send → recipient receives notification → conversation persists
- **Success criteria**: Messages saved per job, unread indicators work, both parties can send/receive

### Earnings & Payment Tracking (Contractors)
- **Functionality**: Track total/available/pending earnings, request instant or standard payouts, view earning history
- **Purpose**: Transparent financial management, flexible cash-out options, tax preparation
- **Trigger**: Contractor completes job, payment released to available balance
- **Progression**: Job completed → earnings added to pending → 48hr hold → moves to available → contractor requests payout → payout processed
- **Success criteria**: Earnings calculated correctly (minus platform fees), instant payout charges 1.5%, standard payout free, transaction history maintained

### Job Status Management
- **Functionality**: Jobs progress through states: draft → posted → bidding → assigned → in_progress → completed → disputed
- **Purpose**: Clear workflow visibility for all parties, triggers appropriate notifications and permissions
- **Trigger**: Various actions (job creation, bid acceptance, completion)
- **Progression**: Status updates automatically based on actions → notifications sent → UI reflects current state
- **Success criteria**: Status transitions work correctly, appropriate users can take actions at each stage

### Rating System (100-Point Scale)
- **Functionality**: Homeowners rate contractors on professionalism, quality, communication, timeliness, cleanliness
- **Purpose**: Build contractor reputation, help homeowners make informed decisions
- **Trigger**: Job marked complete, homeowner prompted to rate
- **Progression**: Job completes → rating form shown → homeowner submits ratings → average calculated → displayed on contractor profile
- **Success criteria**: Multi-dimension ratings saved, overall score calculated, ratings visible to other homeowners

### Contractor Profile & Verification
- **Functionality**: Display rating, completed jobs, skills, licenses, insurance, service area, availability
- **Purpose**: Build trust through transparency, help homeowners select qualified contractors
- **Trigger**: Contractor signup, profile edit, bid submission shows profile preview
- **Progression**: Profile data entered → verification badges earned → displayed in bids and search results
- **Success criteria**: All profile fields display correctly, verified badges show when credentials confirmed

### Dashboard Analytics
- **Functionality**: Real-time stats on active jobs, earnings, bids, messages for both roles
- **Purpose**: At-a-glance understanding of platform activity and personal performance
- **Trigger**: User accesses dashboard
- **Progression**: Load user data → calculate metrics → display in card grid
- **Success criteria**: Stats update in real-time, match actual data, clearly labeled

## Edge Case Handling

- **No demo data** - Initialize with sample contractors, homeowners, and jobs on first load
- **Role switching** - Preserve data when switching between contractor/homeowner views, show appropriate UI per role, require new legal consents if role changes
- **Empty job lists** - Show helpful empty states with call-to-action to browse/create jobs
- **Duplicate bids** - Prevent contractors from bidding twice on same job
- **Concurrent bid acceptance** - Handle race condition if homeowner tries to accept multiple bids
- **Invalid video formats** - Validate file type and size before upload attempt
- **AI API failures** - Graceful degradation, allow manual scope entry, retry mechanisms
- **Message ordering** - Ensure messages display in chronological order with consistent timestamps
- **Earnings calculation** - Handle platform fee calculation (default 0% for founder tier), ensure math precision
- **Payout request limits** - Prevent payout requests when balance is $0 or payout already in progress
- **Notification spam** - Batch notifications for multiple bids on same job
- **Profile incomplete** - Warn contractors if missing critical verification before allowing bids
- **Job without video** - Support text-only job creation as fallback
- **Timezone handling** - Store all dates in UTC, display in user's local timezone
- **Browser storage limits** - Monitor KV storage usage, implement data archival for old jobs
- **Expired licenses** - Flag expired contractor licenses, prevent bidding until renewed
- **Insufficient insurance** - Block contractors with <$1M coverage from bidding
- **License threshold enforcement** - Check job amount against state minimums, require appropriate license level
- **Independent contractor violations** - Monitor for policy changes that could affect classification (mandatory training, price controls, etc.)
- **Consent withdrawal** - Handle GDPR/CCPA data deletion requests, maintain compliance logs
- **Territory passive investment** - Prevent territory sales that appear to be passive investments (securities risk)
- **Multi-state licensing** - Track contractors working across state lines, validate licenses in each state
- **Trade-specific requirements** - Enforce electrical/plumbing/HVAC license requirements regardless of job size
- **Payment processor compliance** - Use Stripe Connect to avoid money transmitter licensing
- **Terms updates** - Notify users of terms changes, require re-acceptance of material changes
- **Minor users** - Age gate to prevent <18 registration (COPPA compliance)

## Design Direction

The design should feel modern, fluid, and premium - like browsing a high-end marketplace where every interaction delights. Extensive use of glassmorphism (frosted glass effects with backdrop blur), smooth animations throughout the interface, and center-aligned navigation create an immersive, app-like experience that feels contemporary and engaging.

## Color Selection

**Triadic** color scheme with professional blue (trust/intelligence), vibrant green (success/cost), and warm orange (warnings/urgency) to clearly differentiate information types and guide user attention to critical data points.

- **Primary Color**: Deep professional blue `oklch(0.45 0.15 250)` - communicates trust, intelligence, and technology expertise
- **Secondary Colors**: Clean slate gray `oklch(0.60 0.02 250)` for supporting UI elements and neutral backgrounds
- **Accent Color**: Vibrant success green `oklch(0.65 0.19 145)` for positive indicators like cost estimates and approvals
- **Warning Color**: Warm orange `oklch(0.68 0.17 45)` for alerts, risks, and urgent items
- **Foreground/Background Pairings**:
  - Background (Pure White `oklch(1 0 0)`): Dark text `oklch(0.20 0.01 250)` - Ratio 15.8:1 ✓
  - Card (White `oklch(1 0 0)`): Dark text `oklch(0.20 0.01 250)` - Ratio 15.8:1 ✓
  - Primary (Deep Blue `oklch(0.45 0.15 250)`): White text `oklch(1 0 0)` - Ratio 8.2:1 ✓
  - Secondary (Slate `oklch(0.60 0.02 250)`): White text `oklch(1 0 0)` - Ratio 4.7:1 ✓
  - Accent (Green `oklch(0.65 0.19 145)`): White text `oklch(1 0 0)` - Ratio 5.1:1 ✓
  - Muted (Light Gray `oklch(0.96 0 0)`): Dark muted text `oklch(0.50 0.01 250)` - Ratio 5.9:1 ✓

## Font Selection

Typography should convey precision, clarity, and modern professionalism - characteristics of both construction documentation and AI technology. Inter provides excellent readability for complex data tables and technical information while maintaining a contemporary feel.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing/-0.02em
  - H2 (Section Headers): Inter SemiBold/24px/tight letter spacing/-0.01em  
  - H3 (Component Titles): Inter SemiBold/18px/normal letter spacing
  - Body (Primary Text): Inter Regular/16px/relaxed line height/1.6
  - Small (Metadata/Labels): Inter Medium/14px/normal line height/1.4
  - Mono (Technical Data): JetBrains Mono Regular/14px for cost figures and measurements

## Animations

Animations should be abundant, smooth, and purposeful - creating a fluid, app-like experience that feels alive and responsive. Every interaction should have motion feedback, transitions should be silky-smooth with spring physics, and elements should gracefully enter/exit the viewport.

- **Purposeful Meaning**: Card hover lifts with subtle shadows, glassmorphic panels slide in smoothly, loading states pulse gently, success actions bounce with spring physics, scroll-triggered reveals fade up elegantly
- **Hierarchy of Movement**: 
  1. Primary: Page transitions and navigation changes (full-screen slides with blur)
  2. Secondary: Card interactions, modal appearances, tab switches (scale + fade combos)
  3. Tertiary: Hover states, micro-interactions, icon animations (subtle transforms)

## Component Selection

- **Components**: 
  - Card (scope results, pricing breakdown) with subtle shadows for depth
  - Button (primary actions) with solid fills and hover state darkening
  - Progress (analysis pipeline) showing multi-step workflow with current stage highlighted
  - Tabs (switching between scope/pricing/learning views) with underline indicator
  - Table (materials list, pricing breakdown) with hover row highlighting
  - Badge (urgency level, permit required) with color-coded backgrounds
  - Alert (errors, warnings) using destructive/warning color schemes
  - Separator between major content sections for visual breathing room

- **Customizations**: 
  - Custom video preview component with play controls
  - Drag-and-drop upload zone with visual feedback for hover/drop states
  - AI confidence meter as circular progress indicator
  - Multi-step analysis progress bar showing "Vision Analysis → Scope Generation → Complete"
  - Cost range slider visualization showing min-max estimates

- **States**: 
  - Buttons: default (solid), hover (darker +5%), active (pressed inset), disabled (opacity 50%)
  - Inputs: default (border), focus (ring + border accent color), error (destructive border + message), success (green border)
  - Upload zone: default (dashed border), hover (solid blue border + background tint), active drag (blue background), uploading (animated border)

- **Icon Selection**: 
  - VideoCamera (upload zone), Eye (vision analysis), Package (materials), ClockCounterClockwise (labor hours), CurrencyDollar (pricing), CheckCircle (success), Warning (risks), Certificate (permit), TrendUp (learning/improvement), User (contractor profile)

- **Spacing**: 
  - Component padding: p-6 for cards, p-4 for nested sections
  - Section gaps: gap-8 between major sections, gap-4 for related items
  - Grid layouts: gap-6 for feature cards, gap-3 for data tables
  - Page margins: max-w-6xl mx-auto with px-4 for responsive edge spacing

- **Mobile**: 
  - Stack all grid layouts to single column on <768px
  - Reduce heading sizes by 25% on mobile
  - Convert tables to card-style layouts with vertical data arrangement
  - Full-width buttons on mobile, inline on desktop
  - Collapsible sections for materials/recommendations to reduce scroll
  - Touch-optimized file input with larger tap targets (min 44px)
