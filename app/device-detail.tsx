// Device Detail Screen - Full device info, usage breakdown, bandwidth control, and root commands
// Accessed via modal from Devices tab

import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BandwidthSlider } from '../components/feature/BandwidthSlider';
import { GlassCard } from '../components/ui/GlassCard';
import { ProgressRing } from '../components/ui/ProgressRing';
import { StatusBadge } from '../components/ui/StatusBadge';
import { config } from '../constants/config';
import { theme } from '../constants/theme';
import { useApp } from '../contexts/AppContext';
import {
  formatBytes,
  formatSpeed,
  formatTimeAgo,
  getDeviceIcon,
  getSignalColor,
  getStatusColor,
  getTimeSinceConnected,
} from '../services/mockData';

export default function DeviceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { devices, kickDevice, blockDevice, unblockDevice, setDeviceSpeedLimit, limitDevice } = useApp();

  const device = useMemo(() => devices.find(d => d.id === id), [devices, id]);

  const [downloadLimit, setDownloadLimit] = useState(device?.maxDownloadSpeed ?? 50);
  const [uploadLimit, setUploadLimit] = useState(device?.maxUploadSpeed ?? 25);

  if (!device) {
    return (
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.notFound}>
          <MaterialIcons name="error-outline" size={48} color={theme.textTertiary} />
          <Text style={styles.notFoundText}>Device not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(device.status);
  const signalColor = getSignalColor(device.signalStrength);
  const isBlocked = device.status === 'blocked';
  const totalData = device.downloadUsageMB + device.uploadUsageMB;
  const downloadRatio = totalData > 0 ? device.downloadUsageMB / totalData : 0;

  const deviceTypeColors: Record<string, string> = {
    phone: theme.devicePhone,
    tablet: theme.deviceTablet,
    laptop: theme.deviceLaptop,
    desktop: theme.deviceDesktop,
    other: theme.deviceOther,
  };
  const typeColor = deviceTypeColors[device.deviceType] || theme.deviceOther;

  const handleKick = () => {
    Alert.alert('Kick Device', `Remove "${device.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Kick', style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          kickDevice(device.id);
          router.back();
        },
      },
    ]);
  };

  const handleBlock = () => {
    Alert.alert('Block Device', `Block "${device.name}" permanently?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block', style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          blockDevice(device.id);
        },
      },
    ]);
  };

  const handleUnblock = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    unblockDevice(device.id);
  };

  const handleApplyLimits = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDeviceSpeedLimit(device.id, downloadLimit, uploadLimit);
    Alert.alert('Applied', `DL: ${downloadLimit} Mbps / UL: ${uploadLimit} Mbps`);
  };

  const handleThrottle = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    limitDevice(device.id, downloadLimit, uploadLimit);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with close button */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.textSecondary} />
          </Pressable>
          <Text style={styles.headerTitle}>Device Details</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Device Hero */}
        <GlassCard variant="elevated" padding={0} style={styles.heroCard}>
          <LinearGradient
            colors={[`${typeColor}25`, '#0A0A0F']}
            style={styles.heroGradient}
          >
            <View style={[styles.heroIcon, { backgroundColor: `${typeColor}20` }]}>
              <MaterialIcons name={getDeviceIcon(device.deviceType) as any} size={40} color={typeColor} />
            </View>
            <Text style={styles.heroName}>{device.name}</Text>
            <Text style={styles.heroHostname}>{device.hostname}</Text>
            <StatusBadge label={device.status} color={statusColor} size="md" />
          </LinearGradient>
        </GlassCard>

        {/* Network Identity */}
        <Text style={styles.sectionTitle}>NETWORK IDENTITY</Text>
        <GlassCard padding={14}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IP Address</Text>
            <Text style={styles.infoValue}>{device.ipAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>MAC Address</Text>
            <Text style={styles.infoValue}>{device.macAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device Type</Text>
            <Text style={[styles.infoValue, { color: typeColor, textTransform: 'capitalize' }]}>{device.deviceType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Connected</Text>
            <Text style={styles.infoValue}>{getTimeSinceConnected(device.connectedAt)}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Last Activity</Text>
            <Text style={styles.infoValue}>{formatTimeAgo(device.lastActivity)}</Text>
          </View>
        </GlassCard>

        {/* Usage Stats */}
        <Text style={styles.sectionTitle}>DATA USAGE</Text>
        <View style={styles.usageRow}>
          <GlassCard padding={14} style={{ flex: 1, alignItems: 'center' }}>
            <ProgressRing progress={downloadRatio} size={80} strokeWidth={6} color={theme.info}>
              <MaterialIcons name="arrow-downward" size={20} color={theme.info} />
            </ProgressRing>
            <Text style={styles.usageValue}>{formatBytes(device.downloadUsageMB)}</Text>
            <Text style={styles.usageLabel}>DOWNLOAD</Text>
          </GlassCard>
          <GlassCard padding={14} style={{ flex: 1, alignItems: 'center' }}>
            <ProgressRing progress={1 - downloadRatio} size={80} strokeWidth={6} color={theme.success}>
              <MaterialIcons name="arrow-upward" size={20} color={theme.success} />
            </ProgressRing>
            <Text style={styles.usageValue}>{formatBytes(device.uploadUsageMB)}</Text>
            <Text style={styles.usageLabel}>UPLOAD</Text>
          </GlassCard>
        </View>

        <GlassCard padding={14} style={{ marginTop: 10 }}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Data Transferred</Text>
            <Text style={styles.totalValue}>{formatBytes(totalData)}</Text>
          </View>
        </GlassCard>

        {/* Real-time Speeds */}
        <Text style={styles.sectionTitle}>CURRENT SPEED</Text>
        <View style={styles.speedRow}>
          <GlassCard padding={14} style={{ flex: 1 }}>
            <View style={styles.speedHeader}>
              <MaterialIcons name="arrow-downward" size={14} color={theme.info} />
              <Text style={styles.speedHeaderText}>Download</Text>
            </View>
            <Text style={styles.speedCurrentValue}>
              {isBlocked ? '0' : formatSpeed(device.currentDownloadSpeed)}
            </Text>
            <View style={styles.speedLimit}>
              <Text style={styles.speedLimitText}>Limit: {formatSpeed(device.maxDownloadSpeed)}</Text>
              <View style={styles.speedBar}>
                <View style={[styles.speedBarFill, {
                  width: `${isBlocked ? 0 : Math.min((device.currentDownloadSpeed / device.maxDownloadSpeed) * 100, 100)}%`,
                  backgroundColor: theme.info,
                }]} />
              </View>
            </View>
          </GlassCard>
          <GlassCard padding={14} style={{ flex: 1 }}>
            <View style={styles.speedHeader}>
              <MaterialIcons name="arrow-upward" size={14} color={theme.success} />
              <Text style={styles.speedHeaderText}>Upload</Text>
            </View>
            <Text style={styles.speedCurrentValue}>
              {isBlocked ? '0' : formatSpeed(device.currentUploadSpeed)}
            </Text>
            <View style={styles.speedLimit}>
              <Text style={styles.speedLimitText}>Limit: {formatSpeed(device.maxUploadSpeed)}</Text>
              <View style={styles.speedBar}>
                <View style={[styles.speedBarFill, {
                  width: `${isBlocked ? 0 : Math.min((device.currentUploadSpeed / device.maxUploadSpeed) * 100, 100)}%`,
                  backgroundColor: theme.success,
                }]} />
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Signal Strength */}
        <Text style={styles.sectionTitle}>SIGNAL</Text>
        <GlassCard padding={14}>
          <View style={styles.signalRow}>
            <MaterialIcons name="signal-wifi-4-bar" size={24} color={isBlocked ? theme.textTertiary : signalColor} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.signalValue}>
                {isBlocked ? 'Disconnected' : `${device.signalStrength}%`}
              </Text>
              <View style={styles.signalBar}>
                <View style={[styles.signalBarFill, {
                  width: `${isBlocked ? 0 : device.signalStrength}%`,
                  backgroundColor: signalColor,
                }]} />
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Bandwidth Controls */}
        {!isBlocked && (
          <>
            <Text style={styles.sectionTitle}>BANDWIDTH CONTROL</Text>
            <View style={{ gap: 10, marginBottom: 14 }}>
              <BandwidthSlider
                label="Download Limit"
                value={downloadLimit}
                maxValue={config.maxDownloadSpeed}
                icon="arrow-downward"
                iconColor={theme.info}
                onValueChange={setDownloadLimit}
              />
              <BandwidthSlider
                label="Upload Limit"
                value={uploadLimit}
                maxValue={config.maxUploadSpeed}
                icon="arrow-upward"
                iconColor={theme.success}
                onValueChange={setUploadLimit}
              />
            </View>

            <Pressable style={styles.applyBtn} onPress={handleApplyLimits}>
              <MaterialIcons name="check-circle" size={18} color="#000" />
              <Text style={styles.applyBtnText}>Apply Speed Limits</Text>
            </Pressable>
          </>
        )}

        {/* Actions */}
        <Text style={styles.sectionTitle}>ACTIONS</Text>
        <View style={styles.actionsGrid}>
          {isBlocked ? (
            <Pressable style={[styles.actionCard, { borderColor: `${theme.success}30` }]} onPress={handleUnblock}>
              <MaterialIcons name="lock-open" size={24} color={theme.success} />
              <Text style={[styles.actionCardText, { color: theme.success }]}>Unblock</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={[styles.actionCard, { borderColor: `${theme.warning}30` }]} onPress={handleThrottle}>
                <MaterialIcons name="slow-motion-video" size={24} color={theme.warning} />
                <Text style={[styles.actionCardText, { color: theme.warning }]}>Throttle</Text>
              </Pressable>
              <Pressable style={[styles.actionCard, { borderColor: `${theme.error}30` }]} onPress={handleBlock}>
                <MaterialIcons name="block" size={24} color={theme.error} />
                <Text style={[styles.actionCardText, { color: theme.error }]}>Block</Text>
              </Pressable>
              <Pressable style={[styles.actionCard, { borderColor: `${theme.error}30` }]} onPress={handleKick}>
                <MaterialIcons name="person-remove" size={24} color={theme.error} />
                <Text style={[styles.actionCardText, { color: theme.error }]}>Kick</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Root Commands Reference */}
        <Text style={styles.sectionTitle}>ROOT COMMANDS</Text>
        <GlassCard padding={14}>
          <Text style={styles.cmdTitle}>Block via iptables</Text>
          <View style={styles.cmdBlock}>
            <Text style={styles.cmdText}>
              iptables -I FORWARD -m mac --mac-source {device.macAddress} -j DROP
            </Text>
          </View>

          <Text style={[styles.cmdTitle, { marginTop: 12 }]}>Unblock</Text>
          <View style={styles.cmdBlock}>
            <Text style={styles.cmdText}>
              iptables -D FORWARD -m mac --mac-source {device.macAddress} -j DROP
            </Text>
          </View>

          <Text style={[styles.cmdTitle, { marginTop: 12 }]}>Bandwidth Limit (tc)</Text>
          <View style={styles.cmdBlock}>
            <Text style={styles.cmdText}>
              tc qdisc add dev wlan0 root handle 1: htb{'\n'}
              tc class add dev wlan0 parent 1: classid 1:1 htb rate {downloadLimit}mbit ceil {downloadLimit}mbit{'\n'}
              tc filter add dev wlan0 parent 1:0 protocol ip u32 match ip dst {device.ipAddress}/32 flowid 1:1
            </Text>
          </View>

          <Text style={[styles.cmdTitle, { marginTop: 12 }]}>Get ARP Entry</Text>
          <View style={styles.cmdBlock}>
            <Text style={styles.cmdText}>
              cat /proc/net/arp | grep {device.ipAddress}
            </Text>
          </View>
        </GlassCard>
      </ScrollView>
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
    marginBottom: 16,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  heroCard: {
    marginBottom: 20,
  },
  heroGradient: {
    borderRadius: theme.radius.xl,
    padding: 24,
    alignItems: 'center',
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroName: {
    ...theme.typography.subtitle,
    color: theme.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  heroHostname: {
    color: theme.textTertiary,
    fontSize: 13,
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  sectionTitle: {
    ...theme.typography.micro,
    color: theme.textTertiary,
    marginBottom: 10,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  infoLabel: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  usageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  usageValue: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  usageLabel: {
    ...theme.typography.micro,
    color: theme.textTertiary,
    fontSize: 10,
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  totalValue: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  speedRow: {
    flexDirection: 'row',
    gap: 10,
  },
  speedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  speedHeaderText: {
    color: theme.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  speedCurrentValue: {
    color: theme.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  speedLimit: {
    gap: 4,
  },
  speedLimitText: {
    color: theme.textTertiary,
    fontSize: 10,
  },
  speedBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  speedBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalValue: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  signalBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  signalBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 15,
    gap: 8,
    marginBottom: 8,
  },
  applyBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    paddingVertical: 18,
    gap: 6,
  },
  actionCardText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cmdTitle: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  cmdBlock: {
    backgroundColor: 'rgba(0,229,204,0.06)',
    borderRadius: theme.radius.sm,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
  },
  cmdText: {
    color: theme.primary,
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    color: theme.textSecondary,
    fontSize: 16,
  },
  backBtn: {
    backgroundColor: theme.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtnText: {
    color: '#000',
    fontWeight: '600',
  },
});
