// HotspotManager - Global State Management
// Manages devices, vouchers, hotspot config, and all CRUD operations

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ConnectedDevice,
  Voucher,
  HotspotConfig,
  NetworkStats,
  DeviceStatus,
  VoucherStatus,
  mockDevices,
  mockVouchers,
  mockHotspotConfig,
  mockNetworkStats,
  generateVoucherCode,
} from '../services/mockData';

// ============ UI SETTINGS TYPES ============

export interface UISettings {
  theme: string;
  animationSpeed: string;
  cornerStyle: string;
  showAnimations: boolean;
  enableHaptics: boolean;
  reduceMotion: boolean;
}

export const DEFAULT_UI_SETTINGS: UISettings = {
  theme: 'default',
  animationSpeed: 'normal',
  cornerStyle: 'medium',
  showAnimations: true,
  enableHaptics: true,
  reduceMotion: false,
};

// Theme accent colors
export const UI_THEME_COLORS: Record<string, { accent: string; bg: string }> = {
  default: { accent: '#00E5CC', bg: '#000000' },
  ocean: { accent: '#3B82F6', bg: '#0A1628' },
  forest: { accent: '#22C55E', bg: '#0A1F0A' },
  sunset: { accent: '#F97316', bg: '#1F0A0A' },
  purple: { accent: '#A855F7', bg: '#150A1F' },
  minimal: { accent: '#FFFFFF', bg: '#0A0A0A' },
};

// Animation durations in ms
export const ANIMATION_DURATIONS: Record<string, number> = {
  slow: 400,
  normal: 250,
  fast: 150,
  instant: 0,
};

// Corner radius values
export const CORNER_RADII: Record<string, number> = {
  none: 0,
  small: 8,
  medium: 16,
  large: 24,
  full: 999,
};

// ============ CONTEXT TYPES ============

interface AppContextType {
  // Data
  devices: ConnectedDevice[];
  vouchers: Voucher[];
  hotspotConfig: HotspotConfig;
  networkStats: NetworkStats;
  
  // UI Settings
  uiSettings: UISettings;
  updateUISettings: (settings: Partial<UISettings>) => void;
  resetUISettings: () => void;
  
  // Computed UI values
  accentColor: string;
  backgroundColor: string;
  animationDuration: number;
  cornerRadius: number;

  // Setter functions for import functionality
  setDevices: React.Dispatch<React.SetStateAction<ConnectedDevice[]>>;
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  setHotspotConfig: React.Dispatch<React.SetStateAction<HotspotConfig>>;
  setNetworkStats: React.Dispatch<React.SetStateAction<NetworkStats>>;

  // Device actions
  kickDevice: (deviceId: string) => void;
  blockDevice: (deviceId: string) => void;
  unblockDevice: (deviceId: string) => void;
  setDeviceSpeedLimit: (deviceId: string, downloadLimit: number, uploadLimit: number) => void;
  limitDevice: (deviceId: string, downloadLimit: number, uploadLimit: number) => void;

  // Voucher actions
  createVoucher: (params: CreateVoucherParams) => Voucher;
  revokeVoucher: (voucherId: string) => void;
  deleteVoucher: (voucherId: string) => void;

  // Hotspot actions
  toggleHotspot: () => void;
  updateHotspotConfig: (config: Partial<HotspotConfig>) => void;

  // Computed values
  activeDevices: ConnectedDevice[];
  blockedDevices: ConnectedDevice[];
  limitedDevices: ConnectedDevice[];
  activeVouchers: Voucher[];
  totalBandwidthUsage: { download: number; upload: number };
}

interface CreateVoucherParams {
  durationHours: number;
  dataLimitMB: number;
  maxDevices: number;
  note?: string;
}

// ============ CONTEXT ============

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  devices: 'hotspot_devices',
  vouchers: 'hotspot_vouchers',
  config: 'hotspot_config',
  stats: 'hotspot_stats',
  uiSettings: 'hotspot_ui_settings',
};

