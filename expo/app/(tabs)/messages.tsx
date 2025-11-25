import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Card, Input, Avatar, Badge } from '@/components/ui';
import { dataStore } from '@/lib/store';
import type { Conversation, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';

// Demo conversations for initial view
const demoConversations: Conversation[] = [
  {
    id: '1',
    participants: ['user-1', 'contractor-1'],
    participantNames: { 'user-1': 'You', 'contractor-1': 'Elite Home Services' },
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: 'contractor-1',
      senderName: 'Elite Home Services',
      senderRole: 'contractor',
      content: 'We can start the project next Monday',
      timestamp: new Date(Date.now() - 120000),
      read: false,
    },
    unreadCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 120000),
  },
  {
    id: '2',
    participants: ['user-1', 'contractor-2'],
    participantNames: { 'user-1': 'You', 'contractor-2': 'Quick Fix Plumbing' },
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: 'contractor-2',
      senderName: 'Quick Fix Plumbing',
      senderRole: 'contractor',
      content: 'Thanks for choosing us!',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
    },
    unreadCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    participants: ['user-1', 'contractor-3'],
    participantNames: { 'user-1': 'You', 'contractor-3': 'ColorCraft Painters' },
    lastMessage: {
      id: 'm3',
      conversationId: '3',
      senderId: 'contractor-3',
      senderName: 'ColorCraft Painters',
      senderRole: 'contractor',
      content: 'Color samples are ready for your review',
      timestamp: new Date(Date.now() - 10800000),
      read: false,
    },
    unreadCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 10800000),
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const { colors, borderRadius } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(demoConversations);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await dataStore.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      const userConversations = await dataStore.getConversations(currentUser.id);
      if (userConversations.length > 0) {
        setConversations(userConversations);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const participantName = Object.values(conv.participantNames).find(
      (name) => name.toLowerCase().includes(search)
    );
    return (
      participantName ||
      conv.lastMessage?.content.toLowerCase().includes(search)
    );
  });

  const getOtherParticipantName = (conv: Conversation): string => {
    const names = Object.entries(conv.participantNames);
    const otherParticipant = names.find(([id]) => id !== user?.id);
    return otherParticipant ? otherParticipant[1] : 'Unknown';
  };

  const formatTimestamp = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const renderConversation = ({ item: conv }: { item: Conversation }) => {
    const participantName = getOtherParticipantName(conv);
    const isUnread = conv.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[
          styles.conversationCard,
          {
            backgroundColor: isUnread ? colors.primary + '10' : colors.card,
            borderColor: isUnread ? colors.primary + '30' : colors.cardBorder,
            borderRadius: borderRadius.xl,
          },
        ]}
        onPress={() => router.push(`/conversation/${conv.id}`)}
        activeOpacity={0.7}
      >
        <Avatar
          name={participantName}
          size="lg"
          showOnline
          online={true}
        />
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text
              style={[
                styles.participantName,
                { color: colors.foreground, fontWeight: isUnread ? '700' : '600' },
              ]}
              numberOfLines={1}
            >
              {participantName}
            </Text>
            <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
              {conv.lastMessage && formatTimestamp(conv.lastMessage.timestamp)}
            </Text>
          </View>
          <View style={styles.conversationFooter}>
            <Text
              style={[
                styles.lastMessage,
                {
                  color: isUnread ? colors.foreground : colors.mutedForeground,
                  fontWeight: isUnread ? '500' : '400',
                },
              ]}
              numberOfLines={1}
            >
              {conv.lastMessage?.content || 'No messages yet'}
            </Text>
            {conv.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.unreadCount}>{conv.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Messages
        </Text>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.muted }]}
          onPress={() => router.push('/new-conversation')}
        >
          <Ionicons name="create-outline" size={22} color={colors.foreground} />
        </TouchableOpacity>
      </Animated.View>

      {/* Search */}
      <Animated.View entering={FadeInDown.delay(150)} style={styles.searchSection}>
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          icon={<Ionicons name="search" size={20} color={colors.mutedForeground} />}
          containerStyle={styles.searchInput}
        />
      </Animated.View>

      {/* AI Assistant Card */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.aiSection}>
        <TouchableOpacity
          style={[
            styles.aiCard,
            {
              backgroundColor: colors.primary + '15',
              borderColor: colors.primary + '30',
              borderRadius: borderRadius.xl,
            },
          ]}
          onPress={() => router.push('/chat-assistant')}
        >
          <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={24} color="#fff" />
          </View>
          <View style={styles.aiContent}>
            <Text style={[styles.aiTitle, { color: colors.foreground }]}>
              ServiceHub AI Assistant
            </Text>
            <Text style={[styles.aiSubtitle, { color: colors.mutedForeground }]}>
              Get help with quotes, scheduling, and more
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
      </Animated.View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Card variant="glass" style={styles.emptyCard}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No Conversations
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Start a conversation by bidding on a job or posting your own
            </Text>
          </Card>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  aiSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
  },
  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiContent: {
    flex: 1,
    marginLeft: 16,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  conversationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 16,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
