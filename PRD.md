# Home Services Marketplace with Self-Learning Vision System

A revolutionary 3-tier marketplace platform where homeowners upload 60-second videos of home repairs, platform analyzes and estimates jobs with precision, and three types of workers collaborate: Operators (territory investors earning 8%), General Contractors (project managers), and Subcontractors (specialists). The system learns from every completed job, improving from 82% accuracy to 99.9%+ over 10,000 jobs.

**Experience Qualities**:
1. **Intelligent & Self-Improving** - GPT-4 Vision analyzes videos, generates estimates, learns from reality (225fps ultra-smooth animations)
2. **Zero-Friction for Workers** - Workers pay $0 fees ever. Operators fund everything through 8% revenue share from their territories.
3. **Transparent & Fair** - Clear 3-tier structure, confidence scores, real-time learning metrics, honest accuracy tracking

**Complexity Level**: Complex Application (advanced vision analysis, self-learning system, 3-tier marketplace)
- Video-to-job creation with GPT-4 Vision frame extraction and analysis
- Self-learning system that tracks predictions vs. reality and improves accuracy over time
- 3-tier worker system: Operators (passive investors), General Contractors (project managers), Subcontractors (specialists)
- Territory ownership with 8% revenue share for operators
- Worker-friendly: $0 fees for all contractors, operators fund the platform

## Essential Features

### Service Categories (60 Total)
The platform supports 60 comprehensive service categories organized into 7 major groups:

**Home Exterior (10 services)**
- Roofing, Siding, Gutter Installation & Repair, Window Installation, Door Installation, Deck & Patio Construction, Fence Installation & Repair, Driveway & Walkway, Exterior Painting, Power Washing

**Home Interior (10 services)**
- Interior Painting, Drywall Repair, Flooring Installation (Hardwood, Tile, Carpet), Kitchen Remodeling, Bathroom Remodeling, Basement Finishing, Attic Conversion, Closet Organization Systems, Crown Molding & Trim, Cabinet Installation & Refacing

**Plumbing (8 services)**
- General Plumbing Repair, Drain Cleaning, Water Heater Installation, Sewer Line Repair, Pipe Replacement, Fixture Installation (Sinks, Toilets, Faucets), Gas Line Installation, Backflow Prevention

**Electrical (8 services)**
- General Electrical Repair, Panel Upgrades, Lighting Installation, Ceiling Fan Installation, Outlet & Switch Installation, Generator Installation, EV Charger Installation, Smart Home Wiring

**HVAC (6 services)**
- HVAC Installation, HVAC Repair, AC Maintenance, Furnace Repair, Duct Cleaning, Thermostat Installation

**Foundation & Structural (5 services)**
- Foundation Repair, Basement Waterproofing, Crack Repair, Structural Engineering, Crawl Space Encapsulation

**Specialty Services (13 services)**
- Mold Remediation, Pest Control, Insulation Installation, Chimney Repair & Cleaning, Septic System Repair, Well Installation & Repair, Pool Installation & Repair, Hot Tub Installation, Home Automation & Security, Solar Panel Installation, Radon Mitigation, Asbestos Removal, Lead Paint Removal

### 60-Second Video Job Creation (Core Innovation)
- **Functionality**: Homeowner films damage for 60 seconds, system extracts middle frame, GPT-4 Vision analyzes image, generates detailed scope with materials/labor/costs automatically
- **Purpose**: Remove friction from job posting, provide instant professional estimates, capture visual proof
- **Trigger**: Homeowner clicks "New Job", uploads video
- **Progression**: Upload video (60s) → system extracts middle frame → GPT-4 Vision analyzes → generates scope with confidence score → job posted with estimate → contractors see job
- **Success criteria**: Frame extracted in <5s, analysis complete in <30s, scope includes materials list + labor hours + cost range + confidence score (85%+), job appears in contractor browse queue

