# Trueway Routing API Integration

This document describes the integration of the Trueway Routing API into the FairTradeWorker platform.

## Overview

The Trueway Routing API provides professional-grade routing and navigation services for optimizing contractor routes when visiting multiple job sites. The integration follows the OpenAPI 3.0.1 specification.

## API Endpoints

### Base URL
```
https://prod.api.market/api/v1/trueway/routing
```

### Authentication
All requests require an API key in the header:
```
x-api-market-key: YOUR_API_KEY
```

## Implemented Features

### 1. Multi-Stop Route Optimization (`FindDrivingRoute`)

Optimizes the order of stops to find the most efficient route.

**Endpoint:** `GET /DirectionsService/FindDrivingRoute`

**Parameters:**
- `stops` (required): Semicolon-delimited coordinate pairs (lat,lng). Max 25 pairs.
- `avoid_tolls` (optional): Boolean, default false
- `avoid_highways` (optional): Boolean, default false
- `avoid_ferries` (optional): Boolean, default false
- `optimize` (optional): Boolean, reorder stops for efficiency

**Example:**
```typescript
const response = await routingAPI.findDrivingRoute(
  [
    { lat: 40.629041, lng: -74.025606 },
    { lat: 40.630099, lng: -73.993521 },
    { lat: 40.644895, lng: -74.013818 },
  ],
  {
    optimize: true,
    avoid_tolls: true,
  }
);
```

**Response:**
```typescript
{
  route: {
    distance: 12500,        // meters
    duration: 1800,         // seconds
    bounds: { ... },        // geographic bounds
    geometry: {             // polyline for map
      coordinates: [[lng, lat], ...]
    },
    stops_order: [0, 2, 1], // optimized order
    legs: [...]             // individual segments
  }
}
```

### 2. Point-to-Point Navigation (`FindDrivingPath`)

Finds the best route from origin to destination, optionally through waypoints.

**Endpoint:** `GET /DirectionsService/FindDrivingPath`

**Parameters:**
- `origin` (required): Starting coordinate "lat,lng"
- `destination` (required): Ending coordinate "lat,lng"
- `waypoints` (optional): Semicolon-delimited waypoints. Max 23.
- `avoid_tolls` (optional): Boolean
- `avoid_highways` (optional): Boolean
- `avoid_ferries` (optional): Boolean
- `start_time` (optional): Unix timestamp or "now"

**Example:**
```typescript
const response = await routingAPI.findDrivingPath(
  { lat: 40.629041, lng: -74.025606 },
  { lat: 40.627177, lng: -73.980853 },
  [{ lat: 40.630099, lng: -73.993521 }],
  {
    avoid_highways: false,
    start_time: 'now',
  }
);
```

## Service Layer

### `RoutingAPIService` Class

Located in `src/lib/routing-api.ts`, provides high-level methods:

#### `findDrivingRoute(stops, options)`
Raw API access for multi-stop optimization.

#### `findDrivingPath(origin, destination, waypoints, options)`
Raw API access for point-to-point routing.

#### `optimizeJobRoute(jobs, contractorLocation, returnToStart, options)`
**Primary method for contractor route optimization.**

**Parameters:**
```typescript
jobs: JobLocation[]           // Array of job sites to visit
contractorLocation: {         // Starting location
  lat: number
  lng: number
}
returnToStart: boolean        // Create round trip?
options: RouteOptions         // Routing preferences
```

**Returns:**
```typescript
OptimizedRoute {
  totalDistance: number       // meters
  totalDuration: number       // seconds
  stops: JobLocation[]        // Reordered jobs
  polyline: number[][]        // Map coordinates
  legs: Leg[]                 // Turn-by-turn segments
  estimatedCost: number       // USD (fuel + time value)
  fuelCost: number           // USD
}
```

#### Helper Methods

```typescript
formatDistance(meters: number): string
// "5.2 mi" or "450 ft"

formatDuration(seconds: number): string
// "2h 15m" or "45m"

formatCurrency(amount: number): string
// "$12.50"
```

## UI Components

### RouteOptimizer Component

**Location:** `src/components/RouteOptimizer.tsx`

**Features:**
- Job selection with checkboxes
- Urgency indicators (normal/urgent/emergency)
- Route configuration options
- Real-time optimization
- Summary statistics (distance, duration, fuel cost)
- Turn-by-turn directions

