import type { User, Job, Bid, Message, Earnings, Notification, Territory, Rating } from './types';

const STORAGE_KEYS = {
  CURRENT_USER: 'current-user',
  USERS: 'users',
  JOBS: 'jobs',
  EARNINGS: 'earnings',
  NOTIFICATIONS: 'notifications',
  TERRITORIES: 'territories',
  RATINGS: 'ratings',
} as const;

export class DataStore {
  async getCurrentUser(): Promise<User | null> {
    return await window.spark.kv.get<User>(STORAGE_KEYS.CURRENT_USER) || null;
  }

  async setCurrentUser(user: User): Promise<void> {
    await window.spark.kv.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  async getUsers(): Promise<User[]> {
    return await window.spark.kv.get<User[]>(STORAGE_KEYS.USERS) || [];
  }

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    await window.spark.kv.set(STORAGE_KEYS.USERS, users);
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  async getJobs(): Promise<Job[]> {
    return await window.spark.kv.get<Job[]>(STORAGE_KEYS.JOBS) || [];
  }

  async getJobById(id: string): Promise<Job | null> {
    const jobs = await this.getJobs();
    return jobs.find(j => j.id === id) || null;
  }

  async saveJob(job: Job): Promise<void> {
    const jobs = await this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }
    await window.spark.kv.set(STORAGE_KEYS.JOBS, jobs);
  }

  async getJobsForHomeowner(homeownerId: string): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter(j => j.homeownerId === homeownerId);
  }

  async getJobsForContractor(contractorId: string): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter(j => j.contractorId === contractorId);
  }

  async getAvailableJobsForContractor(contractorId: string, location: { lat: number; lng: number }, radius: number): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter(j => 
      j.status === 'posted' && 
      !j.bids.some(b => b.contractorId === contractorId)
    );
  }

  async addBidToJob(jobId: string, bid: Bid): Promise<void> {
    const job = await this.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    job.bids.push(bid);
    job.updatedAt = new Date();
    await this.saveJob(job);
  }

  async acceptBid(jobId: string, bidId: string): Promise<void> {
    const job = await this.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    
    job.bids.forEach(b => {
      if (b.id === bidId) {
        b.status = 'accepted';
        job.contractorId = b.contractorId;
        job.status = 'assigned';
      } else if (b.status === 'pending') {
        b.status = 'rejected';
      }
    });
    
    job.updatedAt = new Date();
    await this.saveJob(job);
  }

  async addMessageToJob(jobId: string, message: Message): Promise<void> {
    const job = await this.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    job.messages.push(message);
    job.updatedAt = new Date();
    await this.saveJob(job);
  }

  async getEarnings(contractorId: string): Promise<Earnings> {
    const allEarnings = await window.spark.kv.get<Record<string, Earnings>>(STORAGE_KEYS.EARNINGS) || {};
    return allEarnings[contractorId] || {
      contractorId,
      totalEarnings: 0,
      availableBalance: 0,
      pendingBalance: 0,
      jobs: [],
      payouts: [],
    };
  }

  async updateEarnings(earnings: Earnings): Promise<void> {
    const allEarnings = await window.spark.kv.get<Record<string, Earnings>>(STORAGE_KEYS.EARNINGS) || {};
    allEarnings[earnings.contractorId] = earnings;
    await window.spark.kv.set(STORAGE_KEYS.EARNINGS, allEarnings);
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    const allNotifications = await window.spark.kv.get<Record<string, Notification[]>>(STORAGE_KEYS.NOTIFICATIONS) || {};
    return allNotifications[userId] || [];
  }

  async addNotification(notification: Notification): Promise<void> {
    const allNotifications = await window.spark.kv.get<Record<string, Notification[]>>(STORAGE_KEYS.NOTIFICATIONS) || {};
    if (!allNotifications[notification.userId]) {
      allNotifications[notification.userId] = [];
    }
    allNotifications[notification.userId].unshift(notification);
    await window.spark.kv.set(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
  }

  async markNotificationRead(userId: string, notificationId: string): Promise<void> {
    const allNotifications = await window.spark.kv.get<Record<string, Notification[]>>(STORAGE_KEYS.NOTIFICATIONS) || {};
    const userNotifications = allNotifications[userId] || [];
    const notification = userNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      await window.spark.kv.set(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
    }
  }

  async getRatings(contractorId: string): Promise<Rating[]> {
    const allRatings = await window.spark.kv.get<Rating[]>(STORAGE_KEYS.RATINGS) || [];
    return allRatings.filter(r => r.contractorId === contractorId);
  }

  async saveRating(rating: Rating): Promise<void> {
    const allRatings = await window.spark.kv.get<Rating[]>(STORAGE_KEYS.RATINGS) || [];
    const index = allRatings.findIndex(r => r.jobId === rating.jobId);
    if (index >= 0) {
      allRatings[index] = rating;
    } else {
      allRatings.push(rating);
    }
    await window.spark.kv.set(STORAGE_KEYS.RATINGS, allRatings);
  }

  async getTerritories(): Promise<Territory[]> {
    return await window.spark.kv.get<Territory[]>(STORAGE_KEYS.TERRITORIES) || [];
  }

  async saveTerritory(territory: Territory): Promise<void> {
    const territories = await this.getTerritories();
    const index = territories.findIndex(t => t.id === territory.id);
    if (index >= 0) {
      territories[index] = territory;
    } else {
      territories.push(territory);
    }
    await window.spark.kv.set(STORAGE_KEYS.TERRITORIES, territories);
  }
}

export const dataStore = new DataStore();
