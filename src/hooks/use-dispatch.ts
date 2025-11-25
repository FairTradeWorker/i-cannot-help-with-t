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

const AUTO_REASSIGN_CHECK_INTERVAL = 30000; // 30 seconds

export interface UseDispatchOptions {
  autoReassign?: boolean;
  pollInterval?: number;
}

export function useDispatch(options: UseDispatchOptions = {}) {
  const { 
    autoReassign = true, 
    pollInterval = AUTO_REASSIGN_CHECK_INTERVAL 
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
