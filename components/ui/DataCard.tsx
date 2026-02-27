// DataCard - Stat display card with icon, value, label

import { GlassCard } from './GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface DataCardProps {
    icon: string;
    iconColor?: string;
    value: string;
    label: string;
    subtitle?: string;
    compact?: boolean;
}

export function DataCard({ icon, iconColor = theme.primary, value, label, subtitle, compact = false }: DataCardProps) {
    return (
        <GlassCard style={styles.card} padding={compact ? 12 : 16}>
            <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                <MaterialIcons name={icon as any} size={compact ? 18 : 22} color={iconColor} />
            </View>
            <Text style={[styles.value, compact && { fontSize: 22 }]} numberOfLines={1}>
                {value}
            </Text>
            <Text style={styles.label} numberOfLines={1}>
                {label}
            </Text>
            {subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                    {subtitle}
                </Text>
            )}
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 100,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    value: {
        ...theme.typography.stat,
        color: theme.textPrimary,
        marginBottom: 2,
    },
    label: {
        ...theme.typography.statLabel,
        color: theme.textSecondary,
    },
    subtitle: {
        fontSize: 12,
        color: theme.textTertiary,
        marginTop: 4,
    },
});
