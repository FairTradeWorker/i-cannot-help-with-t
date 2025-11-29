// Custom hook for territories management
// Territory loading, filtering, and claiming

import { useState, useEffect, useCallback } from 'react';
import { dataStore } from '@fairtradeworker/shared';
import type { Territory } from '@/types';

interface UseTerritoriesOptions {
  filter?: 'available' | 'claimed' | 'mine' | 'all';
  searchQuery?: string;
  autoRefresh?: boolean;
}

export function useTerritories(options: UseTerritoriesOptions = {}) {
  const { filter = 'all', searchQuery = '', autoRefresh = false } = options;

  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadTerritories = useCallback(async () => {
    try {
      setLoading(true);
      const user = await dataStore.getCurrentUser();
      setCurrentUserId(user?.id || null);

      let allTerritories = await dataStore.getTerritories();

      // Apply filters
      if (filter === 'available') {
        allTerritories = allTerritories.filter(t => !t.operatorId);
      } else if (filter === 'claimed') {
        allTerritories = allTerritories.filter(t => !!t.operatorId);
      } else if (filter === 'mine' && user) {
        allTerritories = allTerritories.filter(t => t.operatorId === user.id);
      }

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        allTerritories = allTerritories.filter(
          t =>
            t.name?.toLowerCase().includes(query) ||
            t.zipCodes?.some(zip => zip.toLowerCase().includes(query))
        );
      }

      setTerritories(allTerritories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load territories'));
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  useEffect(() => {
    loadTerritories();
  }, [loadTerritories]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadTerritories, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadTerritories]);

  const claimTerritory = useCallback(async (territoryId: string) => {
    try {
      // TODO: Integrate with territory claiming API
      // This is a placeholder
      await loadTerritories();
      return { success: true };
    } catch (err) {
      console.error('Failed to claim territory:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to claim territory' };
    }
  }, [loadTerritories]);

  const stats = {
    total: territories.length,
    available: territories.filter(t => !t.operatorId).length,
    claimed: territories.filter(t => !!t.operatorId).length,
    mine: territories.filter(t => t.operatorId === currentUserId).length,
  };

  return {
    territories,
    loading,
    error,
    stats,
    refresh: loadTerritories,
    claimTerritory,
  };
}

