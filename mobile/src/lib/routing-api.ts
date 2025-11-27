const API_BASE_URL = 'https://prod.api.market/api/v1/trueway/routing';
// In React Native, we use environment variables via Expo's Constants
const API_KEY = process.env.EXPO_PUBLIC_TRUEWAY_API_KEY || '';

// Development warning for missing API key
if (__DEV__ && !API_KEY) {
  console.warn('[RoutingAPI] EXPO_PUBLIC_TRUEWAY_API_KEY is not set. API calls will fail.');
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoRect {
  south: number;
  west: number;
  north: number;
  east: number;
}

export interface GeoPolyline {
  coordinates: number[][];
}

export interface Step {
  distance: number;
  duration: number;
  start_point_index?: number;
  start_point: GeoPoint;
  end_point_index?: number;
  end_point: GeoPoint;
  bounds: GeoRect;
  geometry: GeoPolyline;
  maneuver?: string;
}

export interface Leg {
  distance: number;
  duration: number;
  start_point_index?: number;
  start_point: GeoPoint;
  end_point_index?: number;
  end_point: GeoPoint;
  bounds: GeoRect;
  geometry: GeoPolyline;
  steps?: Step[];
}

export interface Route {
  distance: number;
  duration: number;
  bounds: GeoRect;
  geometry: GeoPolyline;
  legs?: Leg[];
  stops_order?: number[];
  steps?: Step[];
}

export interface RouteResponse {
  route: Route;
}

export interface RouteOptions {
  avoid_tolls?: boolean;
  avoid_highways?: boolean;
  avoid_ferries?: boolean;
  optimize?: boolean;
  start_time?: string | number;
}

export interface JobLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  urgency?: 'normal' | 'urgent' | 'emergency';
  estimatedDuration?: number;
}

export interface OptimizedRoute {
  totalDistance: number;
  totalDuration: number;
  stops: JobLocation[];
  polyline: number[][];
  legs: Leg[];
  estimatedCost: number;
  fuelCost: number;
}

class RoutingAPIService {
  private async request<T>(endpoint: string, params: Record<string, unknown>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['x-api-market-key'] = API_KEY;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.message || error.error || `API request failed: ${response.status}`);
    }

    return response.json();
  }

  async findDrivingRoute(
    stops: Array<{ lat: number; lng: number }>,
    options: RouteOptions = {}
  ): Promise<RouteResponse> {
    const stopsParam = stops.map(stop => `${stop.lat},${stop.lng}`).join(';');
    
    return this.request<RouteResponse>('/DirectionsService/FindDrivingRoute', {
      stops: stopsParam,
      avoid_tolls: options.avoid_tolls,
      avoid_highways: options.avoid_highways,
      avoid_ferries: options.avoid_ferries,
      optimize: options.optimize,
    });
  }

  async findDrivingPath(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints?: Array<{ lat: number; lng: number }>,
    options: RouteOptions = {}
  ): Promise<RouteResponse> {
    const params: Record<string, unknown> = {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      avoid_tolls: options.avoid_tolls,
      avoid_highways: options.avoid_highways,
      avoid_ferries: options.avoid_ferries,
      start_time: options.start_time,
    };

    if (waypoints && waypoints.length > 0) {
      params.waypoints = waypoints.map(wp => `${wp.lat},${wp.lng}`).join(';');
    }

    return this.request<RouteResponse>('/DirectionsService/FindDrivingPath', params);
  }

  async optimizeJobRoute(
    jobs: JobLocation[],
    contractorLocation: { lat: number; lng: number },
    returnToStart: boolean = true,
    options: RouteOptions = {}
  ): Promise<OptimizedRoute> {
    if (jobs.length === 0) {
      throw new Error('At least one job location is required');
    }

    if (jobs.length > 24) {
      throw new Error('Maximum 24 job locations allowed (25 stops including contractor location)');
    }

    const stops = [contractorLocation, ...jobs.map(j => ({ lat: j.lat, lng: j.lng }))];
    
    if (returnToStart) {
      stops.push(contractorLocation);
    }

    const response = await this.findDrivingRoute(stops, {
      ...options,
      optimize: true,
    });

    const optimizedStops = this.reorderJobsByOptimizedRoute(jobs, response.route.stops_order || []);

    const totalDistance = response.route.distance;
    const totalDuration = response.route.duration;
    const fuelCost = this.calculateFuelCost(totalDistance);
    const estimatedCost = this.calculateRouteCost(totalDistance, totalDuration);

    return {
      totalDistance,
      totalDuration,
      stops: [
        {
          id: 'start',
          name: 'Starting Location',
          address: 'Your Location',
          lat: contractorLocation.lat,
          lng: contractorLocation.lng,
        },
        ...optimizedStops,
      ],
      polyline: response.route.geometry.coordinates,
      legs: response.route.legs || [],
      estimatedCost,
      fuelCost,
    };
  }

  private reorderJobsByOptimizedRoute(jobs: JobLocation[], stopsOrder: number[]): JobLocation[] {
    if (!stopsOrder || stopsOrder.length === 0) {
      return jobs;
    }

    const reordered: JobLocation[] = [];
    
    for (let i = 1; i < stopsOrder.length - 1; i++) {
      const jobIndex = stopsOrder[i] - 1;
      if (jobIndex >= 0 && jobIndex < jobs.length) {
        reordered.push(jobs[jobIndex]);
      }
    }

    return reordered;
  }

  private calculateFuelCost(distanceInMeters: number, fuelPrice: number = 3.5, mpg: number = 25): number {
    const miles = distanceInMeters * 0.000621371;
    const gallons = miles / mpg;
    return Math.round(gallons * fuelPrice * 100) / 100;
  }

  private calculateRouteCost(distanceInMeters: number, durationInSeconds: number): number {
    const fuelCost = this.calculateFuelCost(distanceInMeters);
    const hours = durationInSeconds / 3600;
    const timeCost = hours * 50;
    return Math.round((fuelCost + timeCost) * 100) / 100;
  }

  formatDistance(meters: number): string {
    const miles = meters * 0.000621371;
    if (miles < 1) {
      return `${Math.round(miles * 5280)} ft`;
    }
    return `${miles.toFixed(1)} mi`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

export const routingAPI = new RoutingAPIService();
