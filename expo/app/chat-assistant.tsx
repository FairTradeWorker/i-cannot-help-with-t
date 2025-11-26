import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { Card, Button, Input } from '@/components/ui';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your ServiceHub AI assistant. I can help you with:\n\n• Getting instant quotes for home projects\n• Finding contractors in your area\n• Understanding job requirements\n• Scheduling and planning\n\nWhat can I help you with today?",
    timestamp: new Date(),
  },
];

const quickActions = [
  { id: 'quote', label: 'Get a Quote', icon: 'calculator' },
  { id: 'find', label: 'Find Contractors', icon: 'people' },
  { id: 'schedule', label: 'Schedule Job', icon: 'calendar' },
  { id: 'help', label: 'Get Help', icon: 'help-circle' },
];

export default function ChatAssistantScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "I can help you get an instant quote! To provide an accurate estimate, I'll need some information:\n\n1. What type of project is this? (roofing, plumbing, electrical, etc.)\n2. Where is the job located? (ZIP code)\n3. What's the approximate size or scope?\n\nYou can also post a video or photo job for our AI to analyze and provide a detailed estimate.";
    }

    if (lowerMessage.includes('contractor') || lowerMessage.includes('find')) {
      return "I can help you find verified contractors in your area! Our contractors are:\n\n✓ Background checked\n✓ License verified\n✓ Insurance verified\n✓ Customer reviewed\n\nWhat type of service are you looking for, and what's your ZIP code?";
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('book')) {
      return "To schedule a job, you'll first need to:\n\n1. Post your job with details\n2. Review contractor bids\n3. Accept a bid\n4. Coordinate timing with the contractor\n\nWould you like me to help you post a new job?";
    }

    if (lowerMessage.includes('territory') || lowerMessage.includes('territories')) {
      return "ServiceHub territories give contractors exclusive access to leads in specific ZIP codes for just $45/month.\n\nBenefits include:\n• Exclusive lead access\n• First dibs on all jobs in your area\n• Growing passive income potential\n\nWould you like to explore available territories?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help you today? I can assist with:\n\n• Getting quotes\n• Finding contractors\n• Understanding services\n• Posting jobs\n\nJust let me know what you need!";
    }

    return "I understand you're asking about home services. Could you provide more details about what you need? I can help with:\n\n• Getting instant quotes\n• Finding contractors\n• Scheduling jobs\n• Understanding project requirements\n\nFeel free to ask any specific questions!";
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      quote: 'I need a quote for a home project',
      find: 'Help me find contractors in my area',
      schedule: 'I want to schedule a job',
      help: 'I need help understanding your services',
    };

    setInputText(actionMessages[action] || '');
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isUser = item.role === 'user';

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50)}
        style={[styles.messageContainer, isUser ? styles.messageContainerUser : styles.messageContainerAssistant]}
      >
        {!isUser && (
          <View style={[styles.assistantIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.muted },
            { borderRadius: borderRadius.xl },
          ]}
        >
          <Text style={[styles.messageText, { color: isUser ? '#fff' : colors.foreground }]}>
            {item.content}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'AI Assistant',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.typingContainer, { backgroundColor: colors.muted, borderRadius: borderRadius.lg }]}>
              <View style={[styles.assistantIconSmall, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={12} color="#fff" />
              </View>
              <Text style={[styles.typingText, { color: colors.mutedForeground }]}>
                AI is thinking...
              </Text>
            </View>
          )}

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <View style={styles.quickActionsContainer}>
              <View style={styles.quickActions}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.quickAction,
                      { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg },
                    ]}
                    onPress={() => handleQuickAction(action.id)}
                  >
                    <Ionicons name={action.icon as any} size={20} color={colors.primary} />
                    <Text style={[styles.quickActionText, { color: colors.foreground }]}>
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Input Bar */}
          <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.muted, borderRadius: borderRadius.xl },
              ]}
            >
              <Input
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                containerStyle={styles.input}
                style={styles.inputField}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? colors.primary : colors.muted, borderRadius: borderRadius.full },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? '#fff' : colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '90%',
  },
  messageContainerUser: {
    alignSelf: 'flex-end',
  },
  messageContainerAssistant: {
    alignSelf: 'flex-start',
  },
  assistantIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  assistantIconSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    padding: 14,
    paddingHorizontal: 18,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 13,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  input: {
    marginBottom: 0,
  },
  inputField: {
    paddingVertical: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
