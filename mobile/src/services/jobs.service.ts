// Jobs Service
// Handles all job-related API calls

import { apiClient } from '@fairtradeworker/shared';
import type { Job, Bid } from '@/types';

export interface JobFilters {
  status?: string;
  urgency?: string;
  homeownerId?: string;
  contractorId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateJobData {
  title: string;
  description?: string;
  address: any;
  videoUrl?: string;
  thumbnailUrl?: string;
  scope?: any;
  estimatedCost?: { min: number; max: number };
  laborHours?: number;
  urgency?: 'normal' | 'urgent' | 'emergency';
  predictionId?: string;
}

export interface CreateBidData {
  amount: number;
  message?: string;
}

export class JobsService {
  /**
   * Get all jobs with optional filters
   */
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.urgency) params.append('urgency', filters.urgency);
      if (filters?.homeownerId) params.append('homeownerId', filters.homeownerId);
      if (filters?.contractorId) params.append('contractorId', filters.contractorId);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/jobs?${queryString}` : '/jobs';
      
      return await apiClient.get<Job[]>(endpoint);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw error;
    }
  }

  /**
   * Get job by ID
   */
  async getJobById(id: string): Promise<Job> {
    try {
      return await apiClient.get<Job>(`/jobs/${id}`);
    } catch (error) {
      console.error('Failed to fetch job:', error);
      throw error;
    }
  }

  /**
   * Create a new job
   */
  async createJob(data: CreateJobData): Promise<Job> {
    try {
      return await apiClient.post<Job>('/jobs', data);
    } catch (error) {
      console.error('Failed to create job:', error);
      throw error;
    }
  }

  /**
   * Update a job
   */
  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    try {
      return await apiClient.put<Job>(`/jobs/${id}`, updates);
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  }

  /**
   * Create a bid on a job
   */
  async createBid(jobId: string, bidData: CreateBidData): Promise<Bid> {
    try {
      return await apiClient.post<Bid>(`/jobs/${jobId}/bids`, bidData);
    } catch (error) {
      console.error('Failed to create bid:', error);
      throw error;
    }
  }
}

export const jobsService = new JobsService();