### Self-Learning System (The Magic)
- **Functionality**: After every job completion, contractor provides actual costs/materials/labor, system compares with prediction, calculates accuracy, stores learning, improves next predictions
- **Purpose**: Achieve precision estimation accuracy (99.9%+) through continuous learning from real-world outcomes
- **Trigger**: Job marked complete by contractor
- **Progression**: Job completes → contractor enters actual cost/materials/hours → system compares with prediction → calculates accuracy score → stores learning feedback → adjusts future predictions → displays accuracy trends
- **Success criteria**: Accuracy improves over time (Job 1: 82%, Job 100: 94%, Job 1000: 99%, Job 10000: 99.9%), predictions get tighter (range narrows from $8K-$12K to $9,748), learning metrics visible on dashboard (Partners > AI Technology section only)

### 3-Tier Worker System
- **Functionality**: Three distinct worker roles with clear value propositions
  - **Operators**: Buy zip codes ($5K-$50K), recruit contractors, approve workers, earn 8% of all jobs, can sell territory later
  - **General Contractors**: Take large multi-trade projects, hire subcontractors through platform, manage entire job, keep 100% of their portion
  - **Subcontractors**: Specialists (plumber, electrician, roofer), take direct small jobs OR get hired by GCs, keep 100% of their earnings
- **Purpose**: Align incentives - operators fund platform growth, workers never pay fees, everyone profits from volume
- **Trigger**: User role selection at signup, territory purchase for operators, job type routing for contractors
- **Progression**: 
  - Operator: Buy territory → recruit contractors → approve workers → jobs happen → earn 8% automatically → view revenue dashboard
  - GC: Browse large jobs ($10K+) → accept → hire subs through platform → manage project → complete → keep 100% of GC portion
  - Sub: Browse small direct jobs OR get hired by GC → accept → do work → complete → keep 100% (no fees)
- **Success criteria**: Clear role distinction in UI, operator earnings tracked correctly (8% of territory jobs), contractors see $0 fees on all transactions, GCs can hire subs within platform, money flows correctly (homeowner → 8% operator → remainder to workers)

### Money Flow (Zero Fees for Workers)
- **Functionality**: Homeowner pays upfront, money held in escrow, upon completion: 8% to territory operator, 92% to workers (GC + subs OR direct contractor), platform takes portion of operator's 8%
- **Purpose**: Workers never pay fees (attracts best talent), operators fund platform through territory revenue share
- **Trigger**: Job completion and payment release
- **Progression**: Homeowner pays $10,000 → held in escrow → job completed → $800 (8%) to operator → $9,200 to workers → platform takes from operator's $800
- **Success criteria**: Workers see $0 deducted from their earnings, operator receives exactly 8%, escrow holds funds until completion, accurate split for multi-worker jobs (GC hires 3 subs, each gets their portion)

### Route Optimization for Contractors
- **Functionality**: Contractors can optimize their daily routes to visit multiple job sites efficiently using the Trueway Routing API, with options to avoid tolls/highways/ferries, automatic route optimization, distance/duration/cost calculations, and visual map display
- **Purpose**: Save contractors time and money by finding the most efficient path through multiple job locations, reduce fuel costs, improve scheduling accuracy
- **Trigger**: Contractor navigates to Route Planner tab in dashboard
- **Progression**: View active jobs → select jobs to include → configure options (avoid tolls/highways/ferries, return to start) → click Optimize Route → AI calculates optimal order → display map with route → show turn-by-turn directions → view cost/time estimates
- **Success criteria**: Route optimized in <5s, displays total distance/duration/fuel cost, reorders stops for efficiency, shows visual map with numbered stops, provides turn-by-turn leg details, calculates estimated route cost including time value

