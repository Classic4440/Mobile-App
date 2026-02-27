// Root Layout - HotspotManager
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from '../contexts/AppContext';
import { useAnimationSettings } from '../hooks/useAnimationSettings';
import { View, StyleSheet } from 'react-native';

function RootStackContent() {
  const { backgroundColor, accentColor } = useApp();
  const animationSettings = useAnimationSettings();
  
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
          // Use animation settings
          animation: animationSettings.enabled ? 'fade' : 'none',
          animationDuration: animationSettings.duration,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            animation: animationSettings.enabled ? 'slide_from_bottom' : 'none',
            gestureDirection: 'vertical',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="device-detail"
          options={{
            presentation: 'modal',
            animation: animationSettings.enabled ? 'slide_from_bottom' : 'none',
            gestureDirection: 'vertical',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="create-voucher"
          options={{
            presentation: 'modal',
            animation: animationSettings.enabled ? 'slide_from_bottom' : 'none',
            gestureDirection: 'vertical',
            gestureEnabled: true,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootStackContent />
    </AppProvider>
  );
}
