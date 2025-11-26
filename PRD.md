# ServiceHub - Modern Home Services Marketplace Platform

A comprehensive home services marketplace connecting homeowners with verified contractors across all 50 US states. The platform features video-based job creation with AI analysis, territory-based contractor networks, zero-fee structure for contractors (funded by $45/month territory subscriptions), integrated messaging, payment management, and an Intelligence API marketplace for enterprise partners.

**Experience Qualities**:
1. **Professional & Trustworthy** - Clean iOS-inspired interface with glass morphism, verified contractors, secure escrow payments
2. **Zero Fees for Contractors** - Contractors keep 100% of earnings. Territory operators pay $45/month for exclusive lead rights to fund the platform.
3. **Intelligent & Seamless** - Video job analysis, route optimization, real-time messaging, flexible payment options

**Complexity Level**: Complex Application (multi-role marketplace, real-time features, territory management, API ecosystem)
- Video-based job creation with AI-powered damage analysis
- Territory subscription model ($45/month) with exclusive lead rights
- Zero-fee structure for all contractors (100% earnings retention)
- Multi-role system: Homeowners, Contractors, Subcontractors, Territory Operators, Partners
- Real-time messaging and notifications
- Integrated payment processing with financing options
- Route optimization for contractors using Trueway API
- Intelligence API marketplace for enterprise partners

## Essential Features

### Enhanced Home Dashboard
- **Functionality**: Comprehensive home screen featuring prominent "Post a Job" call-to-action card, four stat cards showing key metrics (850+ territories available, 2.8K+ active jobs, 3.5K+ verified contractors, API access starting at $99), Territory Teaser section with map preview, Zero Fees explanation card with detailed payment breakdown visualization showing how $10K job splits (100% to contractor, $20 platform fee from homeowner, territory operator pays separate $45/month subscription)
- **Purpose**: Provide immediate access to core platform features, showcase platform statistics, explain value proposition to contractors (zero fees), encourage territory subscriptions, and highlight API marketplace
- **Trigger**: User lands on Home tab (default view after login)
- **Progression**: Home loads → see prominent "Post a New Job" card → review four metric cards (territories, jobs, contractors, API) → scroll to Territory Teaser → explore Zero Fees benefit card with payment breakdown → understand territory subscription model
- **Success criteria**: All stat cards clickable and navigate to relevant sections, Post a Job card opens UnifiedJobPost modal, zero fees card clearly shows 100% contractor earnings, payment breakdown displays $10K example with $20 homeowner fee and separate territory subscription, Territory Teaser links to territories overview

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

### Video-Based Job Creation
- **Functionality**: Unified job post interface supporting three creation methods: Video (60-second upload with AI frame extraction and damage analysis), Photo (image upload with AI analysis), Text (manual job description). AI analyzes uploaded media to generate detailed scope with materials list, labor hours, cost estimates, and confidence score.
- **Purpose**: Remove friction from job posting, provide instant professional estimates through AI, offer flexible posting options for different user preferences
- **Trigger**: Homeowner clicks "Post a Job" button in header or clicks prominent "Post a New Job" card on home page
- **Progression**: Post a Job clicked → UnifiedJobPost modal opens → select job type (Video/Photo/Text) → upload media or enter description → AI analyzes and extracts key frame → generates scope with confidence score → homeowner reviews and edits → selects service category (60 options across 7 groups) → sets urgency → publishes job → job appears in contractor browse queue
- **Success criteria**: Modal opens smoothly, all three creation methods available, video frame extraction works in <5s, AI analysis completes in <30s, scope includes materials + labor + cost range + confidence score (75%+), job successfully persists and appears in job browser with correct status

### Territory Subscription System
- **Functionality**: Territory operators purchase monthly subscriptions ($45/month) for exclusive lead rights in specific zip codes, counties, or regions. Operators recruit and manage local contractors, approve job bids, and receive priority placement in their territory. No revenue sharing or passive investment structure - operators actively manage their territory network.
- **Purpose**: Fund platform operations through subscription model while maintaining zero fees for contractors. Operators build local contractor networks and provide quality control.
- **Trigger**: User navigates to Territories tab from main navigation
- **Progression**: Territories page loads → browse available territories (map or list view) → search by zip/city/county/state → view territory details (active jobs, contractor count, subscription price) → click "Subscribe" → payment flow ($45/month) → territory activated → operator dashboard unlocked → can recruit contractors and approve bids
- **Success criteria**: All territories searchable and subscribable, subscriptions persist using useKV, subscription status displayed clearly, operators can manage local contractors, exclusive lead access granted within territory, monthly billing automated

