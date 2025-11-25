# AI-Powered Home Services Platform

An intelligent platform that analyzes home repair videos using AI vision, generates detailed job scopes, suggests optimal contractor pricing, and learns from outcomes to improve accuracy over time.

**Experience Qualities**:
1. **Intelligent** - The platform acts as an expert construction estimator, providing detailed analysis and insights that feel professional and trustworthy
2. **Efficient** - Video upload to complete job scope happens seamlessly with clear progress indicators showing each AI processing step
3. **Transparent** - Every AI decision includes confidence scores, detailed breakdowns, and reasoning to build user trust

**Complexity Level**: Complex Application (advanced functionality, accounts)
- Involves AI vision processing, multi-step analysis pipeline, persistent learning database, and sophisticated pricing algorithms with self-improvement capabilities

## Essential Features

### Video Upload & Analysis
- **Functionality**: Drag-and-drop or click-to-upload video files, extract frames, display preview
- **Purpose**: Enable users to submit visual evidence of home repair needs for AI analysis
- **Trigger**: User selects video file or drags into upload zone
- **Progression**: File selection → validation → preview display → frame extraction → ready for analysis
- **Success criteria**: Video previews correctly, file size validated (100MB max), frame extraction succeeds

### AI Vision Processing
- **Functionality**: Extract middle frame from video, send to AI vision model for damage analysis
- **Purpose**: Transform visual content into structured data about damage type, location, urgency
- **Trigger**: Automatic after video upload completes
- **Progression**: Frame extraction → base64 encoding → AI vision API call → parse structured response
- **Success criteria**: AI identifies damage type, location, urgency level, and key observations accurately

### Job Scope Generation
- **Functionality**: AI analyzes video insights to generate detailed job scope with materials, labor, costs
- **Purpose**: Provide contractors and homeowners with comprehensive project understanding
- **Trigger**: Automatic after vision analysis completes
- **Progression**: Video analysis data → AI scope generation → parse materials/costs/recommendations → display results
- **Success criteria**: Generates itemized materials list, labor hours estimate, cost range, recommendations, and warnings

### Dynamic Pricing Suggestions
- **Functionality**: AI suggests optimal contractor pricing based on job scope, market data, contractor profile
- **Purpose**: Help contractors price competitively while maximizing profitability
- **Trigger**: User clicks "Get Pricing Suggestion" button on scope results
- **Progression**: Scope data + market inputs → AI pricing strategy → multiple price options → win probability calculation
- **Success criteria**: Provides suggested price, reasoning, competitive advantage, breakdown, and alternative pricing tiers

### Self-Learning System
- **Functionality**: Records prediction outcomes, calculates accuracy, adjusts future confidence scores
- **Purpose**: Improve AI accuracy over time through feedback loop
- **Trigger**: User submits outcome feedback after job completion
- **Progression**: Record prediction → capture actual outcome → calculate accuracy → update learning context → adjust future predictions
- **Success criteria**: Maintains feedback history, calculates running accuracy metrics, adjusts confidence multipliers

## Edge Case Handling

- **Invalid file types** - Show clear error message indicating only video formats accepted
- **Oversized videos** - Validate file size before processing, show specific size limit in error
- **Frame extraction failure** - Retry with different timestamp, fallback to first frame if middle fails
- **AI API errors** - Display user-friendly error with retry option, log technical details for debugging
- **Malformed AI responses** - Validate JSON structure, provide default values for missing fields
- **Empty learning database** - Use sensible default confidence scores when no historical data exists
- **Network failures** - Show offline indicator, queue requests for retry when connection restored

## Design Direction

The design should feel professional, trustworthy, and intelligent - like consulting with a seasoned construction expert combined with cutting-edge AI technology. A clean, data-driven interface with clear visual hierarchy serves the complex information architecture better than decorative elements that might distract from the analytical nature of the platform.

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

Animations should emphasize the AI's analytical process and data transformation - making the complex workflow feel guided and intentional rather than instantaneous or jarring. Smooth, purposeful transitions reinforce the intelligence at work.

- **Purposeful Meaning**: Use loading animations that suggest analysis depth (progress bars that pause at milestones), smooth reveals for cost data that build trust, and gentle pulsing for AI confidence scores
- **Hierarchy of Movement**: 
  1. Primary: Video upload progress and AI analysis stages (most prominent)
  2. Secondary: Scope result reveals and data table animations
  3. Tertiary: Hover states on interactive elements and micro-interactions

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
