// SCALE: Aggressive caching layer with SWR
import useSWR from 'swr';

const CACHE_KEYS = {
  TERRITORIES_AVAILABLE: '/api/territories/available',
  JOBS: '/api/jobs',
  USER_ME: '/api/users/me',
} as const;

// Fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

// Cache configs
export const cacheConfigs = {
  territories: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30s
    dedupingInterval: 10000,
  },
  jobs: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 60000, // 60s
    dedupingInterval: 10000,
  },
  user: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 300000, // 5min
    dedupingInterval: 60000,
  },
};

// Hooks
export function useTerritoriesAvailable() {
  return useSWR(CACHE_KEYS.TERRITORIES_AVAILABLE, fetcher, cacheConfigs.territories);
}

export function useJobs() {
  return useSWR(CACHE_KEYS.JOBS, fetcher, cacheConfigs.jobs);
}

export function useUserMe() {
  return useSWR(CACHE_KEYS.USER_ME, fetcher, cacheConfigs.user);
}

// Cache invalidation
export function mutateTerritories() {
  return useSWR(CACHE_KEYS.TERRITORIES_AVAILABLE, fetcher).mutate();
}

export function mutateJobs() {
  return useSWR(CACHE_KEYS.JOBS, fetcher).mutate();
}

