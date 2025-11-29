// Job Filtering Utilities
// Shared filtering logic for jobs

import type { Job, UrgencyLevel, JobStatus } from '@/types';

export interface JobFilters {
  searchQuery?: string;
  status?: JobStatus | JobStatus[];
  urgency?: UrgencyLevel;
  maxDistance?: number; // miles
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: 'distance' | 'price' | 'date' | 'urgency';
  sortOrder?: 'asc' | 'desc';
}

export function filterJobs(jobs: Job[], filters: JobFilters, userLocation?: { lat: number; lng: number }): Job[] {
  let filtered = [...jobs];

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.address.city.toLowerCase().includes(query) ||
        job.address.state.toLowerCase().includes(query) ||
        job.address.zip.toLowerCase().includes(query) ||
        job.scope?.jobTitle.toLowerCase().includes(query)
    );
  }

  // Status filter
  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    filtered = filtered.filter(job => statuses.includes(job.status as JobStatus));
  }

  // Urgency filter
  if (filters.urgency) {
    filtered = filtered.filter(job => job.urgency === filters.urgency);
  }

  // Price filter
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(job => {
      const avgPrice = job.scope?.estimatedCost
        ? (job.scope.estimatedCost.min + job.scope.estimatedCost.max) / 2
        : 0;
      return avgPrice >= filters.minPrice!;
    });
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(job => {
      const avgPrice = job.scope?.estimatedCost
        ? (job.scope.estimatedCost.min + job.scope.estimatedCost.max) / 2
        : 0;
      return avgPrice <= filters.maxPrice!;
    });
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter(job => 
      job.scope?.jobTitle.toLowerCase().includes(filters.category!.toLowerCase()) ||
      job.title.toLowerCase().includes(filters.category!.toLowerCase())
    );
  }

  // Distance filter (requires user location)
  if (filters.maxDistance && userLocation) {
    filtered = filtered.filter(job => {
      if (!job.address.lat || !job.address.lng) return false;
      
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        job.address.lat,
        job.address.lng
      );
      
      return distance <= filters.maxDistance!;
    });
  }

  // Sorting
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any = 0;
      let bValue: any = 0;

      switch (filters.sortBy) {
        case 'distance':
          if (userLocation && a.address.lat && a.address.lng && b.address.lat && b.address.lng) {
            aValue = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              a.address.lat,
              a.address.lng
            );
            bValue = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              b.address.lat,
              b.address.lng
            );
          }
          break;

        case 'price':
          aValue = a.scope?.estimatedCost
            ? (a.scope.estimatedCost.min + a.scope.estimatedCost.max) / 2
            : 0;
          bValue = b.scope?.estimatedCost
            ? (b.scope.estimatedCost.min + b.scope.estimatedCost.max) / 2
            : 0;
          break;

        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;

        case 'urgency':
          const urgencyOrder = { emergency: 3, urgent: 2, normal: 1 };
          aValue = urgencyOrder[a.urgency || 'normal'];
          bValue = urgencyOrder[b.urgency || 'normal'];
          break;
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filtered;
}

/**
 * Calculate distance between two coordinates in miles (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateJobDistance(
  job: Job,
  userLocation: { lat: number; lng: number }
): number | null {
  if (!job.address.lat || !job.address.lng) return null;
  
  return calculateDistance(
    userLocation.lat,
    userLocation.lng,
    job.address.lat,
    job.address.lng
  );
}

