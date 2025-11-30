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
      // Try API first, fallback to DataStore
      try {
        const apiJobs = await jobsService.getJobs({
          status: filters.status,
          urgency: filters.urgency,
        });
        setJobs(apiJobs);
        // Also cache in DataStore
        for (const job of apiJobs) {
          await dataStore.saveJob(job);
        }
      } catch (apiError) {
        console.warn('API fetch failed, using local storage:', apiError);
        const localJobs = await dataStore.getJobs();
        setJobs(localJobs);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch jobs');
      setError(error);
      console.error('Failed to fetch jobs:', error);
    }
  }, [filters]);

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

  const addJob = useCallback(async (jobData: any) => {
    try {
      // Try API first
      try {
        const newJob = await jobsService.createJob(jobData);
        await dataStore.saveJob(newJob);
        setJobs(prev => {
          const exists = prev.find(j => j.id === newJob.id);
          if (exists) {
            return prev.map(j => j.id === newJob.id ? newJob : j);
          }
          return [...prev, newJob];
        });
        return newJob;
      } catch (apiError) {
        console.warn('API create failed, saving locally:', apiError);
        // Fallback: create job locally
        const localJob: Job = {
          ...jobData,
          id: jobData.id || `job-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await dataStore.saveJob(localJob);
        setJobs(prev => [...prev, localJob]);
        return localJob;
      }
    } catch (err) {
      console.error('Failed to add job:', err);
      throw err;
    }
  }, []);

  const updateJob = useCallback(async (jobId: string, updates: Partial<Job>) => {
    try {
      // Try API first
      try {
        const updatedJob = await jobsService.updateJob(jobId, updates);
        await dataStore.saveJob(updatedJob);
        setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
        return updatedJob;
      } catch (apiError) {
        console.warn('API update failed, updating locally:', apiError);
        // Fallback: update locally
        const job = await dataStore.getJobById(jobId);
        if (job) {
          const updatedJob = { ...job, ...updates, updatedAt: new Date() };
          await dataStore.saveJob(updatedJob);
          setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
          return updatedJob;
        }
      }
    } catch (err) {
      console.error('Failed to update job:', err);
      throw err;
    }
  }, []);

  const addBidToJob = useCallback(async (jobId: string, bidData: { amount: number; message?: string }) => {
    try {
      // Try API first
      try {
        const bid = await jobsService.createBid(jobId, bidData);
        await refresh();
        return bid;
      } catch (apiError) {
        console.warn('API bid creation failed, saving locally:', apiError);
        // Fallback: save locally
        const bid = {
          ...bidData,
          id: `bid-${Date.now()}`,
          jobId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await dataStore.addBidToJob(jobId, bid);
        await refresh();
        return bid;
      }
    } catch (err) {
      console.error('Failed to add bid:', err);
      throw err;
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