### Top Navigation System
- **Functionality**: Persistent top navigation bar with main tabs: Home (job posting), Territories (map & claiming), Contractor, Subcontractor, Partners, Referral, Intelligence API, Messages, and user profile with payment access
- **Purpose**: Provide easy access to all platform features with clear organization and hierarchy
- **Trigger**: Always visible at top of screen, dropdowns appear on click
- **Progression**: Click nav item → dropdown opens (if applicable) → select option → navigate to section → content loads
- **Success criteria**: All sections accessible from navigation, dropdowns work smoothly, active state clearly indicated

### Territory Map with Claiming
- **Functionality**: Comprehensive territory map with list/map view toggle, search by zip/city/county/state, territory claiming with ROI calculations, claimed territory tracking with KV persistence
- **Purpose**: Allow operators to discover, evaluate, and claim territories with clear financial projections and 8% revenue share details
- **Trigger**: User navigates to Territories tab in main navigation
- **Progression**: Map loads → switch between map/list view → search territories → click territory → view details (jobs, revenue, price, ROI) → claim territory → confirm purchase → territory saved to profile
- **Success criteria**: All territories searchable and claimable, claims persist between sessions using useKV, ROI calculations accurate, claimed territories display differently

### Intelligence API Marketplace
- **Functionality**: Enterprise API marketplace with 4 pricing tiers (Starter $5K/mo, Professional $25K/mo, Enterprise $100K/mo, Custom), 6 API endpoints (Demand Forecasting, Market Pricing, Labor Availability, Risk Assessment, Territory Valuation, Market Trends), authentication documentation, request/response examples
- **Purpose**: Monetize platform intelligence for non-competing businesses (PE firms, real estate platforms, insurance companies), provide market data APIs
- **Trigger**: User clicks Intelligence API in main navigation
- **Progression**: API page loads → view pricing plans → explore API documentation → select endpoint → view examples → purchase plan → receive API keys
- **Success criteria**: All 4 pricing tiers displayed with features, 6 API endpoints documented with examples, authentication methods explained, plan selection triggers purchase flow

### Quick Job Post Component
- **Functionality**: Three job creation options on home page: Video (60-second AI analysis), Photo (image upload), Text (manual description), each with visual card and gradient styling
- **Purpose**: Make job posting prominent and accessible immediately on home page, offer multiple posting methods to suit user preferences
- **Trigger**: User lands on Home tab (default view)
- **Progression**: Home loads → see 3 posting options → select method → appropriate job creator opens → complete posting flow
- **Success criteria**: All 3 options visible on home page, Video opens VideoJobCreator, Photo/Text show coming soon toast, visually distinct cards with hover effects

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
- **Functionality**: Partnership management with revenue tracking, commission breakdowns, active partnership list, payout requests, partnership creation, and technology integration options (AI partners accessible via Partners > AI Technology)
- **Purpose**: Enable partnership programs, track partner revenue, manage commissions, showcase platform technology capabilities
- **Trigger**: Partner user accesses Partner dropdown → Dashboard or specific partner type (Materials, Insurance, AI Technology, Private Equity, Real Estate)
- **Progression**: Dashboard loads → view stats → see active partnerships → check commission breakdown → request payout → access finance options → view AI learning metrics (Partners > AI Technology only)
- **Success criteria**: Revenue accurately tracked, commissions calculated correctly, payout requests processed, partnership data displayed, AI learning metrics visible only in Partners > AI Technology section

### Admin Analytics Dashboard
- **Functionality**: Comprehensive platform analytics including total users, contractors, homeowners, jobs, revenue, completion rates, top states, top services, revenue by month with visual charts and trends
- **Purpose**: Give administrators insight into platform performance, identify growth opportunities, track key metrics
- **Trigger**: Admin user accesses Admin icon in header
- **Progression**: Analytics loads → view overview stats → check state rankings → review service popularity → analyze revenue trends → export data
- **Success criteria**: All metrics accurate, charts display correctly, trends calculated properly, data refreshes regularly (Note: AI/learning metrics are NOT shown here - those are in Partners > AI Technology section only)

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

