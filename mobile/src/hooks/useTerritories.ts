// Territories Hook
// Manages territory data fetching and claims

import { useState, useEffect, useCallback } from 'react';
import { territoriesService } from '@/services/territories.service';
import type { Territory } from '@/types';

interface UseTerritoriesOptions {
  filters?: {
    zipCode?: string;
    ownerId?: string;
    status?: string;
  };
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useTerritories(options: UseTerritoriesOptions = {}) {
  const { filters = {}, autoRefresh = false, refreshInterval = 60000 } = options;
  
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTerritories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetched = await territoriesService.getTerritories(filters);
      setTerritories(fetched);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch territories');
      setError(error);
      console.error('Failed to fetch territories:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTerritories();
  }, [fetchTerritories]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchTerritories();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTerritories]);

  const claimTerritory = useCallback(async (zipCode: string) => {
    try {
      const claimed = await territoriesService.claimTerritory(zipCode);
      // Refresh list
      await fetchTerritories();
      return claimed;
    } catch (err) {
      console.error('Failed to claim territory:', err);
      throw err;
    }
  }, [fetchTerritories]);

  const getAvailableTerritories = useCallback(async (limit?: number, offset?: number) => {
    try {
      return await territoriesService.getAvailableTerritories(limit, offset);
    } catch (err) {
      console.error('Failed to fetch available territories:', err);
      throw err;
    }
  }, []);

  return {
    territories,
    loading,
    error,
    claimTerritory,
    getAvailableTerritories,
    refresh: fetchTerritories,
  };
}
