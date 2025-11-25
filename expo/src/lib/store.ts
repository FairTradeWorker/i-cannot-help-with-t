import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Job, Bid, Message, Earnings, Notification, Territory, Rating, Conversation } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'servicehub_current_user',
  USERS: 'servicehub_users',
  JOBS: 'servicehub_jobs',
  EARNINGS: 'servicehub_earnings',
  NOTIFICATIONS: 'servicehub_notifications',
  TERRITORIES: 'servicehub_territories',
  RATINGS: 'servicehub_ratings',
  CONVERSATIONS: 'servicehub_conversations',
  PUSH_TOKEN: 'servicehub_push_token',
  OFFLINE_QUEUE: 'servicehub_offline_queue',
  LAST_SYNC: 'servicehub_last_sync',
} as const;

class DataStore {
  private cache: Map<string, any> = new Map();

  private async get<T>(key: string): Promise<T | null> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        const parsed = JSON.parse(value, this.dateReviver);
        this.cache.set(key, parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  private async set<T>(key: string, value: T): Promise<void> {
    try {
      this.cache.set(key, value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }

  private dateReviver(_key: string, value: any): any {
    if (typeof value === 'string') {
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (datePattern.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }

  // User methods
  async getCurrentUser(): Promise<User | null> {
    return await this.get<User>(STORAGE_KEYS.CURRENT_USER);
  }

  async setCurrentUser(user: User): Promise<void> {
    await this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  async clearCurrentUser(): Promise<void> {
    this.cache.delete(STORAGE_KEYS.CURRENT_USER);
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  async getUsers(): Promise<User[]> {
    return (await this.get<User[]>(STORAGE_KEYS.USERS)) || [];
  }

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    await this.set(STORAGE_KEYS.USERS, users);
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id) || null;
  }

  // Jobs methods
  async getJobs(): Promise<Job[]> {
    return (await this.get<Job[]>(STORAGE_KEYS.JOBS)) || [];
  }

  async getJobById(id: string): Promise<Job | null> {
    const jobs = await this.getJobs();
    return jobs.find((j) => j.id === id) || null;
  }

  async saveJob(job: Job): Promise<void> {
    const jobs = await this.getJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }
    await this.set(STORAGE_KEYS.JOBS, jobs);
  }

  async getJobsForHomeowner(homeownerId: string): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter((j) => j.homeownerId === homeownerId);
  }

  async getJobsForContractor(contractorId: string): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter((j) => j.contractorId === contractorId);
  }

  async getAvailableJobs(): Promise<Job[]> {
    const jobs = await this.getJobs();
    return jobs.filter((j) => j.status === 'posted' || j.status === 'bidding');
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

    job.bids.forEach((b) => {
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

  // Conversations methods
  async getConversations(userId: string): Promise<Conversation[]> {
    const conversations = (await this.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS)) || [];
    return conversations.filter((c) => c.participants.includes(userId));
  }

  async saveConversation(conversation: Conversation): Promise<void> {
    const conversations = (await this.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS)) || [];
    const index = conversations.findIndex((c) => c.id === conversation.id);
    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }
    await this.set(STORAGE_KEYS.CONVERSATIONS, conversations);
  }

  // Earnings methods
  async getEarnings(contractorId: string): Promise<Earnings> {
    const allEarnings = (await this.get<Record<string, Earnings>>(STORAGE_KEYS.EARNINGS)) || {};
    return (
      allEarnings[contractorId] || {
        contractorId,
        totalEarnings: 0,
        availableBalance: 0,
        pendingBalance: 0,
        jobs: [],
        payouts: [],
      }
    );
  }

  async updateEarnings(earnings: Earnings): Promise<void> {
    const allEarnings = (await this.get<Record<string, Earnings>>(STORAGE_KEYS.EARNINGS)) || {};
    allEarnings[earnings.contractorId] = earnings;
    await this.set(STORAGE_KEYS.EARNINGS, allEarnings);
  }

  // Notifications methods
  async getNotifications(userId: string): Promise<Notification[]> {
    const allNotifications = (await this.get<Record<string, Notification[]>>(STORAGE_KEYS.NOTIFICATIONS)) || {};
    return allNotifications[userId] || [];
  }

  async addNotification(notification: Notification): Promise<void> {
    const allNotifications = (await this.get<Record<string, Notification[]>>(STORAGE_KEYS.NOTIFICATIONS)) || {};
    if (!allNotifications[notification.userId]) {
      allNotifications[notification.userId] = [];
    }
    allNotifications[notification.userId].unshift(notification);
    await this.set(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
  }

  async markNotificationRead(userId: string, notificationId: string): Promise<void> {
    const allNotifications = (await this.get<Record<string, Notification[]>>(STORAGE_KEYS.NOTIFICATIONS)) || {};
    const userNotifications = allNotifications[userId] || [];
    const notification = userNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      await this.set(STORAGE_KEYS.NOTIFICATIONS, allNotifications);
    }
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const notifications = await this.getNotifications(userId);
    return notifications.filter((n) => !n.read).length;
  }

  // Ratings methods
  async getRatings(contractorId: string): Promise<Rating[]> {
    const allRatings = (await this.get<Rating[]>(STORAGE_KEYS.RATINGS)) || [];
    return allRatings.filter((r) => r.contractorId === contractorId);
  }

  async saveRating(rating: Rating): Promise<void> {
    const allRatings = (await this.get<Rating[]>(STORAGE_KEYS.RATINGS)) || [];
    const index = allRatings.findIndex((r) => r.jobId === rating.jobId);
    if (index >= 0) {
      allRatings[index] = rating;
    } else {
      allRatings.push(rating);
    }
    await this.set(STORAGE_KEYS.RATINGS, allRatings);
  }

  // Territories methods
  async getTerritories(): Promise<Territory[]> {
    return (await this.get<Territory[]>(STORAGE_KEYS.TERRITORIES)) || [];
  }

  async getTerritoryById(id: string): Promise<Territory | null> {
    const territories = await this.getTerritories();
    return territories.find((t) => t.id === id) || null;
  }

  async getTerritoriesByState(stateCode: string): Promise<Territory[]> {
    const territories = await this.getTerritories();
    return territories.filter((t) => t.stateCode === stateCode);
  }

  async saveTerritory(territory: Territory): Promise<void> {
    const territories = await this.getTerritories();
    const index = territories.findIndex((t) => t.id === territory.id);
    if (index >= 0) {
      territories[index] = territory;
    } else {
      territories.push(territory);
    }
    await this.set(STORAGE_KEYS.TERRITORIES, territories);
  }

  // Push token methods
  async getPushToken(): Promise<string | null> {
    return await this.get<string>(STORAGE_KEYS.PUSH_TOKEN);
  }

  async setPushToken(token: string): Promise<void> {
    await this.set(STORAGE_KEYS.PUSH_TOKEN, token);
  }

  // Offline queue methods
  async addToOfflineQueue(action: { type: string; payload: any }): Promise<void> {
    const queue = (await this.get<{ type: string; payload: any }[]>(STORAGE_KEYS.OFFLINE_QUEUE)) || [];
    queue.push(action);
    await this.set(STORAGE_KEYS.OFFLINE_QUEUE, queue);
  }

  async getOfflineQueue(): Promise<{ type: string; payload: any }[]> {
    return (await this.get<{ type: string; payload: any }[]>(STORAGE_KEYS.OFFLINE_QUEUE)) || [];
  }

  async clearOfflineQueue(): Promise<void> {
    this.cache.delete(STORAGE_KEYS.OFFLINE_QUEUE);
    await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }

  // Sync methods
  async getLastSync(): Promise<Date | null> {
    return await this.get<Date>(STORAGE_KEYS.LAST_SYNC);
  }

  async setLastSync(date: Date): Promise<void> {
    await this.set(STORAGE_KEYS.LAST_SYNC, date);
  }

  // Clear all data
  async clearAll(): Promise<void> {
    this.cache.clear();
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
}

export const dataStore = new DataStore();
