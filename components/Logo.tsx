// HotspotManager Logo
// Simple, reliable logo using pure React Native

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Main Logo Component - Full logo with text
export function HotspotLogo({ 
  size = 120, 
  showText = true, 
  accentColor = '#00E5CC',
}: LogoProps) {
  return (
    <View style={[containerStyles.wrapper, { width: size, height: showText ? size + 30 : size }]}>
      <View style={[containerStyles.logoBox, { 
        width: size, 
        height: size, 
        backgroundColor: '#0A0A0F',
        borderColor: accentColor,
        borderRadius: size / 5,
      }]}>
        {/* WiFi Symbol - using nested circles */}
        <View style={[containerStyles.wifiOuter, { 
          borderColor: accentColor,
          width: size * 0.6,
          height: size * 0.3,
          borderRadius: size * 0.3,
          opacity: 0.3,
        }]} />
        
        <View style={[containerStyles.wifiMiddle, { 
          borderColor: accentColor,
          width: size * 0.45,
          height: size * 0.225,
          borderRadius: size * 0.225,
          opacity: 0.5,
        }]} />
        
        <View style={[containerStyles.wifiInner, { 
          borderColor: accentColor,
          width: size * 0.3,
          height: size * 0.15,
          borderRadius: size * 0.15,
          opacity: 0.75,
        }]} />
        
        <View style={[containerStyles.wifiDot, { 
          backgroundColor: accentColor,
          width: size * 0.1,
          height: size * 0.1,
          borderRadius: size * 0.05,
        }]} />
        
        {/* Device dots */}
        <View style={[containerStyles.device1, { backgroundColor: '#3B82F6' }]} />
        <View style={[containerStyles.device2, { backgroundColor: '#8B5CF6' }]} />
        <View style={[containerStyles.device3, { backgroundColor: '#F59E0B' }]} />
      </View>
      
      {showText && (
        <View style={containerStyles.textBox}>
          <Text style={[containerStyles.title, { color: '#FFF', fontSize: size * 0.13 }]}>HOTSPOT</Text>
          <Text style={[containerStyles.subtitle, { color: accentColor, fontSize: size * 0.085 }]}>MANAGER</Text>
        </View>
      )}
    </View>
  );
}

// Simple WiFi Icon
export function HotspotIcon({ size = 24, color = '#00E5CC' }: IconProps) {
  return (
    <View style={[iconStyles.box, { width: size, height: size }]}>
      <View style={[iconStyles.arc1, { borderColor: color, width: size * 0.5, height: size * 0.25, borderRadius: size * 0.25 }]} />
      <View style={[iconStyles.arc2, { borderColor: color, width: size * 0.75, height: size * 0.375, borderRadius: size * 0.375 }]} />
      <View style={[iconStyles.dot, { backgroundColor: color, width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09 }]} />
    </View>
  );
}

// Devices Icon  
export function DevicesIcon({ size = 24, color = '#00E5CC' }: IconProps) {
  return (
    <View style={[iconStyles.box, { width: size, height: size, flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center' }]}>
      <View style={[iconStyles.devDot, { backgroundColor: color, opacity: 0.3, width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />
      <View style={[iconStyles.devDot, { backgroundColor: color, opacity: 0.5, width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />
      <View style={[iconStyles.devDot, { backgroundColor: color, opacity: 0.7, width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />
      <View style={[iconStyles.devDot, { backgroundColor: color, width: size * 0.25, height: size * 0.25, borderRadius: size * 0.125 }]} />
    </View>
  );
}

// Voucher Icon
export function VoucherIcon({ size = 24, color = '#00E5CC' }: IconProps) {
  return (
    <View style={[iconStyles.box, { width: size, height: size, justifyContent: 'center', alignItems: 'center' }]}>
      <View style={[iconStyles.ticket, { borderColor: color, width: size * 0.7, height: size * 0.5, borderRadius: size * 0.1, borderWidth: size * 0.08 }]}>
        <View style={[iconStyles.ticketDot, { backgroundColor: color, width: size * 0.15, height: size * 0.15, borderRadius: size * 0.075 }]} />
      </View>
    </View>
  );
}

// Shield Icon
export function ShieldIcon({ size = 24, color = '#00E5CC' }: IconProps) {
  return (
    <View style={[iconStyles.box, { width: size, height: size, justifyContent: 'center', alignItems: 'center' }]}>
      <View style={[iconStyles.shield, { backgroundColor: color, width: size * 0.5, height: size * 0.6, borderRadius: size * 0.1, opacity: 0.8 }]} />
    </View>
  );
}

// Types
interface LogoProps {
  size?: number;
  showText?: boolean;
  accentColor?: string;
  backgroundColor?: string;
}

interface IconProps {
  size?: number;
  color?: string;
}

// Styles
const containerStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wifiOuter: {
    position: 'absolute',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
    top: '20%',
  },
  wifiMiddle: {
    position: 'absolute',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
    top: '30%',
  },
  wifiInner: {
    position: 'absolute',
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
    top: '40%',
  },
  wifiDot: {
    position: 'absolute',
    bottom: '25%',
  },
  device1: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  device2: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  device3: {
    position: 'absolute',
    top: '30%',
    right: '20%',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textBox: {
    marginTop: 6,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    letterSpacing: 2,
  },
  subtitle: {
    fontWeight: '500',
    letterSpacing: 3,
    marginTop: 1,
  },
});

const iconStyles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arc1: {
    position: 'absolute',
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
    bottom: '15%',
    opacity: 0.4,
  },
  arc2: {
    position: 'absolute',
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
    bottom: '15%',
    opacity: 0.7,
  },
  dot: {
    position: 'absolute',
    bottom: '15%',
  },
  devDot: {
    margin: 3,
  },
  ticket: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketDot: {},
  shield: {},
});

export default HotspotLogo;
