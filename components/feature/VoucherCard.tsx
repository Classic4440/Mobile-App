// VoucherCard - Voucher display with code, status, usage info, and actions

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import {
    Voucher,
    formatBytes,
    formatTimeAgo,
    getVoucherStatusColor,
} from '../../services/mockData';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from '../ui/StatusBadge';

interface VoucherCardProps {
    voucher: Voucher;
    onRevoke?: () => void;
    onDelete?: () => void;
    onCopyCode?: () => void;
}

export function VoucherCard({ voucher, onRevoke, onDelete, onCopyCode }: VoucherCardProps) {
    const statusColor = getVoucherStatusColor(voucher.status);
    const dataPercentage = voucher.dataLimitMB > 0
        ? Math.min((voucher.dataUsedMB / voucher.dataLimitMB) * 100, 100)
        : 0;
    const isExpired = voucher.status === 'expired' || voucher.status === 'revoked';
    const isActive = voucher.status === 'active';

    const remainingTime = () => {
        const expires = new Date(voucher.expiresAt).getTime();
        const now = Date.now();
        const diff = expires - now;
        if (diff <= 0) return 'Expired';
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    return (
        <GlassCard variant={isExpired ? 'default' : 'elevated'} padding={14} style={isExpired ? styles.expired : undefined}>
            {/* Top: Code + Status */}
            <View style={styles.topRow}>
                <Pressable onPress={onCopyCode} style={styles.codeBlock}>
                    <Text style={styles.codeText}>{voucher.code}</Text>
                    <MaterialIcons name="content-copy" size={14} color={theme.textTertiary} />
                </Pressable>
                <StatusBadge label={voucher.status} color={statusColor} />
            </View>

            {/* Note */}
            {voucher.note && (
                <Text style={styles.note} numberOfLines={1}>{voucher.note}</Text>
            )}

            {/* Data usage bar */}
            <View style={styles.dataSection}>
                <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Data Usage</Text>
                    <Text style={styles.dataValue}>
                        {formatBytes(voucher.dataUsedMB)} / {formatBytes(voucher.dataLimitMB)}
                    </Text>
                </View>
                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${dataPercentage}%`,
                                backgroundColor: dataPercentage > 90 ? theme.error : dataPercentage > 70 ? theme.warning : theme.primary,
                            },
                        ]}
                    />
                </View>
            </View>

            {/* Info grid */}
            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <MaterialIcons name="schedule" size={14} color={theme.textTertiary} />
                    <Text style={styles.infoText}>{voucher.durationHours}h duration</Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialIcons name="devices" size={14} color={theme.textTertiary} />
                    <Text style={styles.infoText}>
                        {voucher.currentDevices}/{voucher.maxDevices} devices
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialIcons name="timer" size={14} color={isActive ? theme.primary : theme.textTertiary} />
                    <Text style={[styles.infoText, isActive && { color: theme.primary }]}>
                        {remainingTime()}
                    </Text>
                </View>
                <View style={styles.infoItem}>
                    <MaterialIcons name="event" size={14} color={theme.textTertiary} />
                    <Text style={styles.infoText}>Created {formatTimeAgo(voucher.createdAt)}</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
                {isActive && (
                    <Pressable style={[styles.actionBtn, { backgroundColor: `${theme.error}15` }]} onPress={onRevoke}>
                        <MaterialIcons name="cancel" size={14} color={theme.error} />
                        <Text style={[styles.actionText, { color: theme.error }]}>Revoke</Text>
                    </Pressable>
                )}
                {(isExpired || voucher.status === 'unused') && (
                    <Pressable style={[styles.actionBtn, { backgroundColor: `${theme.error}15` }]} onPress={onDelete}>
                        <MaterialIcons name="delete-outline" size={14} color={theme.error} />
                        <Text style={[styles.actionText, { color: theme.error }]}>Delete</Text>
                    </Pressable>
                )}
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    expired: {
        opacity: 0.6,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    codeBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: theme.radius.sm,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 6,
    },
    codeText: {
        color: theme.primary,
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'monospace',
        letterSpacing: 1.5,
    },
    note: {
        color: theme.textSecondary,
        fontSize: 13,
        marginBottom: 10,
    },
    dataSection: {
        marginBottom: 12,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    dataLabel: {
        ...theme.typography.micro,
        color: theme.textTertiary,
        fontSize: 10,
    },
    dataValue: {
        color: theme.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    progressTrack: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        width: '47%',
    },
    infoText: {
        color: theme.textSecondary,
        fontSize: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: theme.radius.sm,
        gap: 5,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