### Zero-Fee Contractor Model
- **Functionality**: All contractors (general and subcontractors) keep 100% of their job earnings with zero platform fees. Homeowners pay a one-time $20 platform fee per job. Territory operators separately pay $45/month subscriptions to access leads in their area, which funds platform operations.
- **Purpose**: Attract and retain top contractor talent by eliminating percentage-based fees common on competitor platforms (15-30%). Clear separation between contractor earnings and platform funding.
- **Trigger**: Job completion and payment release, or when viewing pricing information
- **Progression**: Job completed → homeowner pays job amount + $20 platform fee → funds held in escrow → contractor confirms completion → full job amount released to contractor (100%) → platform fee and territory subscription are separate revenue streams
- **Success criteria**: Contractors receive exactly 100% of quoted job amount, no deductions visible on contractor side, homeowner sees clear $20 platform fee on checkout, territory operators billed separately on monthly cycle, payment breakdown displayed accurately on home page card and throughout app

### Route Optimization for Contractors
- **Functionality**: Contractors can optimize their daily routes to visit multiple job sites efficiently using the Trueway Routing API, with options to avoid tolls/highways/ferries, automatic route optimization, distance/duration/cost calculations, and visual map display
- **Purpose**: Save contractors time and money by finding the most efficient path through multiple job locations, reduce fuel costs, improve scheduling accuracy
- **Trigger**: Contractor navigates to Route Planner tab in dashboard
- **Progression**: View active jobs → select jobs to include → configure options (avoid tolls/highways/ferries, return to start) → click Optimize Route → AI calculates optimal order → display map with route → show turn-by-turn directions → view cost/time estimates
- **Success criteria**: Route optimized in <5s, displays total distance/duration/fuel cost, reorders stops for efficiency, shows visual map with numbered stops, provides turn-by-turn leg details, calculates estimated route cost including time value

### Top Navigation System
- **Functionality**: Persistent top navigation bar with glass morphism styling. Main tabs include: Home, Territories, Jobs, Contractors, and role-specific dropdowns (Homeowner, Contractor, Subcontractor). Right side features API, Partners (with dropdown), Warranty (with dropdown showing Coverage/File a Claim), prominent "Post a Job" button, Messages (with unread indicator), Notifications bell icon, Payment icon, and user profile dropdown.
- **Purpose**: Provide easy access to all platform features with clear organization and visual hierarchy. Prominent job posting encourages homeowner engagement.
- **Trigger**: Always visible at top of screen, dropdowns appear on click
- **Progression**: Click nav item → dropdown opens (if applicable, indicated by caret icon) → select option → navigate to section → content loads with smooth animation
- **Success criteria**: All sections accessible from navigation, dropdowns work smoothly with clear visual indicators, active state clearly indicated, Messages shows unread count, glass morphism effect renders correctly, navigation responds to hover/click with appropriate micro-animations

### Territory Management System
- **Functionality**: Interactive territory browser with map and list views, search by zip/city/county/state, territory details showing job count and contractor network size, subscription purchasing ($45/month), territory dashboard for operators showing active subscriptions, revenue from leads, contractor approvals, and territory performance metrics
- **Purpose**: Enable territory operators to discover, subscribe to, and manage geographic territories. Provide exclusive lead access within subscribed areas.
- **Trigger**: User navigates to Territories tab in main navigation
- **Progression**: Territories page loads → toggle between map/list view → search territories → click territory → view details (active jobs, contractors, subscription price) → subscribe to territory → payment processed ($45/month) → territory added to operator dashboard → receive exclusive leads → manage contractor network
- **Success criteria**: All territories searchable and subscribable, subscriptions persist using useKV, operator dashboard displays all active territories, subscription billing automated monthly, operators receive leads only from subscribed territories, territory metrics update in real-time

