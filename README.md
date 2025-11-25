# AI-Powered Home Services Platform

An intelligent platform that analyzes home repair videos using AI vision, generates detailed job scopes with materials and costs, suggests optimal contractor pricing strategies, and continuously learns from outcomes to improve accuracy over time.

## Features

### 🎥 Video Analysis & Job Scoping
- **Drag-and-drop video upload** - Upload videos of home damage (MP4, MOV, AVI up to 100MB)
- **AI Vision Processing** - Extracts and analyzes video frames to identify damage type, location, urgency
- **Detailed Job Scopes** - Generates comprehensive scopes including:
  - Materials list with quantities and estimated costs
  - Labor hour estimates
  - Cost ranges (min/max)
  - Recommendations for best practices
  - Risk warnings and safety considerations
  - Permit requirements
  - AI confidence scores

### 💰 Dynamic Pricing Optimization
- **AI Pricing Strategist** - Suggests optimal contractor pricing based on:
  - Job scope complexity and materials
  - Market rates and competitor pricing
  - Contractor profile (rating, completed jobs)
  - Market demand levels
- **Win Probability Calculation** - Estimates likelihood of winning the bid
- **Multiple Pricing Tiers** - Aggressive, balanced (recommended), and premium options
- **Detailed Breakdowns** - Shows materials, labor, overhead, and profit margins

### 📊 Self-Learning System
- **Feedback Loop** - Records prediction outcomes and user feedback
- **Continuous Improvement** - Adjusts confidence scores based on historical accuracy
- **Performance Metrics** - Tracks accuracy trends over time
- **Learning Dashboard** - Visualizes system performance and improvement

### 🗺️ Route Optimization for Contractors
- **Smart Route Planning** - Optimizes daily routes for visiting multiple job sites
- **Cost Savings** - Calculates fuel costs and time estimates
- **Flexible Options** - Avoid tolls, highways, or ferries based on preferences
- **Visual Maps** - Interactive route visualization with numbered stops
- **Turn-by-Turn** - Detailed directions for each route segment
- **API Integration** - Powered by Trueway Routing API for accurate directions

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **UI Components**: shadcn/ui v4 (40+ pre-configured components)
- **Styling**: Tailwind CSS v4 with custom theme
- **AI**: Spark Runtime LLM API (GPT-4o with vision capabilities)
- **Routing**: Trueway Routing API (OpenAPI 3.0.1 integration)
- **State Management**: React hooks + Spark KV persistence
- **Icons**: Phosphor Icons
- **Build Tool**: Vite

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Trueway API key:
   ```
   VITE_TRUEWAY_API_KEY=your_api_key_here
   ```
