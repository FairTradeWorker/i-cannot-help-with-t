import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ArrowLeft, Phone, MoreVertical, Image as ImageIcon } from 'lucide-react-native';
import type { Message } from '@/types';

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface ChatMessage extends Message {
  isMine: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    participantName: 'John\'s Plumbing',
    jobTitle: 'Kitchen Faucet Replacement',
    lastMessage: 'I can come tomorrow at 10 AM. Does that work for you?',
    lastMessageTime: new Date(Date.now() - 1800000),
    unreadCount: 2,
  },
  {
    id: 'c2',
    participantName: 'Mike Electric Pro',
    jobTitle: 'Electrical Panel Upgrade',
    lastMessage: 'The permit has been approved. We can start next week.',
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 0,
  },
  {
    id: 'c3',
    participantName: 'Sarah\'s HVAC',
    jobTitle: 'HVAC Maintenance',
    lastMessage: 'Thank you for the review! Happy to help anytime.',
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 0,
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    jobId: 'j1',
    senderId: 'contractor1',
    senderName: 'John\'s Plumbing',
    senderRole: 'contractor',
    content: 'Hi! I saw your job posting for the kitchen faucet replacement. I\'d be happy to help.',
    timestamp: new Date(Date.now() - 3600000 * 2),
    read: true,
    isMine: false,
  },
  {
    id: 'm2',
    jobId: 'j1',
    senderId: 'user1',
    senderName: 'Me',
    senderRole: 'homeowner',
    content: 'Great! Do you have experience with Moen faucets?',
    timestamp: new Date(Date.now() - 3600000 * 1.5),
    read: true,
    isMine: true,
  },
  {
    id: 'm3',
    jobId: 'j1',
    senderId: 'contractor1',
    senderName: 'John\'s Plumbing',
    senderRole: 'contractor',
    content: 'Absolutely! I\'ve installed hundreds of Moen faucets. They\'re excellent quality.',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    isMine: false,
  },
  {
    id: 'm4',
    jobId: 'j1',
    senderId: 'contractor1',
    senderName: 'John\'s Plumbing',
    senderRole: 'contractor',
    content: 'I can come tomorrow at 10 AM. Does that work for you?',
    timestamp: new Date(Date.now() - 1800000),
    read: false,
    isMine: false,
  },
];

export default function MessagesScreen() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (selectedConversation && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedConversation]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m`;
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      jobId: 'j1',
      senderId: 'user1',
      senderName: 'Me',
      senderRole: 'homeowner',
      content: inputMessage.trim(),
      timestamp: new Date(),
      read: true,
      isMine: true,
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      onPress={() => setSelectedConversation(item)}
      className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100"
    >
      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-3">
        <Text className="text-primary-600 font-bold text-lg">
          {item.participantName.charAt(0)}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 font-bold" numberOfLines={1}>{item.participantName}</Text>
          <Text className="text-gray-500 text-xs">{formatTime(item.lastMessageTime)}</Text>
        </View>
        <Text className="text-primary-600 text-xs mt-0.5">{item.jobTitle}</Text>
        <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      {item.unreadCount > 0 && (
        <View className="w-5 h-5 bg-primary-500 rounded-full items-center justify-center ml-2">
          <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View className={`px-4 py-1 ${item.isMine ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          item.isMine ? 'bg-primary-500 rounded-br-sm' : 'bg-gray-200 rounded-bl-sm'
        }`}
      >
        <Text className={item.isMine ? 'text-white' : 'text-gray-900'}>{item.content}</Text>
      </View>
      <Text className="text-gray-500 text-xs mt-1">{formatMessageTime(item.timestamp)}</Text>
    </View>
  );

  if (selectedConversation) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={90}
        >
          {/* Chat Header */}
          <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
            <TouchableOpacity onPress={() => setSelectedConversation(null)} className="mr-3">
              <ArrowLeft color="#374151" size={24} />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
              <Text className="text-primary-600 font-bold">
                {selectedConversation.participantName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold">{selectedConversation.participantName}</Text>
              <Text className="text-primary-600 text-xs">{selectedConversation.jobTitle}</Text>
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
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Area */}
          <View className="bg-white px-4 py-3 flex-row items-center border-t border-gray-200">
            <TouchableOpacity className="mr-3">
              <ImageIcon color="#6b7280" size={24} />
            </TouchableOpacity>
            <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex-row items-center">
              <TextInput
                className="flex-1 text-gray-900"
                placeholder="Type a message..."
                value={inputMessage}
                onChangeText={setInputMessage}
                multiline
                maxLength={1000}
              />
            </View>
            <TouchableOpacity
              onPress={handleSendMessage}
              className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                inputMessage.trim() ? 'bg-primary-500' : 'bg-gray-200'
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-gray-500 text-lg">No messages yet</Text>
            <Text className="text-gray-400 text-sm mt-2">Your conversations will appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
