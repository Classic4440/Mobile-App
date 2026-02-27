// StatusBadge - Status indicator pill

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

interface StatusBadgeProps {
    label: string;
    color: string;
    size?: 'sm' | 'md';
}

export function StatusBadge({ label, color, size = 'sm' }: StatusBadgeProps) {
    const isSmall = size === 'sm';

    return (
        <View style={[
            styles.badge,
            {
                backgroundColor: `${color}20`,
                paddingHorizontal: isSmall ? 8 : 12,
                paddingVertical: isSmall ? 3 : 5,
            },
        ]}>
            <View style={[styles.dot, { backgroundColor: color, width: isSmall ? 6 : 8, height: isSmall ? 6 : 8 }]} />
            <Text style={[
                styles.label,
                { color, fontSize: isSmall ? 11 : 13 },
            ]}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.full,
        gap: 5,
    },
    dot: {
        borderRadius: theme.radius.full,
    },
    label: {
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
