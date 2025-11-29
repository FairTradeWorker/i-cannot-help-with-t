// Jobs Hook
// Manages job data fetching, filtering, and updates

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, JobStatus, UrgencyLevel } from '@/types';
import { filterJobs, type JobFilters } from '@/utils/job-filters';

interface UseJobsOptions {
  filters?: JobFilters;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

interface JobStats {
  total: number;
  urgent: number;
  emergency: number;
  normal: number;
}

export function useJobs(options: UseJobsOptions = {}) {
  const { filters = {}, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setError(null);
      const allJobs = await dataStore.getJobs();
      setJobs(allJobs);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch jobs');
      setError(error);
      console.error('Failed to fetch jobs:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      await fetchJobs();
      setLoading(false);
    };

    loadJobs();
  }, [fetchJobs]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchJobs();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchJobs]);

  // Filter jobs (memoized)
  const filteredJobs = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) {
      return jobs;
    }

    // Note: filterJobs needs userLocation, which should be passed separately
    // For now, we'll do basic filtering without distance
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

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = 0;
        let bValue: any = 0;

        switch (filters.sortBy) {
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
  }, [jobs, filters]);

  // Calculate stats
  const stats: JobStats = useMemo(() => {
    return {
      total: filteredJobs.length,
      urgent: filteredJobs.filter(j => j.urgency === 'urgent').length,
      emergency: filteredJobs.filter(j => j.urgency === 'emergency').length,
      normal: filteredJobs.filter(j => j.urgency === 'normal').length,
    };
  }, [filteredJobs]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }, [fetchJobs]);

  const addJob = useCallback(async (job: Job) => {
    try {
      await dataStore.saveJob(job);
      setJobs(prev => {
        const exists = prev.find(j => j.id === job.id);
        if (exists) {
          return prev.map(j => j.id === job.id ? job : j);
        }
        return [...prev, job];
      });
    } catch (err) {
      console.error('Failed to add job:', err);
    }
  }, []);

  const updateJob = useCallback(async (jobId: string, updates: Partial<Job>) => {
    try {
      const job = await dataStore.getJobById(jobId);
      if (job) {
        const updatedJob = { ...job, ...updates };
        await dataStore.saveJob(updatedJob);
        setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
      }
    } catch (err) {
      console.error('Failed to update job:', err);
    }
  }, []);

  const addBidToJob = useCallback(async (jobId: string, bid: any) => {
    try {
      await dataStore.addBidToJob(jobId, bid);
      await refresh();
    } catch (err) {
      console.error('Failed to add bid:', err);
    }
  }, [refresh]);

  return {
    jobs: filteredJobs,
    allJobs: jobs,
    loading,
    error,
    refreshing,
    stats,
    refresh,
    addJob,
    updateJob,
    addBidToJob,
  };
}