4. Get your API key from [API.market](https://api.market/) (Trueway Routing API)
5. Start the development server: `npm run dev`

## How It Works

### 1. Video Upload Flow
```
User uploads video 
  → Extract middle frame from video
  → AI Vision analyzes frame (damage type, location, urgency)
  → AI generates detailed job scope
  → Display results with confidence score
```

### 2. Route Optimization Flow
```
Contractor views active jobs
  → Select jobs to visit
  → Configure route options (avoid tolls/highways/ferries)
  → System calls Trueway Routing API
  → Optimizes stop order for efficiency
  → Display map with route + turn-by-turn directions
  → Show total distance/duration/fuel cost
```

### 3. AI Analysis Process
The system uses a multi-stage AI pipeline:
1. **Vision Analysis** - GPT-4o vision model examines video frames
2. **Scope Generation** - Expert construction estimator persona creates detailed scope
3. **Pricing Strategy** - Pricing strategist optimizes contractor bid

### 4. Learning Loop
```
Prediction made 
  → User provides feedback
  → System calculates accuracy
  → Updates learning context
  → Adjusts future confidence multipliers
```

## Architecture

```
src/
├── components/
│   ├── VideoUploader.tsx       # Main video upload & analysis UI
│   ├── PricingSuggester.tsx    # Pricing optimization interface
│   ├── LearningDashboard.tsx   # Performance metrics & history
│   ├── RouteOptimizer.tsx      # Route planning with job selection
│   ├── RouteMap.tsx            # Visual route map display
│   └── ui/                     # shadcn components (40+)
├── lib/
│   ├── ai-service.ts           # Core AI logic & learning database
│   ├── routing-api.ts          # Trueway API integration & helpers
│   └── utils.ts                # Utility functions
├── App.tsx                     # Main app with tab navigation
└── index.css                   # Tailwind theme configuration
```

## Key Components

### AI Service (`src/lib/ai-service.ts`)
- `analyzeVideoFrames()` - Vision-based frame analysis
- `analyzeJobFromVideo()` - Generate job scope from video analysis
- `suggestOptimalPricing()` - Calculate optimal pricing strategy
- `recordPredictionOutcome()` - Store feedback for learning
- `LearningDatabase` class - Persistent learning storage using Spark KV

### Routing Service (`src/lib/routing-api.ts`)
- `findDrivingRoute()` - Optimize route for multiple stops
- `findDrivingPath()` - Find path from origin to destination
- `optimizeJobRoute()` - Optimize contractor's daily job route
- `formatDistance()` / `formatDuration()` - Display helpers
- `calculateFuelCost()` - Estimate fuel expenses
- Route types matching OpenAPI 3.0.1 spec

### Video Uploader (`src/components/VideoUploader.tsx`)
- File validation and preview
- Frame extraction from video
- Multi-stage progress indicators
- Tabbed results (Scope + Pricing)
- Comprehensive scope display

### Pricing Suggester (`src/components/PricingSuggester.tsx`)
- Market data input forms
- Contractor profile configuration
- AI-powered pricing calculation
- Multiple pricing strategy options
- Detailed breakdown visualizations

### Learning Dashboard (`src/components/LearningDashboard.tsx`)
- Total predictions counter
- Average accuracy metrics
- Prediction type breakdown
- Recent prediction history

### Route Optimizer (`src/components/RouteOptimizer.tsx`)
- Job selection with urgency indicators
- Route configuration options
- Real-time route optimization
- Cost and time estimates
- Visual map integration
- Turn-by-turn directions

## Design Philosophy

### Professional & Intelligent
- Deep professional blue for trust and intelligence
- Vibrant green for success indicators (costs, approvals)
- Warm orange for warnings and urgency
- Clean, data-driven interface prioritizing clarity

### Typography
- **Inter** - Primary font for UI and body text
- **JetBrains Mono** - Monospace for numbers, costs, technical data

### Animation Strategy
- Progress bars with milestone pauses during AI analysis
- Smooth reveals for cost data and results
- Gentle pulsing for AI confidence indicators
- Purpose-driven transitions that communicate processing depth

## Data Persistence

All learning data is persisted using Spark's KV storage:
- **Key**: `"ai-learning-feedback"`
- **Structure**: Array of LearningFeedback objects
- **Automatic**: Data persists across sessions

## Future Enhancements

- [ ] Contractor matching algorithm
- [ ] Multi-frame video analysis (not just middle frame)
- [ ] Historical project database for better pricing
- [ ] Real-time market data integration
- [ ] Contractor reputation scoring
- [ ] Job outcome tracking and verification
- [ ] Advanced filtering and search in learning dashboard
- [ ] Export capabilities for reports
- [ ] Mobile app version
- [ ] Real-time traffic integration for routes
- [ ] Weather-aware routing
- [ ] Multi-day route optimization
- [ ] Route sharing between contractors

## Development

Built with the Spark template optimized for:
- Fast development cycles
- Type-safe React components
- Responsive design (mobile-first)
- Production-ready code quality
- Scalable architecture

## Performance

- Video processing: ~2-5 seconds for frame extraction
- AI analysis: ~5-10 seconds depending on complexity
- Pricing generation: ~3-5 seconds
- Learning queries: <100ms (in-memory with KV persistence)
- Route optimization: ~2-5 seconds for up to 25 stops
- Map rendering: <100ms using canvas

## API Integration

### Trueway Routing API
The platform integrates with Trueway Routing API (OpenAPI 3.0.1) for route optimization:

**Endpoints Used:**
- `GET /DirectionsService/FindDrivingRoute` - Multi-stop route optimization
- `GET /DirectionsService/FindDrivingPath` - Point-to-point navigation

**Features:**
- Up to 25 stops per route
- Automatic stop reordering for efficiency
- Avoid tolls, highways, or ferries
- Distance and duration calculations
- Turn-by-turn directions
- Polyline geometry for map visualization

**Authentication:**
- Header: `x-api-market-key`
- Get your key at [API.market](https://api.market/)
- Configure in `.env` as `VITE_TRUEWAY_API_KEY`

