// Mobile Bid Card Component
// Displays contractor bids on job details

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Clock, CheckCircle, User, DollarSign } from 'lucide-react-native';
import type { Bid } from '@/types';

interface BidCardProps {
  bid: Bid;
  isAccepted?: boolean;
  isWinning?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  canAccept?: boolean;
}

export function BidCard({ 
  bid, 
  isAccepted = false, 
  isWinning = false,
  onAccept,
  onReject,
  canAccept = false 
}: BidCardProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const timelineDays = Math.ceil(
    (bid.timeline.end.getTime() - bid.timeline.start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <View style={[
      styles.card,
      isAccepted && styles.acceptedCard,
      isWinning && styles.winningCard
    ]}>
      <View style={styles.header}>
        <View style={styles.contractorInfo}>
          <View style={styles.avatar}>
            <User size={20} color="#0ea5e9" />
          </View>
          <View style={styles.contractorDetails}>
            <Text style={styles.contractorName}>{bid.contractor.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.rating}>{bid.contractor.rating.toFixed(1)}</Text>
              <Text style={styles.completedJobs}>
                • {bid.contractor.completedJobs} jobs
              </Text>
            </View>
          </View>
        </View>

        {isAccepted && (
          <View style={styles.acceptedBadge}>
            <CheckCircle size={16} color="#22c55e" />
            <Text style={styles.acceptedText}>Accepted</Text>
          </View>
        )}
      </View>

      <View style={styles.bidAmount}>
        <DollarSign size={28} color="#22c55e" />
        <Text style={styles.amount}>{bid.amount.toLocaleString()}</Text>
      </View>

      {bid.breakdown && (
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Materials</Text>
            <Text style={styles.breakdownValue}>
              ${bid.breakdown.materials.toLocaleString()}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Labor</Text>
            <Text style={styles.breakdownValue}>
              ${bid.breakdown.labor.toLocaleString()}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Overhead</Text>
            <Text style={styles.breakdownValue}>
              ${bid.breakdown.overhead.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.breakdownRow, styles.breakdownTotal]}>
            <Text style={styles.breakdownLabelTotal}>Total</Text>
            <Text style={styles.breakdownValueTotal}>
              ${bid.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.timeline}>
        <Clock size={16} color="#6b7280" />
        <Text style={styles.timelineText}>
          {formatDate(bid.timeline.start)} - {formatDate(bid.timeline.end)} ({timelineDays} days)
        </Text>
      </View>

      {bid.message && (
        <View style={styles.message}>
          <Text style={styles.messageText}>{bid.message}</Text>
        </View>
      )}

      {canAccept && !isAccepted && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={onReject}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>Accept Bid</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  acceptedCard: {
    borderColor: '#22c55e',
    borderWidth: 2,
    backgroundColor: '#f0fdf4',
  },
  winningCard: {
    borderColor: '#0ea5e9',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contractorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contractorDetails: {
    flex: 1,
  },
  contractorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  completedJobs: {
    fontSize: 14,
    color: '#6b7280',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  acceptedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  bidAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  breakdown: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 4,
    paddingTop: 8,
  },
  breakdownLabelTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  breakdownValueTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  timelineText: {
    fontSize: 14,
    color: '#6b7280',
  },
  message: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

