// Messages Hook
// Manages messages for a job

import { useState, useEffect, useCallback } from 'react';
import { messagesService } from '@/services/messages.service';
import type { Message } from '@/types';

interface UseMessagesOptions {
  jobId: string | null;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useMessages(options: UseMessagesOptions) {
  const { jobId, autoRefresh = false, refreshInterval = 5000 } = options;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!jobId) {
      setMessages([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedMessages = await messagesService.getMessages(jobId);
      setMessages(fetchedMessages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch messages');
      setError(error);
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !jobId) return;

    const interval = setInterval(() => {
      fetchMessages();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchMessages, jobId]);

  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    try {
      const newMessage = await messagesService.sendMessage({
        jobId,
        recipientId,
        content,
      });
      
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [jobId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refresh: fetchMessages,
  };
}

