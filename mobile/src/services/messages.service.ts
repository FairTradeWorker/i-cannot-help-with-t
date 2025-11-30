// Messages Service
// Handles all messaging-related API calls

import { apiClient } from '@fairtradeworker/shared';
import type { Message } from '@/types';

export interface SendMessageData {
  jobId: string;
  recipientId: string;
  content: string;
}

export class MessagesService {
  /**
   * Get messages for a job
   */
  async getMessages(jobId: string): Promise<Message[]> {
    try {
      return await apiClient.get<Message[]>(`/messages?jobId=${jobId}`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(data: SendMessageData): Promise<Message> {
    try {
      return await apiClient.post<Message>('/messages', data);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
}

export const messagesService = new MessagesService();

