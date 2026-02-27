// ProgressRing - Circular progress visualization with SVG

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface ProgressRingProps {
    progress: number; // 0-1
    size?: number;
    strokeWidth?: number;
    color?: string;
    trackColor?: string;
    children?: React.ReactNode;
}

export function ProgressRing({
    progress,
    size = 200,
    strokeWidth = 8,
    color = theme.primary,
    trackColor = 'rgba(255,255,255,0.08)',
    children,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const strokeDashoffset = circumference - clampedProgress * circumference;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                {/* Track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            {children && (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {children}
                </View>
            )}
        </View>
    );
}
