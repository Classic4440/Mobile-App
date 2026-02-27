// Vouchers Screen - Create, view, revoke, delete vouchers
// Each voucher has code, duration, data limit, max devices, status, and usage tracking

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert,
  TextInput, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../../constants/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { VoucherCard } from '../../components/feature/VoucherCard';
import { useApp } from '../../contexts/AppContext';
import { VoucherStatus, formatBytes } from '../../services/mockData';
import * as Haptics from 'expo-haptics';

type VFilterType = 'all' | 'active' | 'unused' | 'expired' | 'revoked';

const vFilters: { id: VFilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'unused', label: 'Unused' },
  { id: 'expired', label: 'Expired' },
  { id: 'revoked', label: 'Revoked' },
];

// Preset voucher configurations
const presets = [
  { label: '1h Trial', duration: 1, data: 100, devices: 1 },
  { label: '4h Basic', duration: 4, data: 512, devices: 1 },
  { label: '24h Standard', duration: 24, data: 2048, devices: 2 },
  { label: '48h Premium', duration: 48, data: 5120, devices: 3 },
  { label: '72h Bulk', duration: 72, data: 10240, devices: 5 },
];

export default function VouchersScreen() {
  const insets = useSafeAreaInsets();
  const { vouchers, createVoucher, revokeVoucher, deleteVoucher } = useApp();
  const [activeFilter, setActiveFilter] = useState<VFilterType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [formDuration, setFormDuration] = useState('24');
  const [formDataLimit, setFormDataLimit] = useState('1024');
  const [formMaxDevices, setFormMaxDevices] = useState('2');
  const [formNote, setFormNote] = useState('');

  const filteredVouchers = useMemo(() => {
    if (activeFilter === 'all') return vouchers;
    return vouchers.filter(v => v.status === activeFilter);
  }, [vouchers, activeFilter]);

  const handleCreate = () => {
    const duration = parseInt(formDuration) || 24;
    const dataLimit = parseInt(formDataLimit) || 1024;
    const maxDevices = parseInt(formMaxDevices) || 2;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newVoucher = createVoucher({
      durationHours: duration,
      dataLimitMB: dataLimit,
      maxDevices: maxDevices,
      note: formNote || undefined,
    });

    setShowCreateModal(false);
    Alert.alert('Voucher Created', `Code: ${newVoucher.code}\nDuration: ${duration}h\nData: ${formatBytes(dataLimit)}\nMax Devices: ${maxDevices}`);

    // Reset form
    setFormDuration('24');
    setFormDataLimit('1024');
    setFormMaxDevices('2');
    setFormNote('');
  };

  const handleRevoke = (voucherId: string, code: string) => {
    Alert.alert(
      'Revoke Voucher',
      `Revoke voucher "${code}"? Connected devices will lose access.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            revokeVoucher(voucherId);
          },
        },
      ]
    );
  };

  const handleDelete = (voucherId: string) => {
    Haptics.selectionAsync();
    deleteVoucher(voucherId);
  };

  const handleCopyCode = (code: string) => {
    Haptics.selectionAsync();
    Alert.alert('Code Copied', code);
  };

  const applyPreset = (preset: typeof presets[0]) => {
    Haptics.selectionAsync();
    setFormDuration(String(preset.duration));
    setFormDataLimit(String(preset.data));
    setFormMaxDevices(String(preset.devices));
    setFormNote(preset.label);
  };

  // Stats
  const totalActiveData = vouchers
    .filter(v => v.status === 'active')
    .reduce((sum, v) => sum + v.dataLimitMB, 0);
  const totalUsedData = vouchers
    .filter(v => v.status === 'active')
    .reduce((sum, v) => sum + v.dataUsedMB, 0);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Vouchers</Text>
          <Text style={styles.subtitle}>{vouchers.length} total vouchers</Text>
        </View>
        <Pressable
          style={styles.createBtn}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialIcons name="add" size={20} color="#000" />
          <Text style={styles.createBtnText}>Create</Text>
        </Pressable>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <GlassCard padding={12} style={{ flex: 1 }}>
          <Text style={styles.qStatLabel}>ACTIVE</Text>
          <Text style={styles.qStatValue}>{vouchers.filter(v => v.status === 'active').length}</Text>
        </GlassCard>
        <GlassCard padding={12} style={{ flex: 1 }}>
          <Text style={styles.qStatLabel}>UNUSED</Text>
          <Text style={[styles.qStatValue, { color: theme.info }]}>{vouchers.filter(v => v.status === 'unused').length}</Text>
        </GlassCard>
        <GlassCard padding={12} style={{ flex: 1 }}>
          <Text style={styles.qStatLabel}>DATA POOL</Text>
          <Text style={[styles.qStatValue, { color: theme.warning, fontSize: 16 }]}>{formatBytes(totalActiveData)}</Text>
        </GlassCard>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {vFilters.map(filter => {
            const isActive = activeFilter === filter.id;
            return (
              <Pressable
                key={filter.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveFilter(filter.id);
                }}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Voucher list */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <FlashList
          data={filteredVouchers}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <VoucherCard
              voucher={item}
              onRevoke={() => handleRevoke(item.id, item.code)}
              onDelete={() => handleDelete(item.id)}
              onCopyCode={() => handleCopyCode(item.code)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="confirmation-number" size={48} color={theme.textTertiary} />
              <Text style={styles.emptyTitle}>No Vouchers</Text>
              <Text style={styles.emptyText}>Create a voucher to grant network access</Text>
            </View>
          }
        />
      </View>

      {/* Create Voucher Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Voucher</Text>
                <Pressable onPress={() => setShowCreateModal(false)} style={styles.closeBtn}>
                  <MaterialIcons name="close" size={24} color={theme.textSecondary} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Presets */}
                <Text style={styles.formLabel}>QUICK PRESETS</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, marginBottom: 16 }}
                >
                  {presets.map(preset => (
                    <Pressable
                      key={preset.label}
                      style={styles.presetChip}
                      onPress={() => applyPreset(preset)}
                    >
                      <Text style={styles.presetLabel}>{preset.label}</Text>
                      <Text style={styles.presetDetail}>{formatBytes(preset.data)}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {/* Form fields */}
                <Text style={styles.formLabel}>DURATION (HOURS)</Text>
                <TextInput
                  style={styles.input}
                  value={formDuration}
                  onChangeText={setFormDuration}
                  keyboardType="numeric"
                  placeholderTextColor={theme.textTertiary}
                  placeholder="24"
                />

                <Text style={styles.formLabel}>DATA LIMIT (MB)</Text>
                <TextInput
                  style={styles.input}
                  value={formDataLimit}
                  onChangeText={setFormDataLimit}
                  keyboardType="numeric"
                  placeholderTextColor={theme.textTertiary}
                  placeholder="1024"
                />

                <Text style={styles.formLabel}>MAX DEVICES</Text>
                <TextInput
                  style={styles.input}
                  value={formMaxDevices}
                  onChangeText={setFormMaxDevices}
                  keyboardType="numeric"
                  placeholderTextColor={theme.textTertiary}
                  placeholder="2"
                />

                <Text style={styles.formLabel}>NOTE (OPTIONAL)</Text>
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  value={formNote}
                  onChangeText={setFormNote}
                  placeholderTextColor={theme.textTertiary}
                  placeholder="Guest access, premium tier, etc."
                  multiline
                />

                {/* Summary */}
                <GlassCard padding={14} style={{ marginTop: 8, marginBottom: 16 }}>
                  <Text style={styles.summaryTitle}>VOUCHER SUMMARY</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration</Text>
                    <Text style={styles.summaryValue}>{formDuration || '0'} hours</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Data Limit</Text>
                    <Text style={styles.summaryValue}>{formatBytes(parseInt(formDataLimit) || 0)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Max Devices</Text>
                    <Text style={styles.summaryValue}>{formMaxDevices || '0'}</Text>
                  </View>
                </GlassCard>

                {/* Create button */}
                <Pressable style={styles.modalCreateBtn} onPress={handleCreate}>
                  <MaterialIcons name="confirmation-number" size={20} color="#000" />
                  <Text style={styles.modalCreateBtnText}>Generate Voucher</Text>
                </Pressable>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
  },
  title: {
    ...theme.typography.title,
    color: theme.textPrimary,
  },
  subtitle: {
    color: theme.textTertiary,
    fontSize: 13,
    marginTop: 2,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  createBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  qStatLabel: {
    ...theme.typography.micro,
    color: theme.textTertiary,
    fontSize: 9,
    marginBottom: 4,
  },
  qStatValue: {
    color: theme.success,
    fontSize: 20,
    fontWeight: '700',
  },
  filterRow: {
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterChipActive: {
    backgroundColor: `${theme.primary}15`,
    borderColor: `${theme.primary}40`,
  },
  filterText: {
    color: theme.textTertiary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: theme.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    color: theme.textSecondary,
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    color: theme.textTertiary,
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0D0D12',
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...theme.typography.subtitle,
    color: theme.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formLabel: {
    ...theme.typography.micro,
    color: theme.textTertiary,
    fontSize: 10,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.textPrimary,
    fontSize: 16,
    marginBottom: 12,
  },
  presetChip: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  presetLabel: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  presetDetail: {
    color: theme.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  summaryTitle: {
    ...theme.typography.micro,
    color: theme.textTertiary,
    fontSize: 10,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  summaryLabel: {
    color: theme.textSecondary,
    fontSize: 13,
  },
  summaryValue: {
    color: theme.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  modalCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    gap: 8,
  },
  modalCreateBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
