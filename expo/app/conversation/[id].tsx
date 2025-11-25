import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';
import { Avatar, Input, Button } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { Message, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

// Demo messages
const demoMessages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: 'contractor-1',
    senderName: 'Elite Home Services',
    senderRole: 'contractor',
    content: 'Hi! I saw your project posting for the kitchen remodel.',
    timestamp: new Date(Date.now() - 3600000 * 2),
    read: true,
  },
  {
    id: '2',
    conversationId: '1',
    senderId: 'user-1',
    senderName: 'You',
    senderRole: 'homeowner',
    content: 'Hello! Yes, I need help with replacing the countertops and updating the cabinets.',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
  },
  {
    id: '3',
    conversationId: '1',
    senderId: 'contractor-1',
    senderName: 'Elite Home Services',
    senderRole: 'contractor',
    content: 'Great! I specialize in kitchen renovations. Based on your description, I can offer granite or quartz countertops. Would you like me to come by for a free estimate?',
    timestamp: new Date(Date.now() - 1800000),
    read: true,
  },
  {
    id: '4',
    conversationId: '1',
    senderId: 'contractor-1',
    senderName: 'Elite Home Services',
    senderRole: 'contractor',
    content: 'We can start the project next Monday if that works for you.',
    timestamp: new Date(Date.now() - 120000),
    read: false,
  },
];

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSending(true);

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: id || '1',
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: inputText.trim(),
      timestamp: new Date(),
      read: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setSending(false);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.senderId === user?.id;
    const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== item.senderId);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50)}
        style={[styles.messageContainer, isMe ? styles.messageContainerMe : styles.messageContainerOther]}
      >
        {!isMe && showAvatar && (
          <Avatar name={item.senderName} size="sm" style={styles.messageAvatar} />
        )}
        {!isMe && !showAvatar && <View style={styles.avatarPlaceholder} />}
        <View
          style={[
            styles.messageBubble,
            isMe
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.muted },
            { borderRadius: borderRadius.xl },
          ]}
        >
          <Text style={[styles.messageText, { color: isMe ? '#fff' : colors.foreground }]}>
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              { color: isMe ? 'rgba(255,255,255,0.7)' : colors.mutedForeground },
            ]}
          >
            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
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
          headerTitle: 'Elite Home Services',
          headerBackTitle: 'Back',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
          ),
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
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />

          {/* Input Bar */}
          <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="attach" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.muted, borderRadius: borderRadius.xl },
              ]}
            >
              <Input
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
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
              disabled={!inputText.trim() || sending}
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
  headerButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  messageContainerMe: {
    alignSelf: 'flex-end',
  },
  messageContainerOther: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    marginTop: 4,
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  inputButton: {
    padding: 8,
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
