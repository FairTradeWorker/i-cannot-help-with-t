// Mobile Message Bubble Component
// Displays chat messages in iOS-native style

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Message } from 'lucide-react-native';
import type { Message as MessageType, UserRole } from '@/types';

interface MessageBubbleProps {
  message: MessageType;
  isCurrentUser: boolean;
  currentUserRole: UserRole;
}

export function MessageBubble({ message, isCurrentUser, currentUserRole }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      {!isCurrentUser && (
        <View style={styles.avatar}>
          <Message size={16} color="#ffffff" />
        </View>
      )}

      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        {!isCurrentUser && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}

        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.content}
        </Text>

        <View style={styles.footer}>
          <Text style={[
            styles.timestamp,
            isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
          ]}>
            {formatTime(message.timestamp)}
          </Text>
          {isCurrentUser && (
            <View style={styles.readIndicator}>
              <Text style={styles.readText}>
                {message.read ? '✓✓' : '✓'}
              </Text>
            </View>
          )}
        </View>

        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.attachments}>
            {message.attachments.map((attachment, index) => (
              <View key={index} style={styles.attachment}>
                <Text style={styles.attachmentText}>
                  📎 {attachment.name || `Attachment ${index + 1}`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: '#0ea5e9',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#ffffff',
  },
  otherUserText: {
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: '#9ca3af',
  },
  readIndicator: {
    marginLeft: 4,
  },
  readText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  attachments: {
    marginTop: 8,
    gap: 4,
  },
  attachment: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },
  attachmentText: {
    fontSize: 13,
    color: '#ffffff',
  },
});