### Intelligence API Marketplace
- **Functionality**: Enterprise API marketplace offering 6 specialized APIs: Pricing Intelligence API ($49/mo - real-time pricing data for 60+ service categories), Job Intelligence API ($89/mo - anonymized job data and market trends), Contractor Network API ($129/mo - contractor availability and capacity data), Warranty Intelligence API ($79/mo - warranty claims analysis), Compliance API ($99/mo - licensing and insurance verification), Territory Intelligence API ($109/mo - geographic market data). Also offers bundled tiers: Starter ($199/mo - 3 APIs), Professional ($449/mo - 5 APIs + priority support), Enterprise ($1,299/mo - all 6 APIs + dedicated support). Includes authentication documentation, request/response examples, rate limits, and usage dashboard.
- **Purpose**: Monetize platform intelligence for enterprise partners (PE firms analyzing acquisitions, real estate platforms, insurance companies, material suppliers, competitors) while maintaining data privacy and security
- **Trigger**: User navigates to API tab in main navigation
- **Progression**: API page loads → view bundled pricing tiers and individual API products → explore features and endpoints → review authentication documentation → select plan or specific APIs → complete purchase → receive API keys and credentials → access usage dashboard → make API calls
- **Success criteria**: All 6 individual APIs listed with clear pricing and features, 3 bundled tiers displayed prominently with savings calculations, authentication methods documented (OAuth 2.0, API keys), request/response examples shown for each endpoint, rate limits clearly stated, usage dashboard tracks API calls and remaining quota, payment flow integrated with main payment system

### Real-Time Messaging System
- **Functionality**: Built-in chat system enabling direct communication between homeowners and contractors. Features include conversation list with unread indicators, per-job message threads, real-time message delivery, read receipts, online status indicators, message timestamps, and message history persistence using useKV.
- **Purpose**: Centralize all job-related communication, provide clear conversation history for reference, reduce need for external communication tools, create audit trail for disputes
- **Trigger**: User clicks Messages button in navigation (shows unread count badge) or initiates chat from job details
- **Progression**: Messages page loads → see conversation list sorted by recent activity → unread conversations highlighted → select conversation → view full message history → type message → send (with visual feedback) → recipient receives instant notification → message appears in conversation → read receipts update
- **Success criteria**: All messages persist using useKV, conversations grouped per job, unread count badge displays correctly, messages appear instantly for both parties, timestamps show in user's local timezone, read receipts update accurately, online status indicators functional, message history scrollable with newest at bottom

### 50-State Contractor Database
- **Functionality**: Comprehensive database of all 50 US states with interactive SVG map visualization. Each state shows: active contractor count, total completed jobs, average rating, top 5 service categories, licensing authority information, licensing website links, and state-specific requirements. Includes clickable map, searchable list view, and detailed state pages.
- **Purpose**: Help homeowners find contractors across all states, understand regional availability, access state licensing information, view state-specific regulations
- **Trigger**: User clicks Contractors in navigation or selects state from territory map
- **Progression**: Contractor browse page loads → interactive map displays all 50 states with color coding by contractor density → user clicks state or searches list → state detail modal appears → shows contractor count, job statistics, ratings, top services → displays licensing authority and website link → user can browse contractors in that state
- **Success criteria**: All 50 states clickable on map and searchable in list, accurate contractor counts per state, licensing authority information correct and up-to-date, state website links functional, smooth map interactions with hover states, list/map view toggle works, state color coding reflects contractor density accurately

### Integrated Chat System
- **Functionality**: Real-time messaging between homeowners and contractors with conversation list, message history, read receipts, online status indicators, message timestamps, and photo attachment support
- **Purpose**: Centralize communication, provide clear conversation history, enable quick responses, create audit trail
- **Trigger**: User clicks Messages in navigation or initiates chat from job
- **Progression**: Open messages → see conversation list with unread indicators → select conversation → view history → type message → attach photos (optional) → send → recipient receives notification → read receipts update → conversation persists
- **Success criteria**: Messages saved per conversation using useKV, real-time updates work, unread indicators accurate, both parties can communicate, timestamps display correctly, photo attachments upload and display

