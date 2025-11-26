import { dispatchStore } from '@/lib/dispatch-store';
import { dataStore } from '@/lib/store';
import type {
  JobAssignment,
  DispatchPingRequest,
  DispatchPingResponse,
} from '@/lib/types';

interface ExpoPushMessage {
  to: string;
  sound: 'default';
  title: string;
  body: string;
  data: {
    assignmentId: string;
    jobId: string;
    action: 'dispatch_ping';
    expiresAt: string;
    countdownSeconds: number;
  };
}

export async function sendExpoPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data: ExpoPushMessage['data']
): Promise<string | null> {
  const message: ExpoPushMessage = {
    to: pushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    if (result.data?.id) {
      return result.data.id;
    }
    // Push notification sent but no ID returned - still considered success
    return null;
  } catch (error) {
    // Push notification failed - log for debugging but don't block dispatch
    console.error('Failed to send push notification:', error);
    return null;
  }
}

function generateAssignmentId(): string {
  return `assign_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function generateDispatchId(): string {
  return `dispatch_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// Configurable expiration times based on job urgency
const EXPIRATION_MINUTES_BY_URGENCY: Record<string, number> = {
  normal: 3,
  urgent: 2,
  emergency: 1,
};

function getExpirationMinutes(urgency: string): number {
  return EXPIRATION_MINUTES_BY_URGENCY[urgency] || 3;
}

export async function dispatchPingAPI(
  request: DispatchPingRequest
): Promise<DispatchPingResponse> {
  const dispatchId = generateDispatchId();
  
  try {
    // Check if job already has an accepted contractor
    const hasAccepted = await dispatchStore.hasAcceptedAssignment(request.jobId);
    if (hasAccepted) {
      return {
        success: false,
        dispatchId,
        contractorsNotified: 0,
        assignments: [],
      };
    }

    // Get current dispatch round
    const currentRound = await dispatchStore.getDispatchRoundForJob(request.jobId);
    const newRound = currentRound + 1;

    // Get all previous contractors who were already notified
    const previousAssignments = await dispatchStore.getAssignmentsForJob(request.jobId);
    const excludeContractorIds = previousAssignments.map(a => a.contractorId);

    // Get all users from the data store
    const users = await dataStore.getUsers();

    // Find nearest 3 available contractors
    const nearestContractors = await dispatchStore.findNearestAvailableContractors(
      request.jobLocation,
      users,
      3,
      excludeContractorIds
    );

    if (nearestContractors.length === 0) {
      return {
        success: false,
        dispatchId,
        contractorsNotified: 0,
        assignments: [],
        nextDispatchAt: undefined,
      };
    }

    // Create assignments and send push notifications
    const now = new Date();
    const expirationMinutes = getExpirationMinutes(request.urgency);
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60 * 1000);
    const assignments: JobAssignment[] = [];

    for (const contractor of nearestContractors) {
      const assignment: JobAssignment = {
        id: generateAssignmentId(),
        jobId: request.jobId,
        contractorId: contractor.contractorId,
        status: 'pending',
        dispatchRound: newRound,
        distanceToJob: contractor.distance,
        createdAt: now,
        expiresAt,
      };

      // Send push notification if contractor has a push token
      if (contractor.expoPushToken) {
        const countdownSeconds = expirationMinutes * 60;
        const pushNotificationId = await sendExpoPushNotification(
          contractor.expoPushToken,
          '⚡ New Job Alert!',
          `${request.jobType} job ${contractor.distance.toFixed(1)} miles away - $${request.estimatedValue.toLocaleString()}. Accept in ${expirationMinutes}:00!`,
          {
            assignmentId: assignment.id,
            jobId: request.jobId,
            action: 'dispatch_ping',
            expiresAt: expiresAt.toISOString(),
            countdownSeconds,
          }
        );
        assignment.pushNotificationId = pushNotificationId || undefined;
      }

      assignments.push(assignment);
    }

    // Save all assignments
    await dispatchStore.createBulkAssignments(assignments);

    // Save dispatch history
    await dispatchStore.saveDispatchHistory({
      id: dispatchId,
      jobId: request.jobId,
      round: newRound,
      contractorsNotified: nearestContractors.map(c => c.contractorId),
      createdAt: now,
      status: 'active',
    });

    return {
      success: true,
      dispatchId,
      contractorsNotified: assignments.length,
      assignments,
      nextDispatchAt: expiresAt,
    };
  } catch (error) {
    console.error('Dispatch ping failed:', error);
    return {
      success: false,
      dispatchId,
      contractorsNotified: 0,
      assignments: [],
    };
  }
}

