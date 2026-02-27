// Dashboard Screen - HotspotManager
// Shows hotspot status, connected device count, total usage, network stats, usage chart

import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DataCard } from '../../components/ui/DataCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { HotspotLogo } from '../../components/Logo';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import { useAnimationSettings } from '../../hooks/useAnimationSettings';
import {
  formatBytes,
  formatDuration,
  formatSpeed,
  mockUsageHistory,
} from '../../services/mockData';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    hotspotConfig,
    networkStats,
    activeDevices,
    blockedDevices,
    limitedDevices,
    totalBandwidthUsage,
    toggleHotspot,
    accentColor,
  } = useApp();
  const animationSettings = useAnimationSettings();

  // Fallback colors
  const primaryAccent = accentColor || '#00E5CC';
  
  const connectedRatio = hotspotConfig.maxClients > 0
    ? activeDevices.length / hotspotConfig.maxClients
    : 0;

  const handleToggle = () => {
    if (animationSettings.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    toggleHotspot();
  };

  const maxUsage = Math.max(...mockUsageHistory.map(h => h.downloadMB));

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <HotspotLogo size={40} showText={false} accentColor={primaryAccent} />
            <View style={styles.titleContainer}>
              <Text style={styles.appTitle}>HM</Text>
              <Text style={[styles.appSubtitle, { color: primaryAccent }]}>v1.0.0</Text>
            </View>
          </View>
          <Pressable 
            onPress={() => router.push('/settings')} 
            style={styles.settingsBtn}
            hitSlop={10}
          >
            <MaterialIcons
              name="settings"
              size={24}
              color={theme.textSecondary}
            />
          </Pressable>
        </View>

        {/* Root Status Badge */}
        <View style={styles.statusRow}>
          <View style={[styles.rootBadge, { backgroundColor: hotspotConfig.isRooted ? `${theme.success}15` : `${theme.warning}15` }]}>
            <MaterialIcons
              name={hotspotConfig.isRooted ? 'verified-user' : 'gpp-maybe'}
              size={16}
              color={hotspotConfig.isRooted ? theme.success : theme.warning}
            />
            <Text style={[
              styles.rootText,
              { color: hotspotConfig.isRooted ? theme.success : theme.warning },
            ]}>
              {hotspotConfig.isRooted ? 'Root Access' : 'Standard Mode'}
            </Text>
          </View>
        </View>

        {/* Hotspot Hero Card */}
        <GlassCard variant="elevated" padding={0} style={styles.heroCard}>
          <LinearGradient
            colors={hotspotConfig.isActive ? [`${primaryAccent}30`, '#001A17'] : ['#1A1A1A', '#0D0D0D']}
            style={styles.heroGradient}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroInfo}>
                <Text style={styles.ssidLabel}>SSID</Text>
                <Text style={styles.ssidValue}>{hotspotConfig.ssid}</Text>
                <View style={styles.heroMeta}>
                  <StatusBadge
                    label={hotspotConfig.isActive ? 'Active' : 'Offline'}
                    color={hotspotConfig.isActive ? primaryAccent : theme.textTertiary}
                    size="md"
                  />
                  <Text style={styles.bandText}>{hotspotConfig.band}</Text>
                  <Text style={styles.bandText}>{hotspotConfig.securityType}</Text>
                </View>
              </View>
              <View style={styles.heroToggle}>
                <ProgressRing
                  progress={connectedRatio}
                  size={100}
                  strokeWidth={6}
                  color={hotspotConfig.isActive ? primaryAccent : theme.textTertiary}
                >
                  <Text style={styles.deviceCount}>{activeDevices.length}</Text>
                  <Text style={styles.deviceCountLabel}>/{hotspotConfig.maxClients}</Text>
                </ProgressRing>
              </View>
            </View>

            {/* Toggle row */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Hotspot Power</Text>
              <Switch
                value={hotspotConfig.isActive}
                onValueChange={handleToggle}
                trackColor={{ false: '#333', true: `${primaryAccent}60` }}
                thumbColor={hotspotConfig.isActive ? primaryAccent : '#666'}
              />
            </View>
          </LinearGradient>
        </GlassCard>

        {/* Quick Stats Grid */}
        <Text style={styles.sectionTitle}>NETWORK OVERVIEW</Text>
        <View style={styles.statsGrid}>
          <DataCard
            icon="arrow-downward"
            iconColor={theme.info}
            value={formatBytes(networkStats.totalDownloadMB)}
            label="Downloaded"
            compact
          />
          <DataCard
            icon="arrow-upward"
            iconColor={theme.success}
            value={formatBytes(networkStats.totalUploadMB)}
            label="Uploaded"
            compact
          />
        </View>
        <View style={styles.statsGrid}>
          <DataCard
            icon="speed"
            iconColor={theme.warning}
            value={formatSpeed(totalBandwidthUsage.download)}
            label="Current DL"
            compact
          />
          <DataCard
            icon="trending-up"
            iconColor={primaryAccent}
            value={formatSpeed(networkStats.peakDownloadSpeed)}
            label="Peak Speed"
            compact
          />
        </View>

        {/* Device Breakdown */}
        <Text style={styles.sectionTitle}>CONNECTED DEVICES</Text>
        <GlassCard padding={16}>
          <View style={styles.deviceBreakdown}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: primaryAccent }]} />
              <Text style={styles.breakdownLabel}>Active</Text>
              <Text style={styles.breakdownValue}>{activeDevices.length}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: theme.warning }]} />
              <Text style={styles.breakdownLabel}>Limited</Text>
              <Text style={styles.breakdownValue}>{limitedDevices.length}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: theme.error }]} />
              <Text style={styles.breakdownLabel}>Blocked</Text>
              <Text style={styles.breakdownValue}>{blockedDevices.length}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Usage Chart */}
        <Text style={styles.sectionTitle}>24-HOUR USAGE</Text>
        <GlassCard padding={14}>
          <View style={styles.chartContainer}>
            {mockUsageHistory.filter((_, i) => i % 2 === 0).map((point) => {
              const height = maxUsage > 0 ? (point.downloadMB / maxUsage) * 100 : 0;
              return (
                <View key={point.hour} style={styles.chartBarWrapper}>
                  <View style={styles.chartBarTrack}>
                    <LinearGradient
                      colors={[primaryAccent, `${primaryAccent}40`]}
                      style={[styles.chartBarFill, { height: `${height}%` }]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>
                    {point.hour.split(':')[0]}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: primaryAccent }]} />
              <Text style={styles.legendText}>Download</Text>
            </View>
          </View>
        </GlassCard>

        {/* Network Info */}
        <Text style={styles.sectionTitle}>NETWORK DETAILS</Text>
        <GlassCard padding={14}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gateway IP</Text>
            <Text style={styles.detailValue}>{hotspotConfig.gatewayIP}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Password</Text>
            <Text style={styles.detailValue}>{hotspotConfig.password}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Uptime</Text>
            <Text style={styles.detailValue}>{formatDuration(networkStats.uptimeMinutes)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Connections</Text>
            <Text style={styles.detailValue}>{networkStats.totalConnectionsToday}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Blocked Attempts</Text>
            <Text style={[styles.detailValue, { color: theme.error }]}>{networkStats.blockedAttempts}</Text>
          </View>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleContainer: {
    gap: 1,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1,
  },
  settingsBtn: {
    padding: 8,
  },
  statusRow: {
    marginBottom: 16,
  },
  rootBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  rootText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    marginBottom: 20,
  },
  heroGradient: {
    borderRadius: 20,
    padding: 20,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroInfo: {
    flex: 1,
    marginRight: 12,
  },
  ssidLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ssidValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bandText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '500',
  },
  heroToggle: {
    alignItems: 'center',
  },
  deviceCount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  deviceCountLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    marginTop: -4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 14,
  },
  toggleLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  deviceBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  breakdownItem: {
    alignItems: 'center',
    gap: 4,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  breakdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 4,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarTrack: {
    width: '80%',
    height: 100,
    justifyContent: 'flex-end',
    borderRadius: 3,
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 3,
  },
  chartLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 9,
    marginTop: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
});