### Payment Management with Finance Options
- **Functionality**: Comprehensive payment system with full payment, 3-month installments (2% fee), and 12-month 0% financing options. Displays clear payment breakdowns showing job amount, $20 platform fee, contractor receives (100% of job amount), escrow protection status, multiple payment methods (credit card, bank transfer, digital wallet), and secure PCI-compliant payment processing with Stripe integration. Separate territory subscription billing ($45/month) for operators.
- **Purpose**: Provide flexible payment options for homeowners, increase affordability through financing, track payment history, ensure secure transactions with escrow protection, clearly communicate zero-fee contractor model
- **Trigger**: Job completion, clicking payment icon in navigation, or selecting payment option from job details
- **Progression**: Payment screen loads → select payment plan (full/3mo/12mo) → choose payment method (card/bank/wallet) → enter payment details → review summary showing job amount + $20 platform fee (homeowner pays) + contractor receives 100% → confirm → process payment → funds held in escrow → job completed → release full amount to contractor → receive confirmation
- **Success criteria**: All payment methods work correctly, installment tracking accurate, payment history maintained, finance approval process clear, escrow protection displayed prominently, breakdown clearly shows contractor receives 100% of job amount, $20 platform fee itemized separately, secure SSL encryption confirmed, territory subscription billing separate from job payments

