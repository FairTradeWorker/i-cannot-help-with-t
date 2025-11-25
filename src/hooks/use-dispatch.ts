import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  dispatchPingAPI, 
  checkAndAutoReassign, 
  registerPushToken,
  getPendingAssignments 
} from '@/api/dispatch/ping';
import { dispatchStore } from '@/lib/dispatch-store';
import type { 
  JobAssignment, 
  DispatchPingRequest, 
  DispatchPingResponse 
} from '@/lib/types';

// Default auto-reassign check interval (30 seconds)
// Set to half the minimum assignment expiration time (1 minute for emergency jobs)
const DEFAULT_AUTO_REASSIGN_CHECK_INTERVAL_MS = 30000;

export interface UseDispatchOptions {
  autoReassign?: boolean;
  /** Poll interval in milliseconds for checking reassignments. Defaults to 30 seconds. */
  pollInterval?: number;
}

export function useDispatch(options: UseDispatchOptions = {}) {
  const { 
    autoReassign = true, 
    pollInterval = DEFAULT_AUTO_REASSIGN_CHECK_INTERVAL_MS 
  } = options;
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastDispatchResult, setLastDispatchResult] = useState<DispatchPingResponse | null>(null);
  const activeJobIds = useRef<Set<string>>(new Set());

  const dispatch = useCallback(async (request: DispatchPingRequest): Promise<DispatchPingResponse> => {
    setIsDispatching(true);
    try {
      const result = await dispatchPingAPI(request);
      setLastDispatchResult(result);
      
      if (result.success) {
        activeJobIds.current.add(request.jobId);
      }
      
      return result;
    } finally {
      setIsDispatching(false);
    }
  }, []);

  const checkReassignments = useCallback(async () => {
    const jobIds = Array.from(activeJobIds.current);
    
    for (const jobId of jobIds) {
      // Check if job now has an accepted assignment
      const hasAccepted = await dispatchStore.hasAcceptedAssignment(jobId);
      
      if (hasAccepted) {
        activeJobIds.current.delete(jobId);
        continue;
      }

      // Check and trigger auto-reassign if needed
      const result = await checkAndAutoReassign(jobId);
      if (result) {
        setLastDispatchResult(result);
      }
    }
  }, []);

  // Set up auto-reassign polling
  useEffect(() => {
    if (!autoReassign) return;

    const interval = setInterval(checkReassignments, pollInterval);
    return () => clearInterval(interval);
  }, [autoReassign, pollInterval, checkReassignments]);

  const stopTracking = useCallback((jobId: string) => {
    activeJobIds.current.delete(jobId);
  }, []);

  return {
    dispatch,
    isDispatching,
    lastDispatchResult,
    stopTracking,
    checkReassignments,
  };
}

export interface UseContractorDispatchOptions {
  contractorId: string;
  onNewAssignment?: (assignment: JobAssignment) => void;
  pollInterval?: number;
}

export function useContractorDispatch({
  contractorId,
  onNewAssignment,
  pollInterval = 10000,
}: UseContractorDispatchOptions) {
  const [pendingAssignments, setPendingAssignments] = useState<JobAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousAssignmentIds = useRef<Set<string>>(new Set());

  const fetchAssignments = useCallback(async () => {
    try {
      const assignments = await getPendingAssignments(contractorId);
      
      // Check for new assignments
      for (const assignment of assignments) {
        if (!previousAssignmentIds.current.has(assignment.id)) {
          previousAssignmentIds.current.add(assignment.id);
          onNewAssignment?.(assignment);
        }
      }
      
      setPendingAssignments(assignments);
    } finally {
      setIsLoading(false);
    }
  }, [contractorId, onNewAssignment]);

  useEffect(() => {
    fetchAssignments();
    
    const interval = setInterval(fetchAssignments, pollInterval);
    return () => clearInterval(interval);
  }, [fetchAssignments, pollInterval]);

  const registerForPush = useCallback(async (pushToken: string) => {
    return await registerPushToken(contractorId, pushToken);
  }, [contractorId]);

  return {
    pendingAssignments,
    isLoading,
    refresh: fetchAssignments,
    registerForPush,
  };
}
