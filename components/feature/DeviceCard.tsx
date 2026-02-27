// DeviceCard - Connected device list item with status, usage, and actions

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import {
    ConnectedDevice,
    formatBytes,
    formatSpeed,
    getDeviceIcon,
    getSignalColor,
    getStatusColor,
    getTimeSinceConnected,
} from '../../services/mockData';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';

interface DeviceCardProps {
    device: ConnectedDevice;
    onPress?: () => void;
    onKick?: () => void;
    onBlock?: () => void;
    onUnblock?: () => void;
}

export function DeviceCard({ device, onPress, onKick, onBlock, onUnblock }: DeviceCardProps) {
    const statusColor = getStatusColor(device.status);
    const signalColor = getSignalColor(device.signalStrength);
    const isBlocked = device.status === 'blocked';
    const totalUsage = device.downloadUsageMB + device.uploadUsageMB;

    const deviceTypeColors: Record<string, string> = {
        phone: theme.devicePhone,
        tablet: theme.deviceTablet,
        laptop: theme.deviceLaptop,
        desktop: theme.deviceDesktop,
        other: theme.deviceOther,
    };
    const typeColor = deviceTypeColors[device.deviceType] || theme.deviceOther;

    return (
        <Pressable onPress={onPress}>
            <GlassCard variant="elevated" padding={14}>
                <View style={styles.topRow}>
                    {/* Device icon + info */}
                    <View style={styles.deviceInfo}>
                        <View style={[styles.iconCircle, { backgroundColor: `${typeColor}20` }]}>
                            <MaterialIcons name={getDeviceIcon(device.deviceType) as any} size={22} color={typeColor} />
                        </View>
                        <View style={styles.nameBlock}>
                            <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
                            <Text style={styles.ipText}>{device.ipAddress}</Text>
                        </View>
                    </View>
                    {/* Status */}
                    <StatusBadge
                        label={device.status}
                        color={statusColor}
                    />
                </View>

                {/* MAC Address */}
                <View style={styles.macRow}>
                    <Text style={styles.macLabel}>MAC</Text>
                    <Text style={styles.macValue}>{device.macAddress}</Text>
                </View>

                {/* Stats row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <MaterialIcons name="arrow-downward" size={12} color={theme.info} />
                        <Text style={styles.statValue}>{formatBytes(device.downloadUsageMB)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="arrow-upward" size={12} color={theme.success} />
                        <Text style={styles.statValue}>{formatBytes(device.uploadUsageMB)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="speed" size={12} color={theme.warning} />
                        <Text style={styles.statValue}>
                            {isBlocked ? '0' : formatSpeed(device.currentDownloadSpeed)}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="signal-wifi-4-bar" size={12} color={signalColor} />
                        <Text style={[styles.statValue, { color: signalColor }]}>
                            {isBlocked ? '—' : `${device.signalStrength}%`}
                        </Text>
                    </View>
                </View>

                {/* Speed limit bar */}
                {!isBlocked && (
                    <View style={styles.speedBar}>
                        <View style={styles.speedBarTrack}>
                            <View
                                style={[
                                    styles.speedBarFill,
                                    {
                                        width: `${Math.min((device.currentDownloadSpeed / device.maxDownloadSpeed) * 100, 100)}%`,
                                        backgroundColor: device.status === 'limited' ? theme.warning : theme.primary,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.speedLimitText}>
                            {formatSpeed(device.maxDownloadSpeed)} limit
                        </Text>
                    </View>
                )}

                {/* Bottom row - actions + time */}
                <View style={styles.bottomRow}>
                    <Text style={styles.connectedTime}>
                        Connected {getTimeSinceConnected(device.connectedAt)}
                    </Text>
                    <View style={styles.actions}>
                        {isBlocked ? (
                            <Pressable style={[styles.actionBtn, styles.unblockBtn]} onPress={onUnblock}>
                                <MaterialIcons name="lock-open" size={14} color={theme.success} />
                                <Text style={[styles.actionText, { color: theme.success }]}>Unblock</Text>
                            </Pressable>
                        ) : (
                            <>
                                <Pressable style={[styles.actionBtn, styles.blockBtn]} onPress={onBlock}>
                                    <MaterialIcons name="block" size={14} color={theme.warning} />
                                </Pressable>
                                <Pressable style={[styles.actionBtn, styles.kickBtn]} onPress={onKick}>
                                    <MaterialIcons name="person-remove" size={14} color={theme.error} />
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </GlassCard>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    nameBlock: {
        flex: 1,
    },
    deviceName: {
        color: theme.textPrimary,
        fontSize: 15,
        fontWeight: '600',
    },
    ipText: {
        color: theme.textTertiary,
        fontSize: 12,
        fontFamily: 'monospace',
        marginTop: 1,
    },
    macRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        gap: 8,
    },
    macLabel: {
        ...theme.typography.micro,
        color: theme.textTertiary,
        fontSize: 9,
    },
    macValue: {
        color: theme.textSecondary,
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: 0.5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        color: theme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    speedBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    speedBarTrack: {
        flex: 1,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    speedBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    speedLimitText: {
        color: theme.textTertiary,
        fontSize: 10,
        fontWeight: '500',
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    connectedTime: {
        color: theme.textTertiary,
        fontSize: 11,
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: theme.radius.sm,
        gap: 4,
    },
    blockBtn: {
        backgroundColor: `${theme.warning}15`,
    },
    kickBtn: {
        backgroundColor: `${theme.error}15`,
    },
    unblockBtn: {
        backgroundColor: `${theme.success}15`,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