export async function acceptAssignment(assignmentId: string): Promise<{
  success: boolean;
  assignment?: JobAssignment;
  error?: string;
}> {
  try {
    const assignment = await dispatchStore.getAssignmentById(assignmentId);
    
    if (!assignment) {
      return { success: false, error: 'Assignment not found' };
    }

    if (assignment.status !== 'pending') {
      return { success: false, error: `Assignment already ${assignment.status}` };
    }

    // Check if expired
    if (new Date(assignment.expiresAt) <= new Date()) {
      await dispatchStore.updateAssignmentStatus(assignmentId, 'expired');
      return { success: false, error: 'Assignment has expired' };
    }

    // Check if another contractor already accepted
    const hasAccepted = await dispatchStore.hasAcceptedAssignment(assignment.jobId);
    if (hasAccepted) {
      await dispatchStore.updateAssignmentStatus(assignmentId, 'rejected');
      return { success: false, error: 'Job already accepted by another contractor' };
    }

    // Accept the assignment
    const updatedAssignment = await dispatchStore.updateAssignmentStatus(
      assignmentId,
      'accepted',
      new Date()
    );

    // Mark all other pending assignments for this job as rejected
    const allAssignments = await dispatchStore.getAssignmentsForJob(assignment.jobId);
    for (const otherAssignment of allAssignments) {
      if (otherAssignment.id !== assignmentId && otherAssignment.status === 'pending') {
        await dispatchStore.updateAssignmentStatus(otherAssignment.id, 'rejected');
      }
    }

    // Update the job with the contractor
    const job = await dataStore.getJobById(assignment.jobId);
    if (job) {
      job.contractorId = assignment.contractorId;
      job.status = 'assigned';
      job.updatedAt = new Date();
      await dataStore.saveJob(job);
    }

    return { success: true, assignment: updatedAssignment || undefined };
  } catch (error) {
    console.error('Accept assignment failed:', error);
    return { success: false, error: 'Failed to accept assignment' };
  }
}

export async function rejectAssignment(assignmentId: string): Promise<{
  success: boolean;
  assignment?: JobAssignment;
  error?: string;
}> {
  try {
    const assignment = await dispatchStore.getAssignmentById(assignmentId);
    
    if (!assignment) {
      return { success: false, error: 'Assignment not found' };
    }

    if (assignment.status !== 'pending') {
      return { success: false, error: `Assignment already ${assignment.status}` };
    }

    // Reject the assignment
    const updatedAssignment = await dispatchStore.updateAssignmentStatus(
      assignmentId,
      'rejected',
      new Date()
    );

    return { success: true, assignment: updatedAssignment || undefined };
  } catch (error) {
    console.error('Reject assignment failed:', error);
    return { success: false, error: 'Failed to reject assignment' };
  }
}

export async function checkAndAutoReassign(jobId: string): Promise<DispatchPingResponse | null> {
  try {
    // Check if job already has an accepted contractor
    const hasAccepted = await dispatchStore.hasAcceptedAssignment(jobId);
    if (hasAccepted) {
      return null;
    }

    // Mark expired assignments
    await dispatchStore.markExpiredAssignments();

    // Get current assignments for job
    const assignments = await dispatchStore.getAssignmentsForJob(jobId);
    const pendingAssignments = assignments.filter(a => a.status === 'pending');

    // If there are still pending (non-expired) assignments, don't reassign yet
    if (pendingAssignments.length > 0) {
      return null;
    }

    // Get the job details to create a new dispatch
    const job = await dataStore.getJobById(jobId);
    if (!job) {
      return null;
    }

    // Create new dispatch request
    const request: DispatchPingRequest = {
      jobId: job.id,
      jobLocation: {
        lat: job.address.lat || 0,
        lng: job.address.lng || 0,
      },
      jobType: job.title,
      estimatedValue: (job.estimatedCost.min + job.estimatedCost.max) / 2,
      urgency: job.urgency,
    };

    // Trigger new dispatch round
    return await dispatchPingAPI(request);
  } catch (error) {
    console.error('Auto-reassign check failed:', error);
    return null;
  }
}

export async function registerPushToken(
  contractorId: string,
  pushToken: string
): Promise<{ success: boolean }> {
  try {
    await dispatchStore.savePushToken(contractorId, pushToken);
    return { success: true };
  } catch (error) {
    console.error('Failed to register push token:', error);
    return { success: false };
  }
}

export async function getPendingAssignments(
  contractorId: string
): Promise<JobAssignment[]> {
  return await dispatchStore.getPendingAssignmentsForContractor(contractorId);
}
