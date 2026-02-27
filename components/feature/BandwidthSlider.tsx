// BandwidthSlider - Speed limit control for devices

import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

interface BandwidthSliderProps {
    label: string;
    value: number; // Current Mbps limit
    maxValue: number;
    icon: string;
    iconColor: string;
    onValueChange: (newValue: number) => void;
}

const SPEED_STEPS = [1, 2, 3, 5, 10, 15, 25, 50, 75, 100];

export function BandwidthSlider({
    label,
    value,
    maxValue,
    icon,
    iconColor,
    onValueChange,
}: BandwidthSliderProps) {
    const filteredSteps = SPEED_STEPS.filter(s => s <= maxValue);
    const currentIndex = filteredSteps.findIndex(s => s >= value);
    const activeIndex = currentIndex === -1 ? filteredSteps.length - 1 : currentIndex;

    const decrease = () => {
        if (activeIndex > 0) {
            Haptics.selectionAsync();
            onValueChange(filteredSteps[activeIndex - 1]);
        }
    };

    const increase = () => {
        if (activeIndex < filteredSteps.length - 1) {
            Haptics.selectionAsync();
            onValueChange(filteredSteps[activeIndex + 1]);
        }
    };

    const percentage = maxValue > 0 ? (filteredSteps[activeIndex] / maxValue) * 100 : 0;

    return (
        <GlassCard padding={14}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <MaterialIcons name={icon as any} size={16} color={iconColor} />
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={[styles.valueText, { color: iconColor }]}>
                    {filteredSteps[activeIndex]} Mbps
                </Text>
            </View>

            {/* Visual bar */}
            <View style={styles.barContainer}>
                <View style={styles.barTrack}>
                    <View
                        style={[
                            styles.barFill,
                            { width: `${percentage}%`, backgroundColor: iconColor },
                        ]}
                    />
                </View>
            </View>

            {/* Step indicators */}
            <View style={styles.stepsRow}>
                {filteredSteps.map((step, i) => (
                    <Pressable
                        key={step}
                        onPress={() => {
                            Haptics.selectionAsync();
                            onValueChange(step);
                        }}
                        style={[
                            styles.stepDot,
                            i <= activeIndex && { backgroundColor: iconColor },
                        ]}
                    />
                ))}
            </View>

            {/* Controls */}
            <View style={styles.controlsRow}>
                <Pressable
                    style={[styles.controlBtn, activeIndex === 0 && styles.controlBtnDisabled]}
                    onPress={decrease}
                    disabled={activeIndex === 0}
                >
                    <MaterialIcons name="remove" size={20} color={activeIndex === 0 ? theme.textTertiary : theme.textPrimary} />
                </Pressable>

                <View style={styles.speedDisplay}>
                    <Text style={styles.speedNumber}>{filteredSteps[activeIndex]}</Text>
                    <Text style={styles.speedUnit}>Mbps</Text>
                </View>

                <Pressable
                    style={[styles.controlBtn, activeIndex >= filteredSteps.length - 1 && styles.controlBtnDisabled]}
                    onPress={increase}
                    disabled={activeIndex >= filteredSteps.length - 1}
                >
                    <MaterialIcons name="add" size={20} color={activeIndex >= filteredSteps.length - 1 ? theme.textTertiary : theme.textPrimary} />
                </Pressable>
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    label: {
        color: theme.textSecondary,
        fontSize: 13,
        fontWeight: '600',
    },
    valueText: {
        fontSize: 14,
        fontWeight: '700',
    },
    barContainer: {
        marginBottom: 8,
    },
    barTrack: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 3,
    },
    stepsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        marginBottom: 12,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    controlBtn: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.full,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlBtnDisabled: {
        opacity: 0.4,
    },
    speedDisplay: {
        alignItems: 'center',
    },
    speedNumber: {
        color: theme.textPrimary,
        fontSize: 28,
        fontWeight: '700',
    },
    speedUnit: {
        color: theme.textTertiary,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