**Props:**
```typescript
interface RouteOptimizerProps {
  jobs: Array<{
    id: string
    title: string
    address: string
    location: { lat: number; lng: number }
    urgency?: 'normal' | 'urgent' | 'emergency'
    estimatedDuration?: number  // seconds
  }>
  contractorLocation: {
    lat: number
    lng: number
    address?: string
  }
  onRouteOptimized?: (route: OptimizedRoute) => void
}
```

**Usage:**
```tsx
<RouteOptimizer
  jobs={activeJobs}
  contractorLocation={contractorProfile.location}
  onRouteOptimized={(route) => {
    console.log('Optimized route ready:', route);
  }}
/>
```

### RouteMap Component

**Location:** `src/components/RouteMap.tsx`

**Features:**
- Canvas-based map rendering
- Route polyline visualization
- Numbered stop markers
- Legend (start/end vs. job sites)

**Props:**
```typescript
interface RouteMapProps {
  route: OptimizedRoute
}
```

## Integration Points

### Contractor Dashboard

The Route Planner tab is integrated into the contractor dashboard:

**File:** `src/components/ContractorDashboard.tsx`

**Navigation:**
1. Contractor logs in
2. Views dashboard with active jobs
3. Clicks "Route Planner" tab
4. System shows RouteOptimizer with active jobs pre-loaded
5. Contractor selects jobs to visit
6. Configures routing options
7. Clicks "Optimize Route"
8. Views optimized route with map and directions

## Cost Calculation

### Fuel Cost
```typescript
distance_miles = distance_meters × 0.000621371
gallons = distance_miles / mpg (default: 25)
fuel_cost = gallons × fuel_price (default: $3.50)
```

### Time Cost
```typescript
hours = duration_seconds / 3600
time_cost = hours × hourly_rate (default: $50)
```

### Total Estimated Cost
```typescript
estimated_cost = fuel_cost + time_cost
```

## Error Handling

The service handles common errors:

```typescript
try {
  const route = await routingAPI.optimizeJobRoute(...);
} catch (error) {
  if (error.message.includes('API request failed')) {
    // API unavailable or authentication failed
  } else if (error.message.includes('Maximum')) {
    // Too many stops (>25)
  } else if (error.message.includes('At least one')) {
    // No jobs provided
  }
}
```

## Rate Limits

**API.market Limits:**
- Varies by plan
- Check your account dashboard
- Implement caching for repeated requests

## Best Practices

1. **Cache Results:** Store optimized routes to avoid redundant API calls
2. **Validate Coordinates:** Ensure all lat/lng are valid before calling API
3. **Handle Errors Gracefully:** Show fallback UI if API is unavailable
4. **Update Routes:** Re-optimize when jobs are added/removed
5. **Mobile Support:** Route optimizer is responsive for mobile contractors

## Environment Variables

Required in `.env`:
```bash
VITE_TRUEWAY_API_KEY=your_api_key_here
```

Get your key at: https://api.market/

## TypeScript Types

All types are exported from `src/lib/routing-api.ts`:

```typescript
import type {
  GeoPoint,
  GeoRect,
  GeoPolyline,
  Step,
  Leg,
  Route,
  RouteResponse,
  RouteOptions,
  JobLocation,
  OptimizedRoute,
} from '@/lib/routing-api';
```

## Testing

Example test scenarios:

1. **Single Job:** Should create route from contractor → job → back
2. **Multiple Jobs:** Should reorder for efficiency
3. **Avoid Tolls:** Should use toll-free roads when enabled
4. **Max Stops:** Should reject >25 stops
5. **Invalid Coordinates:** Should handle gracefully
6. **API Failure:** Should show error toast

## Performance

- **Route optimization:** ~2-5 seconds for up to 25 stops
- **Map rendering:** <100ms using HTML5 canvas
- **Re-optimization:** Debounced when changing options

## Future Enhancements

- [ ] Real-time traffic integration
- [ ] Weather-aware routing
- [ ] Multi-day route planning
- [ ] Route sharing between contractors
- [ ] Historical route analytics
- [ ] Estimated vs. actual time tracking
- [ ] Carbon footprint calculation
- [ ] Alternative route suggestions
