import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  acceptAssignment, 
  rejectAssignment, 
  getPendingAssignments 
} from '@/api/dispatch/ping';
import type { JobAssignment } from '@/lib/types';
import { dataStore } from '@/lib/store';
import type { Job } from '@/lib/types';

interface JobDispatchCardProps {
  assignment: JobAssignment;
  job: Job | null;
  onAccept: (assignmentId: string) => void;
  onReject: (assignmentId: string) => void;
  isLoading: boolean;
}

function CountdownTimer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      return Math.max(0, Math.floor((expiry - now) / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft <= 60;
  const isExpired = timeLeft <= 0;

  return (
    <div className={`text-center font-mono text-2xl font-bold ${
      isExpired ? 'text-gray-400' : 
      isUrgent ? 'text-red-500 animate-pulse' : 
      'text-orange-500'
    }`}>
      {isExpired ? 'EXPIRED' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
    </div>
  );
}

function JobDispatchCard({ 
  assignment, 
  job, 
  onAccept, 
  onReject, 
  isLoading 
}: JobDispatchCardProps) {
  const isExpired = new Date(assignment.expiresAt) <= new Date();

  return (
    <Card className={`border-2 ${isExpired ? 'border-gray-200 opacity-60' : 'border-orange-500'} transition-all`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant={isExpired ? 'secondary' : 'default'} className="bg-orange-500">
            ⚡ Lightning Dispatch™
          </Badge>
          <CountdownTimer expiresAt={new Date(assignment.expiresAt)} />
        </div>
        <CardTitle className="text-lg">
          {job?.title || 'Job Loading...'}
        </CardTitle>
        <CardDescription>
          {assignment.distanceToJob.toFixed(1)} miles away • Round {assignment.dispatchRound}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {job && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Estimated Value:</span>
                <p className="font-semibold">
                  ${job.estimatedCost.min.toLocaleString()} - ${job.estimatedCost.max.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Urgency:</span>
                <p className="font-semibold capitalize">{job.urgency}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Location:</span>
                <p className="font-semibold">
                  {job.address.city}, {job.address.state} {job.address.zip}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>
            
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => onAccept(assignment.id)}
                disabled={isLoading || isExpired}
              >
                ✓ Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => onReject(assignment.id)}
                disabled={isLoading || isExpired}
              >
                ✗ Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DispatchPanelProps {
  contractorId: string;
  onAssignmentAccepted?: (assignment: JobAssignment) => void;
}

export function DispatchPanel({ contractorId, onAssignmentAccepted }: DispatchPanelProps) {
  const [assignments, setAssignments] = useState<JobAssignment[]>([]);
  const [jobs, setJobs] = useState<Record<string, Job | null>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadAssignments = useCallback(async () => {
    const pendingAssignments = await getPendingAssignments(contractorId);
    setAssignments(pendingAssignments);

    // Load job details for each assignment
    const jobDetails: Record<string, Job | null> = {};
    for (const assignment of pendingAssignments) {
      if (!jobs[assignment.jobId]) {
        jobDetails[assignment.jobId] = await dataStore.getJobById(assignment.jobId);
      }
    }
    setJobs(prev => ({ ...prev, ...jobDetails }));
  }, [contractorId, jobs]);

  useEffect(() => {
    loadAssignments();
    
    // Poll for new assignments every 10 seconds
    const interval = setInterval(() => {
      loadAssignments();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadAssignments, refreshKey]);

  const handleAccept = async (assignmentId: string) => {
    setIsLoading(true);
    try {
      const result = await acceptAssignment(assignmentId);
      if (result.success && result.assignment) {
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        onAssignmentAccepted?.(result.assignment);
      } else {
        console.error('Failed to accept:', result.error);
        // Refresh to get latest state
        setRefreshKey(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (assignmentId: string) => {
    setIsLoading(true);
    try {
      const result = await rejectAssignment(assignmentId);
      if (result.success) {
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      } else {
        console.error('Failed to reject:', result.error);
        setRefreshKey(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (assignments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <h2 className="text-lg font-semibold">Incoming Jobs</h2>
        <Badge variant="secondary">{assignments.length}</Badge>
      </div>
      
      <div className="space-y-3">
        {assignments.map(assignment => (
          <JobDispatchCard
            key={assignment.id}
            assignment={assignment}
            job={jobs[assignment.jobId] || null}
            onAccept={handleAccept}
            onReject={handleReject}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}

export default DispatchPanel;
