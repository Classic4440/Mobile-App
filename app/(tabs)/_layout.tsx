// Tab Layout - HotspotManager
// 4 tabs: Dashboard, Devices, Controls, Vouchers

import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { useAnimationSettings } from '../../hooks/useAnimationSettings';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { accentColor, backgroundColor } = useApp();
  const animationSettings = useAnimationSettings();

  // Calculate extra bottom padding for Android devices with navigation buttons
  const bottomPadding = Platform.select({
    ios: insets.bottom + 60,
    android: 70 + insets.bottom,
    default: 70,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Fast tab transitions based on animation settings
        animation: animationSettings.enabled ? 'shift' : 'none',
        // Prevent white flash with dark background
        sceneStyle: {
          backgroundColor,
        },
        tabBarStyle: {
          height: bottomPadding,
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: insets.bottom + 8,
            android: 12 + insets.bottom,
            default: 8,
          }),
          backgroundColor: 'rgba(5, 5, 8, 0.95)',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 20,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.35)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <MaterialIcons 
                name="dashboard" 
                size={size} 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <MaterialIcons 
                name="devices" 
                size={size} 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="controls"
        options={{
          title: 'Controls',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <MaterialIcons 
                name="tune" 
                size={size} 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vouchers"
        options={{
          title: 'Vouchers',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : undefined}>
              <MaterialIcons 
                name="confirmation-number" 
                size={size} 
                color={color}
                style={focused ? styles.activeIcon : undefined}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  activeIcon: {
    textShadowColor: 'rgba(0, 255, 200, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
