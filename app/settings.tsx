// Settings Screen - Hidden settings accessible from dashboard title tap

import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View, Pressable, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '../components/ui/GlassCard';
import { useApp, UI_THEME_COLORS, ANIMATION_DURATIONS, CORNER_RADII, UISettings } from '../contexts/AppContext';
import { useAnimationSettings } from '../hooks/useAnimationSettings';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// UI Theme presets
const UI_THEMES = [
  { id: 'default', name: 'Default', accent: '#00E5CC', bg: '#000000' },
  { id: 'ocean', name: 'Ocean Blue', accent: '#3B82F6', bg: '#0A1628' },
  { id: 'forest', name: 'Forest', accent: '#22C55E', bg: '#0A1F0A' },
  { id: 'sunset', name: 'Sunset', accent: '#F97316', bg: '#1F0A0A' },
  { id: 'purple', name: 'Purple', accent: '#A855F7', bg: '#150A1F' },
  { id: 'minimal', name: 'Minimal', accent: '#FFFFFF', bg: '#0A0A0A' },
];

// Animation speed options
const ANIMATION_SPEEDS = [
  { id: 'slow', name: 'Slow', duration: 400 },
  { id: 'normal', name: 'Normal', duration: 250 },
  { id: 'fast', name: 'Fast', duration: 150 },
  { id: 'instant', name: 'Instant', duration: 0 },
];

// Corner radius options
const CORNER_STYLES = [
  { id: 'none', name: 'None', radius: 0 },
  { id: 'small', name: 'Small', radius: 8 },
  { id: 'medium', name: 'Medium', radius: 16 },
  { id: 'large', name: 'Large', radius: 24 },
  { id: 'full', name: 'Full', radius: 999 },
];

interface SettingsRowProps {
  icon: string;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingsRow({ icon, iconColor = '#00E5CC', label, value, onPress, rightElement }: SettingsRowProps) {
  const { accentColor } = useApp();
  const actualIconColor = iconColor === '#00E5CC' ? accentColor : iconColor;
  
  const content = (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: `${actualIconColor}15` }]}>
        <MaterialIcons name={icon as any} size={20} color={actualIconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      {rightElement || (onPress && <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.35)" />)}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress} style={styles.rowPressable}>{content}</Pressable>;
  }
  return content;
}

