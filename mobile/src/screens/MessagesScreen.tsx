// Enhanced Messages Screen with MessageBubble component
// Real-time messaging interface

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Send, ArrowLeft, Phone, MoreVertical, Image as ImageIcon, Search } from 'lucide-react-native';
import { MessageBubble } from '@/components/MessageBubble';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { jobsService } from '@/services/jobs.service';
import { dataStore } from '@fairtradeworker/shared';
import type { Message, Job, User as UserType } from '@/types';

interface RouteParams {
  jobId?: string;
}

export default function MessagesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = (route.params as RouteParams) || {};

  const { user: currentUser } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Use messages hook for API integration
  const { messages, sendMessage: apiSendMessage, loading: messagesLoading } = useMessages({
    jobId: jobId || null,
    autoRefresh: true,
    refreshInterval: 3000,
  });

  useEffect(() => {
    loadJobData();
  }, [jobId]);

  const loadJobData = async () => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const jobData = await jobsService.getJobById(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUser || !jobId || !job) return;

    const messageText = inputMessage.trim();
    setInputMessage(''); // Clear input immediately for better UX

    try {
      // Determine recipient (other party in the conversation)
      const recipientId = job.homeownerId === currentUser.id 
        ? job.contractorId 
        : job.homeownerId;

      if (!recipientId) {
        Alert.alert('Error', 'Cannot determine message recipient');
        return;
      }

      await apiSendMessage(recipientId, messageText);
      
      // Auto-scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setInputMessage(messageText); // Restore message on error
    }
  };
      content: inputMessage.trim(),
      timestamp: new Date(),
      read: false,
    };

    try {
      await dataStore.saveMessage(newMessage);
      setInputMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    const minutes = Math.floor(diff / 60000);
    return minutes > 0 ? `${minutes}m ago` : 'Just now';
  };

  if (loading || messagesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-gray-600 mt-4">Loading messages...</Text>
      </SafeAreaView>
    );
  }

  if (!jobId) {
    // Conversation list view
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Messages</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-lg text-center mb-2">
            Select a job to view messages
          </Text>
          <Text className="text-gray-400 text-sm text-center">
            Messages are organized by job
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCurrentUser = (senderId: string) => {
    return currentUser?.id === senderId;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        {/* Chat Header */}
        <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <ArrowLeft color="#374151" size={24} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-gray-900 font-bold">{job?.title || 'Job Messages'}</Text>
            {job && (
              <Text className="text-gray-500 text-xs">
                {job.address.city}, {job.address.state}
              </Text>
            )}
          </View>
          <TouchableOpacity className="p-2">
            <Phone color="#374151" size={20} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <MoreVertical color="#374151" size={20} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isCurrentUser={isCurrentUser(item.senderId)}
              currentUserRole={currentUser?.role || 'homeowner'}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-12 px-6">
              <Text className="text-gray-500 text-lg text-center mb-2">
                No messages yet
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                Start the conversation by sending a message
              </Text>
            </View>
          }
        />

        {/* Input Area */}
        <View className="bg-white px-4 py-3 flex-row items-end border-t border-gray-200">
          <TouchableOpacity className="mr-3 mb-2">
            <ImageIcon color="#6b7280" size={24} />
          </TouchableOpacity>
          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 max-h-24">
            <TextInput
              className="text-gray-900"
              placeholder="Type a message..."
              value={inputMessage}
              onChangeText={setInputMessage}
              multiline
              maxLength={1000}
              style={{ maxHeight: 80, textAlignVertical: 'top' }}
            />
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            className={`ml-3 mb-2 w-10 h-10 rounded-full items-center justify-center ${
              inputMessage.trim() ? 'bg-primary-500' : 'bg-gray-300'
            }`}
            disabled={!inputMessage.trim()}
          >
            <Send color={inputMessage.trim() ? '#ffffff' : '#9ca3af'} size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
