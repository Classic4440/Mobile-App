// Controls Screen - Per-device bandwidth/speed management
// Select a device, adjust its download/upload speed limits, apply limits, or remove limits

import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BandwidthSlider } from '../../components/feature/BandwidthSlider';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { config } from '../../constants/config';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';
import {
    formatBytes,
    formatSpeed,
    getDeviceIcon,
    getStatusColor,
} from '../../services/mockData';

export default function ControlsScreen() {
    const insets = useSafeAreaInsets();
    const { devices, setDeviceSpeedLimit, limitDevice, unblockDevice, hotspotConfig, updateHotspotConfig } = useApp();
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

    const activeDevices = useMemo(
        () => devices.filter(d => d.status !== 'blocked'),
        [devices]
    );

    const selectedDevice = useMemo(
        () => devices.find(d => d.id === selectedDeviceId),
        [devices, selectedDeviceId]
    );

    const [downloadLimit, setDownloadLimit] = useState(50);
    const [uploadLimit, setUploadLimit] = useState(25);

    // Sync sliders when device changes
    React.useEffect(() => {
        if (selectedDevice) {
            setDownloadLimit(selectedDevice.maxDownloadSpeed);
            setUploadLimit(selectedDevice.maxUploadSpeed);
        }
    }, [selectedDeviceId]);

    const applyLimits = () => {
        if (!selectedDeviceId) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setDeviceSpeedLimit(selectedDeviceId, downloadLimit, uploadLimit);
        Alert.alert('Speed Limits Applied', `Download: ${downloadLimit} Mbps\nUpload: ${uploadLimit} Mbps`);
    };

    const applyThrottle = () => {
        if (!selectedDeviceId) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        limitDevice(selectedDeviceId, downloadLimit, uploadLimit);
        Alert.alert('Device Throttled', `${selectedDevice?.name} is now limited to ${downloadLimit}/${uploadLimit} Mbps`);
    };

    const removeAllLimits = () => {
        if (!selectedDeviceId) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setDeviceSpeedLimit(selectedDeviceId, config.maxDownloadSpeed, config.maxUploadSpeed);
        setDownloadLimit(config.maxDownloadSpeed);
        setUploadLimit(config.maxUploadSpeed);
    };

    const deviceTypeColors: Record<string, string> = {
        phone: theme.devicePhone,
        tablet: theme.deviceTablet,
        laptop: theme.deviceLaptop,
        desktop: theme.deviceDesktop,
        other: theme.deviceOther,
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Controls</Text>
                    <Text style={styles.subtitle}>Bandwidth Management</Text>
                </View>

                {/* Global Controls */}
                <Text style={styles.sectionTitle}>GLOBAL SETTINGS</Text>
                <GlassCard padding={14} style={{ marginBottom: 12 }}>
                    <View style={styles.globalRow}>
                        <View style={styles.globalInfo}>
                            <MaterialIcons name="wifi" size={18} color={theme.primary} />
                            <Text style={styles.globalLabel}>Band</Text>
                        </View>
                        <View style={styles.bandToggle}>
                            {(['2.4GHz', '5GHz'] as const).map(band => (
                                <Pressable
                                    key={band}
                                    style={[
                                        styles.bandOption,
                                        hotspotConfig.band === band && styles.bandOptionActive,
                                    ]}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        updateHotspotConfig({ band });
                                    }}
                                >
                                    <Text style={[
                                        styles.bandOptionText,
                                        hotspotConfig.band === band && styles.bandOptionTextActive,
                                    ]}>
                                        {band}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                    <View style={styles.globalRow}>
                        <View style={styles.globalInfo}>
                            <MaterialIcons name="people" size={18} color={theme.primary} />
                            <Text style={styles.globalLabel}>Max Clients</Text>
                        </View>
                        <View style={styles.clientControl}>
                            <Pressable
                                style={styles.clientBtn}
                                onPress={() => {
                                    if (hotspotConfig.maxClients > 1) {
                                        Haptics.selectionAsync();
                                        updateHotspotConfig({ maxClients: hotspotConfig.maxClients - 1 });
                                    }
                                }}
                            >
                                <MaterialIcons name="remove" size={16} color={theme.textPrimary} />
                            </Pressable>
                            <Text style={styles.clientValue}>{hotspotConfig.maxClients}</Text>
                            <Pressable
                                style={styles.clientBtn}
                                onPress={() => {
                                    if (hotspotConfig.maxClients < 20) {
                                        Haptics.selectionAsync();
                                        updateHotspotConfig({ maxClients: hotspotConfig.maxClients + 1 });
                                    }
                                }}
                            >
                                <MaterialIcons name="add" size={16} color={theme.textPrimary} />
                            </Pressable>
                        </View>
                    </View>
                </GlassCard>

                {/* Device Selector */}
                <Text style={styles.sectionTitle}>SELECT DEVICE</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
                    style={{ marginBottom: 16 }}
                >
                    {activeDevices.map(device => {
                        const isSelected = selectedDeviceId === device.id;
                        const typeColor = deviceTypeColors[device.deviceType] || theme.deviceOther;
                        return (
                            <Pressable
                                key={device.id}
                                onPress={() => {
                                    Haptics.selectionAsync();
                                    setSelectedDeviceId(device.id);
                                }}
                                style={[
                                    styles.deviceChip,
                                    isSelected && { backgroundColor: `${typeColor}20`, borderColor: `${typeColor}50` },
                                ]}
                            >
                                <MaterialIcons name={getDeviceIcon(device.deviceType) as any} size={16} color={isSelected ? typeColor : theme.textTertiary} />
                                <Text style={[styles.deviceChipName, isSelected && { color: theme.textPrimary }]} numberOfLines={1}>
                                    {device.name.split(' ').slice(0, 2).join(' ')}
                                </Text>
                                {device.status === 'limited' && (
                                    <View style={[styles.limitDot, { backgroundColor: theme.warning }]} />
                                )}
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* Selected device info + controls */}
                {selectedDevice ? (
                    <>
                        {/* Device Info Card */}
                        <GlassCard variant="elevated" padding={14} style={{ marginBottom: 14 }}>
                            <View style={styles.selectedDeviceHeader}>
                                <View style={[styles.selectedIcon, { backgroundColor: `${deviceTypeColors[selectedDevice.deviceType] || theme.deviceOther}20` }]}>
                                    <MaterialIcons
                                        name={getDeviceIcon(selectedDevice.deviceType) as any}
                                        size={24}
                                        color={deviceTypeColors[selectedDevice.deviceType] || theme.deviceOther}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.selectedName}>{selectedDevice.name}</Text>
                                    <Text style={styles.selectedIP}>{selectedDevice.ipAddress} • {selectedDevice.macAddress}</Text>
                                </View>
                                <StatusBadge label={selectedDevice.status} color={getStatusColor(selectedDevice.status)} />
                            </View>
                            <View style={styles.selectedStats}>
                                <View style={styles.selectedStatItem}>
                                    <Text style={styles.selectedStatLabel}>DOWNLOAD</Text>
                                    <Text style={styles.selectedStatValue}>{formatSpeed(selectedDevice.currentDownloadSpeed)}</Text>
                                </View>
                                <View style={styles.selectedStatItem}>
                                    <Text style={styles.selectedStatLabel}>UPLOAD</Text>
                                    <Text style={styles.selectedStatValue}>{formatSpeed(selectedDevice.currentUploadSpeed)}</Text>
                                </View>
                                <View style={styles.selectedStatItem}>
                                    <Text style={styles.selectedStatLabel}>TOTAL DATA</Text>
                                    <Text style={styles.selectedStatValue}>{formatBytes(selectedDevice.downloadUsageMB + selectedDevice.uploadUsageMB)}</Text>
                                </View>
                            </View>
                        </GlassCard>

                        {/* Bandwidth Sliders */}
                        <Text style={styles.sectionTitle}>SPEED LIMITS</Text>
                        <View style={{ gap: 10, marginBottom: 16 }}>
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

                        {/* Action buttons */}
                        <View style={styles.actionsContainer}>
                            <Pressable style={styles.applyBtn} onPress={applyLimits}>
                                <MaterialIcons name="check-circle" size={18} color="#000" />
                                <Text style={styles.applyBtnText}>Apply Limits</Text>
                            </Pressable>
                            <View style={styles.secondaryActions}>
                                <Pressable style={styles.throttleBtn} onPress={applyThrottle}>
                                    <MaterialIcons name="slow-motion-video" size={16} color={theme.warning} />
                                    <Text style={[styles.secondaryBtnText, { color: theme.warning }]}>Throttle</Text>
                                </Pressable>
                                <Pressable style={styles.removeBtn} onPress={removeAllLimits}>
                                    <MaterialIcons name="all-inclusive" size={16} color={theme.success} />
                                    <Text style={[styles.secondaryBtnText, { color: theme.success }]}>Unlimited</Text>
                                </Pressable>
                            </View>
                        </View>
                    </>
                ) : (
                    <GlassCard padding={32} style={{ alignItems: 'center' }}>
                        <MaterialIcons name="touch-app" size={48} color={theme.textTertiary} />
                        <Text style={styles.selectPrompt}>Select a device above to manage its bandwidth</Text>
                    </GlassCard>
                )}

                {/* Root Command Reference */}
                <Text style={styles.sectionTitle}>ROOT COMMANDS (REFERENCE)</Text>
                <GlassCard padding={14}>
                    <Text style={styles.commandTitle}>Bandwidth Limiting (tc)</Text>
                    <View style={styles.commandBlock}>
                        <Text style={styles.commandText}>
                            tc qdisc add dev wlan0 root handle 1: htb{'\n'}
                            tc class add dev wlan0 parent 1: classid 1:1 htb rate {downloadLimit}mbit{'\n'}
                            tc filter add dev wlan0 parent 1: protocol ip u32 match ip dst {selectedDevice?.ipAddress || '0.0.0.0'}/32 flowid 1:1
                        </Text>
                    </View>
                    <Text style={[styles.commandTitle, { marginTop: 12 }]}>Block Device (iptables)</Text>
                    <View style={styles.commandBlock}>
                        <Text style={styles.commandText}>
                            iptables -I FORWARD -m mac --mac-source {selectedDevice?.macAddress || 'XX:XX:XX:XX:XX:XX'} -j DROP
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
        marginTop: 8,
        marginBottom: 20,
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
    sectionTitle: {
        ...theme.typography.micro,
        color: theme.textTertiary,
        marginBottom: 10,
        marginTop: 4,
    },
    globalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    globalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    globalLabel: {
        color: theme.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    bandToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: theme.radius.sm,
        overflow: 'hidden',
    },
    bandOption: {
        paddingHorizontal: 14,
        paddingVertical: 7,
    },
    bandOptionActive: {
        backgroundColor: `${theme.primary}20`,
    },
    bandOptionText: {
        color: theme.textTertiary,
        fontSize: 13,
        fontWeight: '600',
    },
    bandOptionTextActive: {
        color: theme.primary,
    },
    clientControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clientBtn: {
        width: 32,
        height: 32,
        borderRadius: theme.radius.full,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clientValue: {
        color: theme.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        minWidth: 24,
        textAlign: 'center',
    },
    deviceChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: theme.radius.full,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: theme.border,
        gap: 6,
    },
    deviceChipName: {
        color: theme.textSecondary,
        fontSize: 13,
        fontWeight: '500',
        maxWidth: 120,
    },
    limitDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    selectedDeviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    selectedIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedName: {
        color: theme.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    selectedIP: {
        color: theme.textTertiary,
        fontSize: 11,
        fontFamily: 'monospace',
        marginTop: 2,
    },
    selectedStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: theme.radius.md,
        paddingVertical: 12,
    },
    selectedStatItem: {
        alignItems: 'center',
        gap: 3,
    },
    selectedStatLabel: {
        ...theme.typography.micro,
        color: theme.textTertiary,
        fontSize: 9,
    },
    selectedStatValue: {
        color: theme.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        gap: 10,
        marginBottom: 20,
    },
    applyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.primary,
        borderRadius: theme.radius.lg,
        paddingVertical: 15,
        gap: 8,
    },
    applyBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 10,
    },
    throttleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${theme.warning}12`,
        borderRadius: theme.radius.md,
        paddingVertical: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: `${theme.warning}30`,
    },
    removeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${theme.success}12`,
        borderRadius: theme.radius.md,
        paddingVertical: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: `${theme.success}30`,
    },
    secondaryBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    selectPrompt: {
        color: theme.textTertiary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
    },
    commandTitle: {
        color: theme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    commandBlock: {
        backgroundColor: 'rgba(0,229,204,0.06)',
        borderRadius: theme.radius.sm,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: theme.primary,
    },
    commandText: {
        color: theme.primary,
        fontSize: 11,
        fontFamily: 'monospace',
        lineHeight: 18,
    },
});