### Partner Dashboard & Integrations
- **Functionality**: Partnership ecosystem featuring Materials Partners (suppliers like Home Depot, Lowe's offering bulk pricing), Insurance Partners (warranty providers, liability coverage), Technology Partners (API consumers, integration partners), Private Equity Partners (investment firms using market data), and Real Estate Partners (property platforms). Dashboard shows partnership status, commission tracking (for referral partnerships), revenue metrics, active integrations, and API usage statistics.
- **Purpose**: Build ecosystem of complementary businesses, generate additional revenue through partnerships, provide value-added services to contractors and homeowners, monetize platform data through API partnerships
- **Trigger**: Partner user accesses Partners dropdown in navigation or admin views partner management
- **Progression**: Partner dashboard loads → view active partnerships by category → check partnership stats → review commission/revenue breakdown → access API credentials (for tech partners) → request payouts → view integration status → manage partner profile
- **Success criteria**: All partnership types displayed clearly, revenue/commissions tracked accurately per partner, API usage statistics visible for tech partners, payout requests processed, partnership agreements accessible, integration status indicators functional

### Platform Analytics Dashboard
- **Functionality**: Admin-only comprehensive analytics dashboard showing: total users (by role: homeowners, contractors, subcontractors, operators), total jobs (active, completed, disputed), platform revenue, average job value, job completion rate, top performing states (by job volume), top service categories (by demand), revenue trends by month with charts, contractor growth metrics, territory subscription metrics
- **Purpose**: Give platform administrators insight into business performance, identify growth opportunities, track key metrics, monitor platform health, make data-driven decisions
- **Trigger**: Admin user clicks Analytics icon in header (only visible to admin role)
- **Progression**: Analytics dashboard loads → view overview metrics (users, jobs, revenue) → review state rankings chart → analyze service category trends → examine revenue by month graph → check contractor network growth → review territory subscription metrics → export data for external analysis
- **Success criteria**: All metrics calculated accurately from real data, charts render correctly with proper scales, trends show meaningful patterns, state rankings sorted correctly, service categories reflect actual job distribution, revenue calculations match financial records, data refreshes on navigation or page reload, export functionality works

### Warranty Coverage System
- **Functionality**: Platform warranty program covering completed jobs with coverage details, claim filing process, warranty documentation, claim status tracking, and partner insurance integration. Displays warranty terms (duration, coverage limits, exclusions), claim submission form with photo upload, claim review process, and payout tracking.
- **Purpose**: Provide peace of mind to homeowners, differentiate from competitors, increase contractor credibility, generate additional revenue through warranty fees
- **Trigger**: User navigates to Warranty dropdown in navigation, selects Coverage or File a Claim
- **Progression**: Warranty page loads → view coverage details and terms → see eligible jobs → file claim (if needed) → upload photos and description → submit claim → claim reviewed → status updates → payout processed (if approved) → claim history maintained
- **Success criteria**: Warranty terms clearly displayed, eligible jobs identified correctly, claim submission form functional, photo uploads work, claim status tracking accurate, payouts processed through payment system, warranty partners integrated, claim history persists using useKV
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

### User Roles & Authentication
- **Functionality**: Role-based authentication system with three primary user types: Homeowner, Contractor, and Subcontractor. Login modal features role selection cards with icons and descriptions. Profile management includes legal consent tracking, role-specific dashboards, and demo data initialization using useKV for data persistence.
- **Purpose**: Enable distinct experiences for different user types with appropriate permissions and features. Maintain user sessions and preferences across visits.
- **Trigger**: App launch when no user session exists, or logout action
- **Progression**: App loads → login modal displays → user selects role from three cards (Homeowner/Contractor/Subcontractor) → enters email and password → submits → legal consent modal (if first-time) → accepts agreements → user profile created/loaded → role-specific dashboard displays
- **Success criteria**: Role selection persists across sessions, profiles saved using useKV, appropriate features visible per role, legal consents recorded with timestamp, role-specific navigation displayed, demo data initialized on first load

### Job Browsing & Discovery
- **Functionality**: Comprehensive job browser with filtering by service category (60 options), location/distance, budget range, urgency level, and keyword search. Grid or list view toggle, job cards showing thumbnail/description/budget/location, and real-time updates as new jobs are posted.
- **Purpose**: Help contractors discover relevant opportunities quickly, enable efficient job search, match contractors with appropriate work
- **Trigger**: Contractor clicks "Jobs" tab in main navigation
- **Progression**: Jobs page loads → displays all available jobs → apply filters (category/location/budget/urgency) → search by keyword → toggle view mode → click job card → view full details → submit bid or save for later
- **Success criteria**: All active jobs displayed correctly, filters work and update results instantly, search returns relevant matches, job cards show complete information, view toggle switches layouts smoothly, saved jobs persist using useKV, real-time updates show newly posted jobs

### Contractor Profiles & Verification
- **Functionality**: Detailed contractor profiles displaying: ratings (overall and per category), completed job count, specialties/skills, service area (states/cities), license information with verification badges, insurance certificates, availability calendar, portfolio photos, reviews from homeowners, and response time metrics
- **Purpose**: Build trust through transparency, help homeowners select qualified contractors, showcase contractor credentials and experience
- **Trigger**: Clicking contractor name from job bid, browsing contractor directory, or viewing contractor's own profile
- **Progression**: Profile page loads → view overview stats (rating, jobs, badges) → scroll through portfolio photos → read homeowner reviews → check license/insurance verification → view service areas → see availability → contact contractor or accept bid
- **Success criteria**: All profile fields display correctly, verification badges show when credentials confirmed, ratings calculated accurately, portfolio photos upload and display, reviews display chronologically, service areas map correctly to territories, availability calendar functional

### Notifications System
- **Functionality**: Real-time notification center showing: new job postings (for contractors in subscribed territories), bid received (for homeowners), bid accepted/rejected, payment received, message received, job status updates, warranty claim updates. Bell icon in header with unread count badge, notification list with timestamps, read/unread status, and click-through to related content.
- **Purpose**: Keep users informed of important platform activities, encourage timely responses, improve engagement
- **Trigger**: User clicks bell icon in navigation header, or notifications arrive in real-time
- **Progression**: Bell icon shows unread count → user clicks icon → notifications panel opens → displays list sorted by time → user clicks notification → marks as read → navigates to related content (job, message, etc.)
- **Success criteria**: Notifications appear instantly when events occur, unread count badge accurate, clicking notification marks as read, notifications persist using useKV, notifications link correctly to related content, notification types properly categorized

### Contractor Dashboards (General & Subcontractor)
- **Functionality**: Role-specific dashboards with three main sections accessible via dropdown: Dashboard (overview stats, active jobs, earnings summary), My Jobs/Estimates (list of bids and active projects with status), Route Planner (route optimization for multiple job sites). Dashboard shows: total earnings, active jobs count, pending bids, average rating, recent activity feed, quick actions (browse jobs, view messages).
- **Purpose**: Provide contractors with centralized workspace, track job pipeline, manage earnings, optimize routes
- **Trigger**: Contractor or Subcontractor clicks role dropdown in navigation and selects Dashboard/My Jobs/Route Planner
- **Progression**: Dashboard loads → view overview metrics → check active jobs list → review pending bids → see earnings breakdown → access route planner → optimize daily schedule → view recent notifications
- **Success criteria**: Stats calculate accurately from user's job data, active jobs display with correct status, pending bids tracked, earnings sum correctly (100% of job amounts), route planner functional with Trueway API, recent activity updates in real-time, quick actions navigate correctly

### Homeowner Dashboard
- **Functionality**: Homeowner workspace with two main views accessible via dropdown: Profile (personal information, saved payment methods, notification preferences) and My Jobs (all posted jobs with status tracking). Dashboard displays: active jobs count, pending bids to review, completed projects, total spent, quick action to post new job.
- **Purpose**: Centralize homeowner's job management, track project progress, review contractor bids, manage profile settings
- **Trigger**: Homeowner clicks role dropdown in navigation and selects Profile or My Jobs
- **Progression**: Dashboard loads → view active jobs → see pending bids needing review → click job to see details → compare contractor bids → accept bid → track job progress → rate contractor on completion → view job history
- **Success criteria**: All homeowner jobs displayed with correct status, bid comparison works, job details accurate, contractor selection process functional, ratings submitted successfully, spending totals calculated correctly, profile updates save using useKV

### Referral System
- **Functionality**: User referral program with unique referral codes/links, shareable via email or social media, referral tracking dashboard showing referred users and their status, reward calculation ($50 per completed referral), earnings dashboard, and payout requests.
- **Purpose**: Encourage organic user growth through word-of-mouth, reward existing users for platform advocacy, track referral success metrics
- **Trigger**: User clicks profile dropdown or navigates to dedicated referral page
- **Progression**: Referral page loads → unique code/link displayed → copy or share via buttons → track referrals in dashboard → see status (pending/completed/rewarded) → view earnings → request payout when threshold met → receive payment
- **Success criteria**: Unique referral codes generated per user, tracking works across signup flow, rewards credited correctly, earnings accumulate, payout requests process through payment system, referral stats display accurately

### Rating & Review System
- **Functionality**: After job completion, homeowners rate contractors on five dimensions: Overall Quality (1-5 stars), Professionalism, Communication, Timeliness, and Cleanliness. Written review optional. Ratings aggregate to contractor profile, displayed on bids and profile pages. Contractors can respond to reviews.
- **Purpose**: Build contractor reputation, help homeowners make informed decisions, provide feedback mechanism, maintain service quality standards
- **Trigger**: Job marked complete, homeowner prompted to rate contractor
- **Progression**: Job completes → rating modal appears → homeowner rates on five dimensions → writes optional review → submits → ratings aggregate to contractor profile → contractor receives notification → can respond to review → ratings visible to all users
- **Success criteria**: Multi-dimension ratings save correctly, overall score calculated as average, ratings display on contractor profiles and bids, review text displays properly, contractor responses work, ratings persist using useKV, ratings influence contractor search ranking

## Edge Case Handling

- **No user session** - Show login modal, initialize demo data on first load
- **Role switching** - Preserve data when switching between contractor/homeowner views, show appropriate UI per role
- **Empty job lists** - Show helpful empty states with call-to-action to browse/post jobs
- **Invalid video formats** - Validate file type (.mp4, .mov, .avi) and size (<100MB) before upload
- **AI analysis failures** - Graceful degradation, allow manual scope entry, show retry button
- **Message ordering** - Ensure messages display chronologically with consistent timestamps
- **Duplicate territory subscriptions** - Prevent subscribing to same territory twice
- **Expired subscriptions** - Flag expired territory subscriptions, restrict lead access until renewed
- **Concurrent bid acceptance** - Handle race condition if homeowner tries to accept multiple bids simultaneously
- **Payment processing failures** - Show clear error messages, retry mechanisms, support contact
- **Notification spam** - Batch related notifications, collapse duplicate types
- **Profile incomplete** - Warn contractors if missing critical verification before allowing bids
- **Job without media** - Support text-only job creation as fallback option
- **Timezone handling** - Store all dates in UTC, display in user's local timezone
- **Browser storage limits** - Monitor useKV storage usage, implement data archival for old jobs
- **Expired licenses** - Flag expired contractor licenses in profile, prevent bidding until renewed
- **Insufficient insurance** - Block contractors with <$1M coverage from bidding on jobs
- **License threshold enforcement** - Check job amount against state minimums, require appropriate license level
- **Independent contractor compliance** - Monitor for activities that could affect classification (mandatory training, price controls, etc.)
- **Consent withdrawal** - Handle GDPR/CCPA data deletion requests, maintain compliance logs
- **Territory subscription management** - Clarify active management requirements, prevent passive investment appearance
- **Multi-state licensing** - Track contractors working across state lines, validate licenses in each state
- **Trade-specific requirements** - Enforce electrical/plumbing/HVAC license requirements regardless of job size
- **Payment processor compliance** - Use Stripe Connect to avoid money transmitter licensing issues
- **Terms updates** - Notify users of terms changes, require re-acceptance of material changes
- **Minor users** - Age gate to prevent <18 registration (COPPA compliance)
- **Stale job listings** - Auto-expire jobs after 30 days without activity
- **Contractor capacity** - Allow contractors to set max active jobs, hide from search when at capacity
- **Disputed payments** - Escrow hold process, mediation workflow, evidence submission

## Design Direction

The design should feel like a modern SaaS platform with iOS-inspired precision - clean, professional, and trustworthy. Glass morphism with subtle blur effects, smooth micro-interactions that feel engineered and responsive, and a refined color palette centered on professional blue that communicates intelligence, reliability, and trust. The interface should recede to let content shine while providing delightful interactions at key touch points.

## Color Selection

**Custom palette** inspired by iOS 18 system colors with professional blue (intelligence/trust) and emerald green (success states).

- **Primary Color**: Professional Blue `oklch(0.45 0.20 264)` - communicates intelligence, precision, and trust (iOS-inspired)
- **Secondary Colors**: Muted Purple-Blue `oklch(0.55 0.12 264)` for supporting elements
- **Accent Color**: Professional Blue `oklch(0.50 0.18 264)` for interactive highlights
- **Success Color**: Emerald Green `oklch(0.60 0.17 158)` - for success pulse animations (0.4s duration)
- **Background**: Clean White with subtle gradient `oklch(0.98 0.002 264)` - iOS-inspired purity
- **Foreground/Background Pairings**:
  - Background (Clean White `oklch(0.98 0.002 264)`): Dark text `oklch(0.09 0.005 264)` - Ratio 19.2:1 ✓
  - Card (Glass `oklch(0.98 0.001 264 / 0.72)`): Dark text `oklch(0.09 0.005 264)` - Ratio 18.8:1 ✓
  - Primary (Professional Blue `oklch(0.45 0.20 264)`): White text `oklch(0.99 0 0)` - Ratio 8.1:1 ✓
  - Secondary (Muted Purple-Blue `oklch(0.55 0.12 264)`): White text `oklch(0.99 0 0)` - Ratio 5.8:1 ✓
  - Accent (Professional Blue `oklch(0.50 0.18 264)`): White text `oklch(0.99 0 0)` - Ratio 6.2:1 ✓
  - Success (Emerald Green `oklch(0.60 0.17 158)`): White text `oklch(0.99 0 0)` - Ratio 4.9:1 ✓

**Note**: Dark mode is intentionally not implemented. The platform maintains a consistent light theme for all users.

## Font Selection

Typography should convey precision and modern professionalism using Plus Jakarta Sans - a contemporary geometric sans-serif that balances technical clarity with approachability, matching iOS system font aesthetics.

- **Typographic Hierarchy**:
  - H1 (Page Title): Plus Jakarta Sans Bold/40px (2.5rem)/tight line height 1.2/letter spacing -0.02em
  - H2 (Section Headers): Plus Jakarta Sans Bold/32px (2rem)/tight line height 1.2/letter spacing -0.02em  
  - H3 (Component Titles): Plus Jakarta Sans Bold/24px (1.5rem)/tight line height 1.2/letter spacing -0.02em
  - H4 (Subsection): Plus Jakarta Sans Bold/20px (1.25rem)/tight line height 1.2/letter spacing -0.02em
  - Body (Primary Text): Plus Jakarta Sans Regular/15px/relaxed line height 1.6
  - Small (Metadata/Labels): Plus Jakarta Sans Medium/13px/normal line height 1.4
  - Mono (Technical Data/Code): Space Mono Regular/13px for API examples and technical specifications

## Animations

**Modern SaaS micro-interactions** - smooth, purposeful, and professional:

- **Button Press**: Scale down 4% (0.96) on press with 110ms cubic-bezier(0.32, 0, 0.67, 0) - mechanical feel
- **Card Hover**: Lift 8px with 280ms cubic-bezier(0.34, 1.25, 0.64, 1) + enhanced shadow
- **Success Actions**: Emerald-green pulse border animation (400ms) with expanding glow
- **Loading States**: Horizontal progress bar with smooth motion (1.8s back-and-forth)
- **Page Transitions**: 400ms fade with slight vertical movement for content changes
- **Modal Open**: Scale and fade in (300ms) with backdrop blur
- **Notification Toast**: Slide in from top-right with bounce (200ms)

- **Purposeful Meaning**: Every animation serves a function - buttons feel tactile, cards feel substantial, success states feel rewarding, loading feels purposeful
- **Hierarchy of Movement**: 
  1. Primary: Page transitions, modal opens/closes, major state changes
  2. Secondary: Card hovers, form submissions, success animations  
  3. Tertiary: Button presses, icon highlights, micro-feedback

**Motion Guidelines**: Animations should feel smooth and intentional, never distracting. Use consistent timing functions across similar interactions. Respect user preferences for reduced motion.

## Component Selection

- **Components**: 
  - Card (job listings, stat displays, profile sections) with glass morphism and subtle shadows
  - Button (primary actions, navigation) with solid fills and hover state transitions
  - Dialog/Modal (job creation, payment, confirmations) with backdrop blur
  - Tabs (dashboard sections, view switching) with underline indicator
  - Table (job lists, contractor directory) with hover row highlighting  
  - Badge (status indicators, categories, counts) with color-coded backgrounds
  - Avatar (user profiles, contractor cards) with fallback initials
  - Dropdown Menu (navigation, user profile, actions) with smooth animation
  - Input/Textarea (forms, job posting, messaging) with focus states
  - Progress (upload status, profile completion) with animated fill
  - Toast (notifications via Sonner) with slide-in animation
  - Separator between major sections for visual structure

- **Customizations**: 
  - Custom video/photo upload component with drag-and-drop and preview
  - AI analysis progress indicator with multi-step visualization
  - Territory map with interactive SVG states and hover effects
  - Route planner map with numbered waypoints and path visualization
  - Payment breakdown card showing fee structure clearly
  - Rating stars component with half-star precision
  - Message thread component with timestamp and read receipts

- **States**: 
  - Buttons: default, hover (darker), active (scale down), disabled (opacity 50%), loading (spinner)
  - Inputs: default, focus (ring + border color), error (destructive border), success (green border), disabled
  - Cards: default, hover (lift + shadow), active (pressed), selected (border highlight)
  - Upload zones: default (dashed border), hover (solid blue border), dragging (blue background), uploading (progress bar)

- **Icon Selection** (using @phosphor-icons/react): 
  - VideoCamera (upload), Camera (photos), TextAlignLeft (text), Eye (view), Package (materials), 
  - ClockCounterClockwise (time), CurrencyDollar (pricing), CheckCircle (success), Warning (alerts), 
  - MapPin (location), MapTrifold (territories), Hammer (contractors), House (homeowner), 
  - User/UserCircle (profiles), ChatCircle (messages), BellRinging (notifications), 
  - CreditCard (payments), ShieldCheck (verified), Star (ratings), CaretDown (dropdowns)

- **Spacing**: 
  - Component padding: p-6 for cards, p-4 for nested content, p-2 for compact elements
  - Section gaps: gap-8 between major sections, gap-4 for related items, gap-2 for tight groups
  - Grid layouts: gap-6 for feature cards, gap-4 for job cards, gap-3 for list items
  - Page margins: max-w-7xl mx-auto with px-4 for consistent edge spacing
  - Border radius: --radius: 0.875rem (14px) for modern, friendly feel

- **Mobile**: 
  - Stack all grid layouts to single column below 768px breakpoint
  - Reduce heading sizes by 20-25% on mobile devices
  - Full-width buttons and cards on mobile, maintain desktop widths on larger screens
  - Collapsible navigation menu (hamburger) on mobile
  - Touch-optimized inputs with larger tap targets (min 44x44px)
  - Hide less critical information on mobile, show via expand/details pattern
  - Sticky header with reduced height on mobile
  - Bottom navigation bar consideration for key mobile actions
