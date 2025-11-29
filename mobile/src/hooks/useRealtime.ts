// Custom hook for real-time updates
// WebSocket integration for live data

import { useEffect, useRef } from 'react';
import { realtimeService } from '@/services/realtime.service';

interface UseRealtimeOptions {
  enabled?: boolean;
  onJobUpdate?: (job: any) => void;
  onMessage?: (message: any) => void;
  onBidUpdate?: (bid: any) => void;
  onTerritoryUpdate?: (territory: any) => void;
}

const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001';

export function useRealtime(options: UseRealtimeOptions = {}) {
  const {
    enabled = true,
    onJobUpdate,
    onMessage,
    onBidUpdate,
    onTerritoryUpdate,
  } = options;

  const unsubscribersRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (!enabled) return;

    // Connect to WebSocket
    realtimeService.connect(WS_URL).catch(error => {
      console.error('Failed to connect to WebSocket:', error);
      // Fall back to polling if WebSocket fails
    });

    // Subscribe to updates
    const unsubscribers: Array<() => void> = [];

    if (onJobUpdate) {
      const unsubscribe = realtimeService.subscribe('job:update', onJobUpdate);
      unsubscribers.push(unsubscribe);
    }

    if (onMessage) {
      const unsubscribe = realtimeService.subscribe('message:new', onMessage);
      unsubscribers.push(unsubscribe);
    }

    if (onBidUpdate) {
      const unsubscribe = realtimeService.subscribe('bid:update', onBidUpdate);
      unsubscribers.push(unsubscribe);
    }

    if (onTerritoryUpdate) {
      const unsubscribe = realtimeService.subscribe('territory:update', onTerritoryUpdate);
      unsubscribers.push(unsubscribe);
    }

    unsubscribersRef.current = unsubscribers;

    return () => {
      // Cleanup: unsubscribe from all events
      unsubscribers.forEach(unsubscribe => unsubscribe());
      realtimeService.disconnect();
    };
  }, [enabled, onJobUpdate, onMessage, onBidUpdate, onTerritoryUpdate]);

  return {
    isConnected: realtimeService.isConnected(),
    send: (type: string, payload: any) => realtimeService.send(type, payload),
  };
}

