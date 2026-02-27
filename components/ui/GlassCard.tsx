import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  padding?: number;
  variant?: 'default' | 'elevated';
  style?: ViewStyle;
}

export function GlassCard({
  children,
  padding = 16,
  variant = 'default',
  style,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.container,
        variant === 'elevated' && styles.elevated,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default GlassCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  elevated: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
});
