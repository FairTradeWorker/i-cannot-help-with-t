// Territories Service
// Handles all territory-related API calls

import { apiClient } from '@fairtradeworker/shared';
import type { Territory } from '@/types';

export interface TerritoryFilters {
  zipCode?: string;
  ownerId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export class TerritoriesService {
  /**
   * Get all territories with optional filters
   */
  async getTerritories(filters?: TerritoryFilters): Promise<Territory[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.zipCode) params.append('zipCode', filters.zipCode);
      if (filters?.ownerId) params.append('ownerId', filters.ownerId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/territories?${queryString}` : '/territories';
      
      return await apiClient.get<Territory[]>(endpoint);
    } catch (error) {
      console.error('Failed to fetch territories:', error);
      throw error;
    }
  }

  /**
   * Get available (unclaimed) territories
   */
  async getAvailableTerritories(limit?: number, offset?: number): Promise<Territory[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/territories/available?${queryString}` : '/territories/available';
      
      return await apiClient.get<Territory[]>(endpoint);
    } catch (error) {
      console.error('Failed to fetch available territories:', error);
      throw error;
    }
  }

  /**
   * Claim a territory
   */
  async claimTerritory(zipCode: string): Promise<Territory> {
    try {
      return await apiClient.post<Territory>('/territories/claim', { zipCode });
    } catch (error) {
      console.error('Failed to claim territory:', error);
      throw error;
    }
  }
}

export const territoriesService = new TerritoriesService();

