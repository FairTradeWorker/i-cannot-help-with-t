// Job Filters Component
// Advanced filtering UI for jobs

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X, SlidersHorizontal, DollarSign, MapPin, Clock } from 'lucide-react-native';
import type { UrgencyLevel } from '@/types';
import type { JobFilters } from '@/utils/job-filters';

interface JobFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  onClose?: () => void;
}

export function JobFiltersPanel({ filters, onFiltersChange, onClose }: JobFiltersProps) {
  const urgencyOptions: UrgencyLevel[] = ['normal', 'urgent', 'emergency'];
  const sortOptions: Array<{ value: JobFilters['sortBy']; label: string }> = [
    { value: 'date', label: 'Newest First' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'price', label: 'Highest Price' },
    { value: 'urgency', label: 'Most Urgent' },
  ];

  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SlidersHorizontal size={24} color="#111827" />
          <Text style={styles.headerTitle}>Filters</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Urgency Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgency</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              onPress={() => updateFilter('urgency', undefined)}
              style={[
                styles.optionChip,
                !filters.urgency && styles.optionChipActive,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  !filters.urgency && styles.optionTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {urgencyOptions.map((urgency) => (
              <TouchableOpacity
                key={urgency}
                onPress={() => updateFilter('urgency', urgency)}
                style={[
                  styles.optionChip,
                  filters.urgency === urgency && styles.optionChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.urgency === urgency && styles.optionTextActive,
                  ]}
                >
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceInputs}>
            <View style={styles.priceInput}>
              <DollarSign size={16} color="#6b7280" />
              <Text style={styles.inputLabel}>Min</Text>
              {/* TODO: Add TextInput for min price */}
            </View>
            <View style={styles.priceInput}>
              <DollarSign size={16} color="#6b7280" />
              <Text style={styles.inputLabel}>Max</Text>
              {/* TODO: Add TextInput for max price */}
            </View>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.optionsRow}>
            {[5, 10, 25, 50, 100].map((distance) => (
              <TouchableOpacity
                key={distance}
                onPress={() => updateFilter('maxDistance', distance)}
                style={[
                  styles.optionChip,
                  filters.maxDistance === distance && styles.optionChipActive,
                ]}
              >
                <MapPin size={14} color={filters.maxDistance === distance ? '#ffffff' : '#6b7280'} />
                <Text
                  style={[
                    styles.optionText,
                    filters.maxDistance === distance && styles.optionTextActive,
                  ]}
                >
                  {distance} mi
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort By */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.sortOptions}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => updateFilter('sortBy', option.value)}
                style={[
                  styles.sortOption,
                  filters.sortBy === option.value && styles.sortOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    filters.sortBy === option.value && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {filters.sortBy === option.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Clear Filters */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => onFiltersChange({})}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear All Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  optionChipActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextActive: {
    color: '#ffffff',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortOptionActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#0ea5e9',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  sortOptionTextActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clearButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
});

