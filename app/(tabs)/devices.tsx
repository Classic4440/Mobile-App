// Devices Screen - Lists all connected, blocked, and limited devices
// Each device shows MAC, IP, usage stats, signal, and quick actions (kick/block/unblock)

import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DeviceCard } from '../../components/feature/DeviceCard';
import { theme } from '../../constants/theme';
import { useApp } from '../../contexts/AppContext';

type FilterType = 'all' | 'connected' | 'limited' | 'blocked';

const filters: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: theme.textPrimary },
    { id: 'connected', label: 'Connected', color: theme.success },
    { id: 'limited', label: 'Limited', color: theme.warning },
    { id: 'blocked', label: 'Blocked', color: theme.error },
];

export default function DevicesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { devices, kickDevice, blockDevice, unblockDevice } = useApp();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filteredDevices = useMemo(() => {
        if (activeFilter === 'all') return devices;
        return devices.filter(d => d.status === activeFilter);
    }, [devices, activeFilter]);

    const handleKick = (deviceId: string, deviceName: string) => {
        Alert.alert(
            'Kick Device',
            `Remove "${deviceName}" from the network? They can reconnect.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Kick',
                    style: 'destructive',
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        kickDevice(deviceId);
                    },
                },
            ]
        );
    };

    const handleBlock = (deviceId: string, deviceName: string) => {
        Alert.alert(
            'Block Device',
            `Block "${deviceName}" from accessing the network? This will persist until unblocked.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Block',
                    style: 'destructive',
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        blockDevice(deviceId);
                    },
                },
            ]
        );
    };

    const handleUnblock = (deviceId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        unblockDevice(deviceId);
    };

    const handleDevicePress = (deviceId: string) => {
        router.push({ pathname: '/device-detail', params: { id: deviceId } });
    };

    const filterCounts: Record<FilterType, number> = {
        all: devices.length,
        connected: devices.filter(d => d.status === 'connected').length,
        limited: devices.filter(d => d.status === 'limited').length,
        blocked: devices.filter(d => d.status === 'blocked').length,
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Devices</Text>
                <Text style={styles.count}>{devices.length} total</Text>
            </View>

            {/* Filter chips */}
            <View style={styles.filterRow}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                >
                    {filters.map(filter => {
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
                                    isActive && { backgroundColor: `${filter.color}20`, borderColor: `${filter.color}40` },
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    { color: isActive ? filter.color : theme.textTertiary },
                                ]}>
                                    {filter.label}
                                </Text>
                                <View style={[
                                    styles.filterCount,
                                    { backgroundColor: isActive ? `${filter.color}30` : 'rgba(255,255,255,0.06)' },
                                ]}>
                                    <Text style={[
                                        styles.filterCountText,
                                        { color: isActive ? filter.color : theme.textTertiary },
                                    ]}>
                                        {filterCounts[filter.id]}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Device list */}
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                <FlashList
                    data={filteredDevices}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <DeviceCard
                            device={item}
                            onPress={() => handleDevicePress(item.id)}
                            onKick={() => handleKick(item.id, item.name)}
                            onBlock={() => handleBlock(item.id, item.name)}
                            onUnblock={() => handleUnblock(item.id)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <MaterialIcons name="devices-other" size={48} color={theme.textTertiary} />
                            <Text style={styles.emptyTitle}>No Devices</Text>
                            <Text style={styles.emptyText}>
                                No {activeFilter !== 'all' ? activeFilter : ''} devices found
                            </Text>
                        </View>
                    }
                />
            </View>
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
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
    },
    title: {
        ...theme.typography.title,
        color: theme.textPrimary,
    },
    count: {
        color: theme.textTertiary,
        fontSize: 14,
        fontWeight: '500',
    },
    filterRow: {
        marginBottom: 14,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: theme.radius.full,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: theme.border,
        gap: 6,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
    },
    filterCount: {
        borderRadius: theme.radius.full,
        paddingHorizontal: 7,
        paddingVertical: 1,
    },
    filterCountText: {
        fontSize: 11,
        fontWeight: '700',
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
});