// UI Customization Modal
const UICustomizationModal = ({ 
  visible, 
  onClose,
  onSave 
}: { 
  visible: boolean; 
  onClose: () => void;
  onSave: (settings: Partial<UISettings>) => void;
}) => {
  const { uiSettings, accentColor } = useApp();
  const animationSettings = useAnimationSettings();
  
  const [selectedTheme, setSelectedTheme] = useState(uiSettings.theme);
  const [animationSpeed, setAnimationSpeed] = useState(uiSettings.animationSpeed);
  const [cornerStyle, setCornerStyle] = useState(uiSettings.cornerStyle);
  const [showAnimations, setShowAnimations] = useState(uiSettings.showAnimations);
  const [enableHaptics, setEnableHaptics] = useState(uiSettings.enableHaptics);
  const [reduceMotion, setReduceMotion] = useState(uiSettings.reduceMotion);

  const handleSave = () => {
    onSave({
      theme: selectedTheme,
      animationSpeed,
      cornerStyle,
      showAnimations,
      enableHaptics,
      reduceMotion,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.customizationSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>UI Customization</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" size={24} color="rgba(255,255,255,0.55)" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Theme Selection */}
            <Text style={styles.sectionLabel}>THEME PRESET</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeRow}>
              {UI_THEMES.map((t) => (
                <Pressable
                  key={t.id}
                  style={[
                    styles.themeOption,
                    selectedTheme === t.id && styles.themeOptionSelected,
                    { borderColor: t.accent }
                  ]}
                  onPress={() => {
                    if (animationSettings.hapticsEnabled) {
                      Haptics.selectionAsync();
                    }
                    setSelectedTheme(t.id);
                  }}
                >
                  <View style={[styles.themePreview, { backgroundColor: t.bg }]}>
                    <View style={[styles.themeAccent, { backgroundColor: t.accent }]} />
                  </View>
                  <Text style={[
                    styles.themeName, 
                    selectedTheme === t.id && styles.themeNameSelected
                  ]}>
                    {t.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Animation Speed */}
            <Text style={styles.sectionLabel}>ANIMATION SPEED</Text>
            <View style={styles.optionRow}>
              {ANIMATION_SPEEDS.map((speed) => (
                <Pressable
                  key={speed.id}
                  style={[
                    styles.optionChip,
                    animationSpeed === speed.id && { backgroundColor: accentColor, borderColor: accentColor },
                  ]}
                  onPress={() => {
                    if (animationSettings.hapticsEnabled) {
                      Haptics.selectionAsync();
                    }
                    setAnimationSpeed(speed.id);
                  }}
                >
                  <Text style={[
                    styles.optionChipText,
                    animationSpeed === speed.id && { color: '#000' },
                  ]}>
                    {speed.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Corner Style */}
            <Text style={styles.sectionLabel}>CORNER STYLE</Text>
            <View style={styles.optionRow}>
              {CORNER_STYLES.map((style) => (
                <Pressable
                  key={style.id}
                  style={[
                    styles.optionChip,
                    cornerStyle === style.id && { backgroundColor: accentColor, borderColor: accentColor },
                  ]}
                  onPress={() => {
                    if (animationSettings.hapticsEnabled) {
                      Haptics.selectionAsync();
                    }
                    setCornerStyle(style.id);
                  }}
                >
                  <Text style={[
                    styles.optionChipText,
                    cornerStyle === style.id && { color: '#000' },
                  ]}>
                    {style.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Toggles */}
            <View style={styles.toggleSection}>
              <SettingsRow
                icon="animation"
                label="Show Animations"
                rightElement={
                  <Switch
                    value={showAnimations}
                    onValueChange={setShowAnimations}
                    trackColor={{ false: '#333', true: `${accentColor}60` }}
                    thumbColor={showAnimations ? accentColor : '#666'}
                  />
                }
              />
              <SettingsRow
                icon="vibration"
                label="Haptic Feedback"
                rightElement={
                  <Switch
                    value={enableHaptics}
                    onValueChange={setEnableHaptics}
                    trackColor={{ false: '#333', true: `${accentColor}60` }}
                    thumbColor={enableHaptics ? accentColor : '#666'}
                  />
                }
              />
              <SettingsRow
                icon="motion-photos-off"
                label="Reduce Motion"
                rightElement={
                  <Switch
                    value={reduceMotion}
                    onValueChange={setReduceMotion}
                    trackColor={{ false: '#333', true: `${accentColor}60` }}
                    thumbColor={reduceMotion ? accentColor : '#666'}
                  />
                }
              />
            </View>
          </ScrollView>

          <Pressable 
            style={[styles.saveButton, { backgroundColor: accentColor }]} 
            onPress={handleSave}
          >
            <MaterialIcons name="check" size={20} color="#000" />
            <Text style={styles.saveButtonText}>Apply Changes</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { 
    hotspotConfig, 
    updateHotspotConfig, 
    devices, 
    vouchers, 
    networkStats, 
    setDevices, 
    setVouchers, 
    setHotspotConfig, 
    setNetworkStats,
    uiSettings,
    updateUISettings,
    accentColor,
  } = useApp();
  
  const animationSettings = useAnimationSettings();
  
  // UI Customization state
  const [showUICustomization, setShowUICustomization] = useState(false);

  // Local state for editable fields
  const [ssid, setSsid] = useState(hotspotConfig.ssid);
  const [password, setPassword] = useState(hotspotConfig.password);
  const [maxClients, setMaxClients] = useState(String(hotspotConfig.maxClients));
  const [editingSsid, setEditingSsid] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingMaxClients, setEditingMaxClients] = useState(false);
  
  // Settings state
  const [autoResetDaily, setAutoResetDaily] = useState(true);
  const [keepHistoryDays, setKeepHistoryDays] = useState(30);
  const [developerMode, setDeveloperMode] = useState(hotspotConfig.isRooted);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Validation errors
  const [ssidError, setSsidError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateSsid = (value: string): boolean => {
    if (!value || value.trim().length === 0) {
      setSsidError('SSID cannot be empty');
      return false;
    }
    if (value.length > 32) {
      setSsidError('SSID must be 32 characters or less');
      return false;
    }
    setSsidError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value || value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (value.length > 63) {
      setPasswordError('Password must be 63 characters or less');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSaveSsid = () => {
    if (!validateSsid(ssid)) return;
    updateHotspotConfig({ ssid: ssid.trim() });
    setEditingSsid(false);
  };

  const handleSavePassword = () => {
    if (!validatePassword(password)) return;
    updateHotspotConfig({ password });
    setEditingPassword(false);
  };

  const handleSaveMaxClients = () => {
    const clients = parseInt(maxClients);
    if (isNaN(clients) || clients < 1 || clients > 255) {
      Alert.alert('Invalid Value', 'Max clients must be between 1 and 255');
      return;
    }
    updateHotspotConfig({ maxClients: clients });
    setEditingMaxClients(false);
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will reset all data and settings. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'App has been reset. Please restart the app.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset app. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleExportData = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const exportData = {
        hotspotConfig,
        devices,
        vouchers,
        networkStats,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
      const jsonString = JSON.stringify(exportData, null, 2);
      await Clipboard.setStringAsync(jsonString);
      Alert.alert('Export Successful', 'Data copied to clipboard!');
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    Alert.prompt(
      'Import Data',
      'Paste your exported JSON data below:',
      async (importJsonString: string | undefined) => {
        if (!importJsonString || importJsonString.trim() === '') {
          return;
        }
        if (isImporting) return;
        setIsImporting(true);
        try {
          const importData = JSON.parse(importJsonString);
          if (!importData.hotspotConfig || !importData.devices || !importData.vouchers) {
            throw new Error('Invalid data format');
          }
          if (importData.hotspotConfig) {
            setHotspotConfig(importData.hotspotConfig);
          }
          if (importData.devices) {
            setDevices(importData.devices);
          }
          if (importData.vouchers) {
            setVouchers(importData.vouchers);
          }
          if (importData.networkStats) {
            setNetworkStats(importData.networkStats);
          }
          Alert.alert('Import Successful', 'Data has been imported successfully!');
        } catch (error) {
          Alert.alert('Import Failed', 'Invalid JSON data. Please check your input.');
        } finally {
          setIsImporting(false);
        }
      },
      'plain-text'
    );
  };

  const handleUISettingsSave = (settings: Partial<UISettings>) => {
    updateUISettings(settings);
    if (animationSettings.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert('Settings Applied', 'Your UI customization has been applied!');
  };

  // Get current theme
  const currentTheme = UI_THEMES.find(t => t.id === uiSettings.theme) || UI_THEMES[0];

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <LinearGradient
        colors={[accentColor + '20', '#000000']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Configure your hotspot</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance - UI Customization */}
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <GlassCard padding={0}>
          <SettingsRow
            icon="palette"
            iconColor={currentTheme.accent}
            label="UI Customization"
            value="Themes, animations, corners"
            onPress={() => {
              if (animationSettings.hapticsEnabled) {
                Haptics.selectionAsync();
              }
              setShowUICustomization(true);
            }}
            rightElement={
              <View style={[styles.themeBadge, { backgroundColor: `${currentTheme.accent}20` }]}>
                <View style={[styles.themeBadgeDot, { backgroundColor: currentTheme.accent }]} />
              </View>
            }
          />
        </GlassCard>

        {/* Network Settings */}
        <Text style={styles.sectionTitle}>NETWORK</Text>
        <GlassCard padding={0}>
          {editingSsid ? (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.editInput, ssidError ? styles.editInputError : null]}
                value={ssid}
                onChangeText={(text) => {
                  setSsid(text);
                  if (ssidError) setSsidError('');
                }}
                autoFocus
                placeholder="SSID (1-32 characters)"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
              <Pressable onPress={handleSaveSsid} style={styles.saveBtn}>
                <MaterialIcons name="check" size={20} color="#34D399" />
              </Pressable>
              <Pressable onPress={() => {
                setSsid(hotspotConfig.ssid);
                setEditingSsid(false);
                setSsidError('');
              }} style={styles.saveBtn}>
                <MaterialIcons name="close" size={20} color="#F87171" />
              </Pressable>
            </View>
          ) : (
            <SettingsRow
              icon="wifi"
              label="SSID"
              value={hotspotConfig.ssid}
              onPress={() => setEditingSsid(true)}
            />
          )}
          
          {editingPassword ? (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.editInput, passwordError ? styles.editInputError : null]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                autoFocus
                placeholder="Password (8-63 characters)"
                placeholderTextColor="rgba(255,255,255,0.35)"
                secureTextEntry
              />
              <Pressable onPress={handleSavePassword} style={styles.saveBtn}>
                <MaterialIcons name="check" size={20} color="#34D399" />
              </Pressable>
              <Pressable onPress={() => {
                setPassword(hotspotConfig.password);
                setEditingPassword(false);
                setPasswordError('');
              }} style={styles.saveBtn}>
                <MaterialIcons name="close" size={20} color="#F87171" />
              </Pressable>
            </View>
          ) : (
            <SettingsRow
              icon="lock"
              label="Password"
              value="••••••••"
              onPress={() => setEditingPassword(true)}
            />
          )}

          {editingMaxClients ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.editInput}
                value={maxClients}
                onChangeText={setMaxClients}
                autoFocus
                keyboardType="numeric"
                placeholder="Max Clients (1-255)"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
              <Pressable onPress={handleSaveMaxClients} style={styles.saveBtn}>
                <MaterialIcons name="check" size={20} color="#34D399" />
              </Pressable>
              <Pressable onPress={() => {
                setMaxClients(String(hotspotConfig.maxClients));
                setEditingMaxClients(false);
              }} style={styles.saveBtn}>
                <MaterialIcons name="close" size={20} color="#F87171" />
              </Pressable>
            </View>
          ) : (
            <SettingsRow
              icon="group"
              label="Max Clients"
              value={String(hotspotConfig.maxClients)}
              onPress={() => setEditingMaxClients(true)}
            />
          )}
          
          <SettingsRow
            icon="security"
            label="Security"
            value={hotspotConfig.securityType}
          />
        </GlassCard>

        {/* Band Settings */}
        <Text style={styles.sectionTitle}>BAND</Text>
        <GlassCard padding={0}>
          <SettingsRow
            icon="signal-cellular-alt"
            label="Current Band"
            value={hotspotConfig.band}
            rightElement={
              <View style={styles.bandToggle}>
                <Pressable
                  style={[
                    styles.bandOption,
                    hotspotConfig.band === '2.4GHz' && { backgroundColor: accentColor },
                  ]}
                  onPress={() => {
                    if (animationSettings.hapticsEnabled) {
                      Haptics.selectionAsync();
                    }
                    updateHotspotConfig({ band: '2.4GHz' });
                  }}
                >
                  <Text style={[
                    styles.bandOptionText,
                    hotspotConfig.band === '2.4GHz' && { color: '#000' },
                  ]}>2.4GHz</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.bandOption,
                    hotspotConfig.band === '5GHz' && { backgroundColor: accentColor },
                  ]}
                  onPress={() => {
                    if (animationSettings.hapticsEnabled) {
                      Haptics.selectionAsync();
                    }
                    updateHotspotConfig({ band: '5GHz' });
                  }}
                >
                  <Text style={[
                    styles.bandOptionText,
                    hotspotConfig.band === '5GHz' && { color: '#000' },
                  ]}>5GHz</Text>
                </Pressable>
              </View>
            }
          />
        </GlassCard>

        {/* Data & Usage */}
        <Text style={styles.sectionTitle}>DATA & USAGE</Text>
        <GlassCard padding={0}>
          <SettingsRow
            icon="data-usage"
            label="Auto Reset Daily"
            rightElement={
              <Switch
                value={autoResetDaily}
                onValueChange={(val) => {
                  setAutoResetDaily(val);
                  if (animationSettings.hapticsEnabled) {
                    Haptics.selectionAsync();
                  }
                }}
                trackColor={{ false: '#333', true: `${accentColor}60` }}
                thumbColor={accentColor}
              />
            }
          />
          <SettingsRow
            icon="history"
            label="Keep History"
            value={`${keepHistoryDays} days`}
            onPress={() => {
              if (animationSettings.hapticsEnabled) {
                Haptics.selectionAsync();
              }
              Alert.alert(
                'Keep History',
                'Select number of days to keep history:',
                [
                  { text: '7 days', onPress: () => setKeepHistoryDays(7) },
                  { text: '14 days', onPress: () => setKeepHistoryDays(14) },
                  { text: '30 days', onPress: () => setKeepHistoryDays(30) },
                  { text: '60 days', onPress: () => setKeepHistoryDays(60) },
                  { text: '90 days', onPress: () => setKeepHistoryDays(90) },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          />
        </GlassCard>

        {/* Advanced */}
        <Text style={styles.sectionTitle}>ADVANCED</Text>
        <GlassCard padding={0}>
          <SettingsRow
            icon="developer-mode"
            iconColor="#FBBF24"
            label="Developer Mode"
            rightElement={
              <Switch
                value={developerMode}
                onValueChange={(value) => {
                  if (animationSettings.hapticsEnabled) {
                    Haptics.selectionAsync();
                  }
                  setDeveloperMode(value);
                  updateHotspotConfig({ isRooted: value });
                }}
                trackColor={{ false: '#333', true: `${accentColor}60` }}
                thumbColor={accentColor}
              />
            }
          />
          <SettingsRow
            icon="terminal"
            iconColor="#F87171"
            label="Root Access"
            value={hotspotConfig.isRooted ? 'Enabled' : 'Disabled'}
          />
        </GlassCard>

        {/* Backup */}
        <Text style={styles.sectionTitle}>BACKUP & RESTORE</Text>
        <GlassCard padding={0}>
          <SettingsRow
            icon="upload"
            label={isExporting ? 'Exporting...' : 'Export Data'}
            onPress={isExporting ? undefined : () => {
              if (animationSettings.hapticsEnabled) {
                Haptics.selectionAsync();
              }
              handleExportData();
            }}
          />
          <SettingsRow
            icon="download"
            label={isImporting ? 'Importing...' : 'Import Data'}
            onPress={isImporting ? undefined : () => {
              if (animationSettings.hapticsEnabled) {
                Haptics.selectionAsync();
              }
              handleImportData();
            }}
          />
        </GlassCard>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>DANGER ZONE</Text>
        <GlassCard padding={0}>
          <SettingsRow
            icon="delete-forever"
            iconColor="#F87171"
            label="Reset App"
            onPress={() => {
              if (animationSettings.hapticsEnabled) {
                Haptics.selectionAsync();
              }
              handleResetApp();
            }}
          />
        </GlassCard>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>HotspotManager</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>

      {/* UI Customization Modal */}
      <UICustomizationModal
        visible={showUICustomization}
        onClose={() => setShowUICustomization(false)}
        onSave={handleUISettingsSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowPressable: {
    backgroundColor: 'transparent',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  rowValue: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  editInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 15,
  },
  editInputError: {
    borderWidth: 1,
    borderColor: '#F87171',
  },
  saveBtn: {
    padding: 8,
    marginLeft: 8,
  },
  themeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBadgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  bandToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 2,
  },
  bandOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bandOptionText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 20,
  },
  appName: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
  appVersion: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    marginTop: 4,
  },
  appCopyright: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  customizationSheet: {
    backgroundColor: '#121216',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.75,
    paddingBottom: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  themeRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  themeOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  themeOptionSelected: {
    borderWidth: 2,
  },
  themePreview: {
    width: 44,
    height: 44,
    borderRadius: 10,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeAccent: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  themeName: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    marginTop: 6,
  },
  themeNameSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionChipSelected: {
    // background set dynamically
  },
  optionChipText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '500',
  },
  optionChipTextSelected: {
    // color set dynamically
  },
  toggleSection: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
