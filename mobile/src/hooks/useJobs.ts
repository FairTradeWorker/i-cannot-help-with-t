// Custom hook for jobs management
// Jobs filtering, searching, and real-time updates

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataStore } from '@fairtradeworker/shared';
import type { Job, UrgencyLevel, JobStatus } from '@/types';

interface UseJobsOptions {
  filters?: {
    status?: JobStatus | JobStatus[];
    urgency?: UrgencyLevel;
    searchQuery?: string;
    contractorId?: string;
    homeownerId?: string;
  };
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useJobs(options: UseJobsOptions = {}) {
  const { filters = {}, autoRefresh = false, refreshInterval = 10000 } = options;
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      let allJobs = await dataStore.getJobs();

      // Apply filters
      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        allJobs = allJobs.filter(job => statuses.includes(job.status as JobStatus));
      }

      if (filters.urgency) {
        allJobs = allJobs.filter(job => job.urgency === filters.urgency);
      }

      if (filters.contractorId) {
        allJobs = allJobs.filter(job => job.contractorId === filters.contractorId);
      }

      if (filters.homeownerId) {
        allJobs = allJobs.filter(job => job.homeownerId === filters.homeownerId);
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        allJobs = allJobs.filter(
          job =>
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.address.city.toLowerCase().includes(query) ||
            job.address.state.toLowerCase().includes(query) ||
            job.address.zip.toLowerCase().includes(query)
        );
      }

      setJobs(allJobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load jobs'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadJobs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadJobs]);

  const filteredJobs = useMemo(() => jobs, [jobs]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const posted = jobs.filter(j => j.status === 'posted').length;
    const inProgress = jobs.filter(j => j.status === 'in_progress').length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const urgent = jobs.filter(j => j.urgency === 'urgent' || j.urgency === 'emergency').length;

    return {
      total,
      posted,
      inProgress,
      completed,
      urgent,
    };
  }, [jobs]);

  return {
    jobs: filteredJobs,
    loading,
    error,
    stats,
    refresh: loadJobs,
  };
}