// ============ PROVIDER ============

export function AppProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<ConnectedDevice[]>(mockDevices);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [hotspotConfig, setHotspotConfig] = useState<HotspotConfig>(mockHotspotConfig);
  const [networkStats, setNetworkStats] = useState<NetworkStats>(mockNetworkStats);
  const [uiSettings, setUiSettings] = useState<UISettings>(DEFAULT_UI_SETTINGS);

  // Load persisted data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedDevices, storedVouchers, storedConfig, storedStats, storedUISettings] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.devices),
          AsyncStorage.getItem(STORAGE_KEYS.vouchers),
          AsyncStorage.getItem(STORAGE_KEYS.config),
          AsyncStorage.getItem(STORAGE_KEYS.stats),
          AsyncStorage.getItem(STORAGE_KEYS.uiSettings),
        ]);
        if (storedDevices) setDevices(JSON.parse(storedDevices));
        if (storedVouchers) setVouchers(JSON.parse(storedVouchers));
        if (storedConfig) setHotspotConfig(JSON.parse(storedConfig));
        if (storedStats) setNetworkStats(JSON.parse(storedStats));
        if (storedUISettings) setUiSettings({ ...DEFAULT_UI_SETTINGS, ...JSON.parse(storedUISettings) });
      } catch (e) {
        // Fallback to mock data (already set as default)
      }
    };
    loadData();
  }, []);

  // Persist data on changes
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(devices)); }, [devices]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.vouchers, JSON.stringify(vouchers)); }, [vouchers]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.config, JSON.stringify(hotspotConfig)); }, [hotspotConfig]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(networkStats)); }, [networkStats]);
  useEffect(() => { AsyncStorage.setItem(STORAGE_KEYS.uiSettings, JSON.stringify(uiSettings)); }, [uiSettings]);

  // UI Settings actions
  const updateUISettings = useCallback((settings: Partial<UISettings>) => {
    setUiSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const resetUISettings = useCallback(() => {
    setUiSettings(DEFAULT_UI_SETTINGS);
  }, []);

  // Computed UI values
  const themeColors = UI_THEME_COLORS[uiSettings.theme] || UI_THEME_COLORS.default;
  const accentColor = themeColors.accent;
  const backgroundColor = themeColors.bg;
  const animationDuration = uiSettings.reduceMotion ? 0 : (ANIMATION_DURATIONS[uiSettings.animationSpeed] || 250);
  const cornerRadius = CORNER_RADII[uiSettings.cornerStyle] || 16;

  // ============ DEVICE ACTIONS ============

  const kickDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setNetworkStats(prev => ({
      ...prev,
      totalConnectionsToday: prev.totalConnectionsToday - 1,
    }));
  }, []);

  const blockDevice = useCallback((deviceId: string) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === deviceId
          ? { ...d, status: 'blocked' as DeviceStatus, currentDownloadSpeed: 0, currentUploadSpeed: 0, signalStrength: 0 }
          : d
      )
    );
    setNetworkStats(prev => ({
      ...prev,
      blockedAttempts: prev.blockedAttempts + 1,
    }));
  }, []);

  const unblockDevice = useCallback((deviceId: string) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              status: 'connected' as DeviceStatus,
              currentDownloadSpeed: d.maxDownloadSpeed * 0.4,
              currentUploadSpeed: d.maxUploadSpeed * 0.4,
              signalStrength: 50 + Math.floor(Math.random() * 40),
            }
          : d
      )
    );
  }, []);

  const setDeviceSpeedLimit = useCallback((deviceId: string, downloadLimit: number, uploadLimit: number) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              maxDownloadSpeed: downloadLimit,
              maxUploadSpeed: uploadLimit,
              currentDownloadSpeed: Math.min(d.currentDownloadSpeed, downloadLimit),
              currentUploadSpeed: Math.min(d.currentUploadSpeed, uploadLimit),
            }
          : d
      )
    );
  }, []);

  const limitDevice = useCallback((deviceId: string, downloadLimit: number, uploadLimit: number) => {
    setDevices(prev =>
      prev.map(d =>
        d.id === deviceId
          ? {
              ...d,
              status: 'limited' as DeviceStatus,
              maxDownloadSpeed: downloadLimit,
              maxUploadSpeed: uploadLimit,
              currentDownloadSpeed: Math.min(d.currentDownloadSpeed, downloadLimit),
              currentUploadSpeed: Math.min(d.currentUploadSpeed, uploadLimit),
            }
          : d
      )
    );
  }, []);

  // ============ VOUCHER ACTIONS ============

  const createVoucher = useCallback((params: CreateVoucherParams): Voucher => {
    const now = new Date();
    const newVoucher: Voucher = {
      id: `voucher-${Date.now()}`,
      code: generateVoucherCode(),
      durationHours: params.durationHours,
      dataLimitMB: params.dataLimitMB,
      maxDevices: params.maxDevices,
      currentDevices: 0,
      dataUsedMB: 0,
      status: 'unused',
      usedBy: [],
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + params.durationHours * 3600000).toISOString(),
      note: params.note,
    };
    setVouchers(prev => [newVoucher, ...prev]);
    return newVoucher;
  }, []);

  const revokeVoucher = useCallback((voucherId: string) => {
    setVouchers(prev =>
      prev.map(v =>
        v.id === voucherId ? { ...v, status: 'revoked' as VoucherStatus } : v
      )
    );
  }, []);

  const deleteVoucher = useCallback((voucherId: string) => {
    setVouchers(prev => prev.filter(v => v.id !== voucherId));
  }, []);

  // ============ HOTSPOT ACTIONS ============

  const toggleHotspot = useCallback(() => {
    setHotspotConfig(prev => ({ ...prev, isActive: !prev.isActive }));
    // If turning off, reset all device speeds to 0
    setDevices(prev =>
      prev.map(d => ({
        ...d,
        currentDownloadSpeed: hotspotConfig.isActive ? 0 : d.maxDownloadSpeed * 0.5,
        currentUploadSpeed: hotspotConfig.isActive ? 0 : d.maxUploadSpeed * 0.5,
      }))
    );
  }, [hotspotConfig.isActive]);

  const updateHotspotConfig = useCallback((config: Partial<HotspotConfig>) => {
    setHotspotConfig(prev => ({ ...prev, ...config }));
  }, []);

  // ============ COMPUTED VALUES ============

  const activeDevices = devices.filter(d => d.status === 'connected');
  const blockedDevices = devices.filter(d => d.status === 'blocked');
  const limitedDevices = devices.filter(d => d.status === 'limited');
  const activeVouchers = vouchers.filter(v => v.status === 'active');
  const totalBandwidthUsage = {
    download: devices.reduce((sum, d) => sum + d.currentDownloadSpeed, 0),
    upload: devices.reduce((sum, d) => sum + d.currentUploadSpeed, 0),
  };

  // ============ CONTEXT VALUE ============

  const value: AppContextType = {
    devices,
    vouchers,
    hotspotConfig,
    networkStats,
    uiSettings,
    updateUISettings,
    resetUISettings,
    accentColor,
    backgroundColor,
    animationDuration,
    cornerRadius,
    setDevices,
    setVouchers,
    setHotspotConfig,
    setNetworkStats,
    kickDevice,
    blockDevice,
    unblockDevice,
    setDeviceSpeedLimit,
    limitDevice,
    createVoucher,
    revokeVoucher,
    deleteVoucher,
    toggleHotspot,
    updateHotspotConfig,
    activeDevices,
    blockedDevices,
    limitedDevices,
    activeVouchers,
    totalBandwidthUsage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============ HOOK ============

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
