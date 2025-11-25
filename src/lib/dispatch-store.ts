import type { 
  JobAssignment, 
  JobAssignmentStatus,
  ContractorDispatchInfo,
  User 
} from './types';

const JOB_ASSIGNMENTS_KEY = 'job-assignments';
const DISPATCH_HISTORY_KEY = 'dispatch-history';
const CONTRACTOR_PUSH_TOKENS_KEY = 'contractor-push-tokens';

// Default maximum distance in miles for contractor matching
const DEFAULT_MAX_DISTANCE_MILES = 50;

interface DispatchHistoryEntry {
  id: string;
  jobId: string;
  round: number;
  contractorsNotified: string[];
  createdAt: Date;
  status: 'active' | 'completed' | 'expired';
}

export class DispatchStore {
  // Job Assignment Methods
  async getJobAssignments(): Promise<JobAssignment[]> {
    return await window.spark.kv.get<JobAssignment[]>(JOB_ASSIGNMENTS_KEY) || [];
  }

  async getAssignmentById(id: string): Promise<JobAssignment | null> {
    const assignments = await this.getJobAssignments();
    return assignments.find(a => a.id === id) || null;
  }

  async getAssignmentsForJob(jobId: string): Promise<JobAssignment[]> {
    const assignments = await this.getJobAssignments();
    return assignments.filter(a => a.jobId === jobId);
  }

  async getAssignmentsForContractor(contractorId: string): Promise<JobAssignment[]> {
    const assignments = await this.getJobAssignments();
    return assignments.filter(a => a.contractorId === contractorId);
  }

  async getPendingAssignmentsForContractor(contractorId: string): Promise<JobAssignment[]> {
    const assignments = await this.getAssignmentsForContractor(contractorId);
    const now = new Date();
    return assignments.filter(a => 
      a.status === 'pending' && 
      new Date(a.expiresAt) > now
    );
  }

  async createAssignment(assignment: JobAssignment): Promise<void> {
    const assignments = await this.getJobAssignments();
    assignments.push(assignment);
    await window.spark.kv.set(JOB_ASSIGNMENTS_KEY, assignments);
  }

  async createBulkAssignments(newAssignments: JobAssignment[]): Promise<void> {
    const assignments = await this.getJobAssignments();
    assignments.push(...newAssignments);
    await window.spark.kv.set(JOB_ASSIGNMENTS_KEY, assignments);
  }

  async updateAssignmentStatus(
    assignmentId: string, 
    status: JobAssignmentStatus,
    respondedAt?: Date
  ): Promise<JobAssignment | null> {
    const assignments = await this.getJobAssignments();
    const index = assignments.findIndex(a => a.id === assignmentId);
    
    if (index === -1) return null;
    
    assignments[index].status = status;
    if (respondedAt) {
      assignments[index].respondedAt = respondedAt;
    }
    
    await window.spark.kv.set(JOB_ASSIGNMENTS_KEY, assignments);
    return assignments[index];
  }

  async markExpiredAssignments(): Promise<JobAssignment[]> {
    const assignments = await this.getJobAssignments();
    const now = new Date();
    const expiredAssignments: JobAssignment[] = [];
    
    let hasChanges = false;
    for (const assignment of assignments) {
      if (assignment.status === 'pending' && new Date(assignment.expiresAt) <= now) {
        assignment.status = 'expired';
        expiredAssignments.push(assignment);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      await window.spark.kv.set(JOB_ASSIGNMENTS_KEY, assignments);
    }
    
    return expiredAssignments;
  }

  async getActiveAssignmentForJob(jobId: string): Promise<JobAssignment | null> {
    const assignments = await this.getAssignmentsForJob(jobId);
    return assignments.find(a => a.status === 'accepted') || null;
  }

  async hasAcceptedAssignment(jobId: string): Promise<boolean> {
    const active = await this.getActiveAssignmentForJob(jobId);
    return active !== null;
  }

  // Dispatch History Methods
  async getDispatchHistory(): Promise<DispatchHistoryEntry[]> {
    return await window.spark.kv.get<DispatchHistoryEntry[]>(DISPATCH_HISTORY_KEY) || [];
  }

  async saveDispatchHistory(entry: DispatchHistoryEntry): Promise<void> {
    const history = await this.getDispatchHistory();
    history.push(entry);
    await window.spark.kv.set(DISPATCH_HISTORY_KEY, history);
  }

  async getDispatchRoundForJob(jobId: string): Promise<number> {
    const history = await this.getDispatchHistory();
    const jobHistory = history.filter(h => h.jobId === jobId);
    return jobHistory.length > 0 ? Math.max(...jobHistory.map(h => h.round)) : 0;
  }

  // Push Token Methods
  async savePushToken(contractorId: string, pushToken: string): Promise<void> {
    const tokens = await window.spark.kv.get<Record<string, string>>(CONTRACTOR_PUSH_TOKENS_KEY) || {};
    tokens[contractorId] = pushToken;
    await window.spark.kv.set(CONTRACTOR_PUSH_TOKENS_KEY, tokens);
  }

  async getPushToken(contractorId: string): Promise<string | null> {
    const tokens = await window.spark.kv.get<Record<string, string>>(CONTRACTOR_PUSH_TOKENS_KEY) || {};
    return tokens[contractorId] || null;
  }

  async getAllPushTokens(): Promise<Record<string, string>> {
    return await window.spark.kv.get<Record<string, string>>(CONTRACTOR_PUSH_TOKENS_KEY) || {};
  }

  // Utility Methods
  calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    // Haversine formula to calculate distance in miles
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async findNearestAvailableContractors(
    jobLocation: { lat: number; lng: number },
    users: User[],
    count: number = 3,
    excludeContractorIds: string[] = [],
    maxDistanceMiles: number = DEFAULT_MAX_DISTANCE_MILES
  ): Promise<ContractorDispatchInfo[]> {
    const pushTokens = await this.getAllPushTokens();
    
    const availableContractors = users
      .filter(user => 
        user.role === 'contractor' && 
        user.contractorProfile &&
        user.contractorProfile.availability === 'available' &&
        user.contractorProfile.verified &&
        !excludeContractorIds.includes(user.id)
      )
      .map(user => {
        const profile = user.contractorProfile!;
        const distance = this.calculateDistance(
          jobLocation.lat,
          jobLocation.lng,
          profile.location.lat,
          profile.location.lng
        );
        
        return {
          contractorId: user.id,
          name: user.name,
          location: profile.location,
          distance,
          rating: profile.rating,
          completedJobs: profile.completedJobs,
          availability: profile.availability,
          expoPushToken: pushTokens[user.id] || undefined,
        } as ContractorDispatchInfo;
      })
      .filter(c => c.distance <= maxDistanceMiles)
      .sort((a, b) => {
        // Sort by distance first, then by rating
        if (Math.abs(a.distance - b.distance) < 5) {
          return b.rating - a.rating;
        }
        return a.distance - b.distance;
      })
      .slice(0, count);

    return availableContractors;
  }
}

export const dispatchStore = new DispatchStore();