### AI Learning Feedback System
- **Functionality**: After job completion, contractors provide actual costs, materials cost, and labor hours; system compares with predictions and collects accuracy feedback (visible only in Partners > AI Technology section)
- **Purpose**: Continuously improve estimation accuracy through real-world outcome data
- **Trigger**: Contractor marks job as complete
- **Progression**: Job completion form → enter actual cost/materials/labor → mark complete → feedback modal appears → rate accuracy (0-100%) → add comments (optional) → submit → system learns from data → accuracy trends displayed on Partners > AI Technology dashboard
- **Success criteria**: Feedback stored per job, accuracy calculated correctly, trends displayed in Partners > AI Technology section only, predictions improve over time, accuracy score visible (85%+ target)

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

The design should feel modern, fluid, and professional - like browsing a high-end marketplace where every interaction is purposeful. Use of glassmorphism (frosted glass effects with backdrop blur), smooth animations throughout the interface, and slightly reduced border radius (0.375rem instead of 1rem) create a more refined, less playful aesthetic that communicates trust and expertise.

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

Typography should convey precision, modern professionalism, and approachability using Plus Jakarta Sans - a contemporary geometric sans-serif that balances technical clarity with warmth. Its slightly rounded terminals create a friendly yet professional tone perfect for a platform connecting homeowners and contractors.

- **Typographic Hierarchy**:
  - H1 (Page Title): Plus Jakarta Sans Bold/40px (2.5rem)/tight line height 1.2/letter spacing -0.02em
  - H2 (Section Headers): Plus Jakarta Sans Bold/32px (2rem)/tight line height 1.2/letter spacing -0.02em  
  - H3 (Component Titles): Plus Jakarta Sans Bold/24px (1.5rem)/tight line height 1.2/letter spacing -0.02em
  - H4 (Subsection): Plus Jakarta Sans Bold/20px (1.25rem)/tight line height 1.2/letter spacing -0.02em
  - Body (Primary Text): Plus Jakarta Sans Regular/15px/relaxed line height 1.6
  - Small (Metadata/Labels): Plus Jakarta Sans Medium/13px/normal line height 1.4
  - Mono (Technical Data/Code): Space Mono Regular/13px for API examples and technical specifications

## Animations

Animations should run at 225fps equivalent (ultra-smooth, imperceptible lag) - every interaction feels instant and fluid. All transitions use optimized durations: ultra-fast (0.044s), fast (0.088s), normal (0.133s), smooth (0.177s), slow (0.266s).

- **Purposeful Meaning**: Video upload drag-drop with instant visual feedback, AI analysis progress with smooth percentage updates, confidence score animates in with spring physics, frame extraction shows seamless transition, job cards lift with silky hover, territory map states highlight instantly
- **Hierarchy of Movement**: 
  1. Primary: Video analysis pipeline (frame extraction → AI thinking → scope generation) with progress indicators
  2. Secondary: Job creation flow, territory revenue updates, contractor approvals
  3. Tertiary: Hover states on cards, button presses, navigation transitions

All framer-motion transitions updated to 225fps equivalent timing:
- Button/card hover: 0.088s (fast)
- Page transitions: 0.177s (smooth) 
- AI analysis progress: 0.133s updates (normal)
- Micro-interactions: 0.044s (ultra-fast)
- Spring animations: high stiffness (300), optimal damping (25)

## Component Selection

- **Components**: 
  - Card (scope results, pricing breakdown) with subtle shadows and reduced radius (0.375rem base)
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
  - Confidence meter as circular progress indicator
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
  - Border radius: --radius: 0.375rem (reduced from 1rem for more professional appearance)

- **Mobile**: 
  - Stack all grid layouts to single column on <768px
  - Reduce heading sizes by 25% on mobile
  - Convert tables to card-style layouts with vertical data arrangement
  - Full-width buttons on mobile, inline on desktop
  - Collapsible sections for materials/recommendations to reduce scroll
  - Touch-optimized file input with larger tap targets (min 44px)
