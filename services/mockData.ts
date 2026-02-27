// HotspotManager - Types & Mock Data Service

// ============ TYPE DEFINITIONS ============

export type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'other';
export type DeviceStatus = 'connected' | 'blocked' | 'limited';
export type VoucherStatus = 'active' | 'expired' | 'unused' | 'revoked';
export type BandType = '2.4GHz' | '5GHz';

export interface ConnectedDevice {
    id: string;
    name: string;
    hostname: string;
    macAddress: string;
    ipAddress: string;
    deviceType: DeviceType;
    status: DeviceStatus;
    downloadUsageMB: number;
    uploadUsageMB: number;
    currentDownloadSpeed: number; // Mbps
    currentUploadSpeed: number; // Mbps
    maxDownloadSpeed: number; // Mbps limit
    maxUploadSpeed: number; // Mbps limit
    signalStrength: number; // 0-100
    connectedAt: string; // ISO date
    lastActivity: string; // ISO date
    voucherId?: string;
}

export interface Voucher {
    id: string;
    code: string;
    durationHours: number;
    dataLimitMB: number;
    maxDevices: number;
    currentDevices: number;
    dataUsedMB: number;
    status: VoucherStatus;
    usedBy: string[];
    createdAt: string;
    expiresAt: string;
    note?: string;
}

export interface HotspotConfig {
    isActive: boolean;
    ssid: string;
    password: string;
    band: BandType;
    maxClients: number;
    isRooted: boolean;
    gatewayIP: string;
    securityType: 'WPA2' | 'WPA3' | 'Open';
}

export interface NetworkStats {
    totalDownloadMB: number;
    totalUploadMB: number;
    peakDownloadSpeed: number;
    peakUploadSpeed: number;
    uptimeMinutes: number;
    totalConnectionsToday: number;
    blockedAttempts: number;
}

export interface UsageHistoryPoint {
    hour: string;
    downloadMB: number;
    uploadMB: number;
}

// ============ MOCK DATA ============

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursFromNow = (h: number) => new Date(now.getTime() + h * 3600000).toISOString();

export const mockDevices: ConnectedDevice[] = [
    {
        id: 'dev-001',
        name: 'Samsung Galaxy S24',
        hostname: 'galaxy-s24',
        macAddress: 'A4:B1:C2:D3:E4:F5',
        ipAddress: '192.168.43.101',
        deviceType: 'phone',
        status: 'connected',
        downloadUsageMB: 2340,
        uploadUsageMB: 456,
        currentDownloadSpeed: 24.5,
        currentUploadSpeed: 8.2,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 92,
        connectedAt: hoursAgo(3.5),
        lastActivity: minutesAgo(1),
    },
    {
        id: 'dev-002',
        name: 'iPhone 15 Pro',
        hostname: 'iphone-15pro',
        macAddress: 'B6:C7:D8:E9:F0:A1',
        ipAddress: '192.168.43.102',
        deviceType: 'phone',
        status: 'connected',
        downloadUsageMB: 1820,
        uploadUsageMB: 310,
        currentDownloadSpeed: 18.3,
        currentUploadSpeed: 5.7,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 78,
        connectedAt: hoursAgo(2),
        lastActivity: minutesAgo(3),
        voucherId: 'voucher-001',
    },
    {
        id: 'dev-003',
        name: 'MacBook Pro 14"',
        hostname: 'macbook-pro',
        macAddress: 'C8:D9:E0:F1:A2:B3',
        ipAddress: '192.168.43.103',
        deviceType: 'laptop',
        status: 'connected',
        downloadUsageMB: 5670,
        uploadUsageMB: 1230,
        currentDownloadSpeed: 45.8,
        currentUploadSpeed: 15.4,
        maxDownloadSpeed: 100,
        maxUploadSpeed: 50,
        signalStrength: 85,
        connectedAt: hoursAgo(6),
        lastActivity: minutesAgo(0),
    },
    {
        id: 'dev-004',
        name: 'iPad Air',
        hostname: 'ipad-air',
        macAddress: 'D0:E1:F2:A3:B4:C5',
        ipAddress: '192.168.43.104',
        deviceType: 'tablet',
        status: 'limited',
        downloadUsageMB: 890,
        uploadUsageMB: 120,
        currentDownloadSpeed: 8.1,
        currentUploadSpeed: 2.3,
        maxDownloadSpeed: 10,
        maxUploadSpeed: 5,
        signalStrength: 65,
        connectedAt: hoursAgo(1.5),
        lastActivity: minutesAgo(8),
        voucherId: 'voucher-002',
    },
    {
        id: 'dev-005',
        name: 'Dell XPS 15',
        hostname: 'dell-xps',
        macAddress: 'E2:F3:A4:B5:C6:D7',
        ipAddress: '192.168.43.105',
        deviceType: 'laptop',
        status: 'connected',
        downloadUsageMB: 3450,
        uploadUsageMB: 780,
        currentDownloadSpeed: 32.6,
        currentUploadSpeed: 12.1,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 71,
        connectedAt: hoursAgo(4),
        lastActivity: minutesAgo(2),
    },
    {
        id: 'dev-006',
        name: 'Pixel 8 Pro',
        hostname: 'pixel-8pro',
        macAddress: 'F4:A5:B6:C7:D8:E9',
        ipAddress: '192.168.43.106',
        deviceType: 'phone',
        status: 'blocked',
        downloadUsageMB: 4520,
        uploadUsageMB: 890,
        currentDownloadSpeed: 0,
        currentUploadSpeed: 0,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 0,
        connectedAt: hoursAgo(8),
        lastActivity: hoursAgo(1),
    },
    {
        id: 'dev-007',
        name: 'Samsung Galaxy Tab S9',
        hostname: 'galaxy-tab-s9',
        macAddress: 'A1:B2:C3:D4:E5:F6',
        ipAddress: '192.168.43.107',
        deviceType: 'tablet',
        status: 'connected',
        downloadUsageMB: 670,
        uploadUsageMB: 95,
        currentDownloadSpeed: 15.2,
        currentUploadSpeed: 4.8,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 58,
        connectedAt: hoursAgo(0.5),
        lastActivity: minutesAgo(5),
    },
    {
        id: 'dev-008',
        name: 'Windows Desktop',
        hostname: 'win-desktop',
        macAddress: 'B3:C4:D5:E6:F7:A8',
        ipAddress: '192.168.43.108',
        deviceType: 'desktop',
        status: 'connected',
        downloadUsageMB: 8920,
        uploadUsageMB: 2340,
        currentDownloadSpeed: 55.3,
        currentUploadSpeed: 22.7,
        maxDownloadSpeed: 100,
        maxUploadSpeed: 50,
        signalStrength: 45,
        connectedAt: hoursAgo(12),
        lastActivity: minutesAgo(0),
    },
    {
        id: 'dev-009',
        name: 'OnePlus 12',
        hostname: 'oneplus-12',
        macAddress: 'C5:D6:E7:F8:A9:B0',
        ipAddress: '192.168.43.109',
        deviceType: 'phone',
        status: 'limited',
        downloadUsageMB: 1230,
        uploadUsageMB: 340,
        currentDownloadSpeed: 5.0,
        currentUploadSpeed: 2.0,
        maxDownloadSpeed: 5,
        maxUploadSpeed: 2,
        signalStrength: 82,
        connectedAt: hoursAgo(2.5),
        lastActivity: minutesAgo(12),
        voucherId: 'voucher-003',
    },
    {
        id: 'dev-010',
        name: 'Xiaomi 14 Ultra',
        hostname: 'xiaomi-14ultra',
        macAddress: 'D7:E8:F9:A0:B1:C2',
        ipAddress: '192.168.43.110',
        deviceType: 'phone',
        status: 'connected',
        downloadUsageMB: 560,
        uploadUsageMB: 180,
        currentDownloadSpeed: 21.4,
        currentUploadSpeed: 7.6,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 73,
        connectedAt: hoursAgo(1),
        lastActivity: minutesAgo(4),
    },
    {
        id: 'dev-011',
        name: 'HP Spectre x360',
        hostname: 'hp-spectre',
        macAddress: 'E9:F0:A1:B2:C3:D4',
        ipAddress: '192.168.43.111',
        deviceType: 'laptop',
        status: 'blocked',
        downloadUsageMB: 6780,
        uploadUsageMB: 1560,
        currentDownloadSpeed: 0,
        currentUploadSpeed: 0,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 0,
        connectedAt: hoursAgo(10),
        lastActivity: hoursAgo(3),
    },
    {
        id: 'dev-012',
        name: 'Nothing Phone 2',
        hostname: 'nothing-phone2',
        macAddress: 'F1:A2:B3:C4:D5:E6',
        ipAddress: '192.168.43.112',
        deviceType: 'phone',
        status: 'connected',
        downloadUsageMB: 345,
        uploadUsageMB: 67,
        currentDownloadSpeed: 12.8,
        currentUploadSpeed: 3.9,
        maxDownloadSpeed: 25,
        maxUploadSpeed: 10,
        signalStrength: 61,
        connectedAt: hoursAgo(0.75),
        lastActivity: minutesAgo(6),
    },
    {
        id: 'dev-013',
        name: 'Lenovo ThinkPad',
        hostname: 'thinkpad-t14',
        macAddress: 'A3:B4:C5:D6:E7:F8',
        ipAddress: '192.168.43.113',
        deviceType: 'laptop',
        status: 'connected',
        downloadUsageMB: 4120,
        uploadUsageMB: 920,
        currentDownloadSpeed: 38.9,
        currentUploadSpeed: 14.2,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 68,
        connectedAt: hoursAgo(5),
        lastActivity: minutesAgo(1),
    },
    {
        id: 'dev-014',
        name: 'Amazon Fire Tablet',
        hostname: 'fire-tablet',
        macAddress: 'B5:C6:D7:E8:F9:A0',
        ipAddress: '192.168.43.114',
        deviceType: 'tablet',
        status: 'connected',
        downloadUsageMB: 1890,
        uploadUsageMB: 230,
        currentDownloadSpeed: 9.4,
        currentUploadSpeed: 2.1,
        maxDownloadSpeed: 25,
        maxUploadSpeed: 10,
        signalStrength: 52,
        connectedAt: hoursAgo(3),
        lastActivity: minutesAgo(15),
    },
    {
        id: 'dev-015',
        name: 'Huawei MatePad',
        hostname: 'matepad-11',
        macAddress: 'C7:D8:E9:F0:A1:B2',
        ipAddress: '192.168.43.115',
        deviceType: 'tablet',
        status: 'connected',
        downloadUsageMB: 720,
        uploadUsageMB: 110,
        currentDownloadSpeed: 11.7,
        currentUploadSpeed: 3.5,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 47,
        connectedAt: hoursAgo(1.2),
        lastActivity: minutesAgo(9),
    },
    {
        id: 'dev-016',
        name: 'ASUS ROG Phone 8',
        hostname: 'rog-phone8',
        macAddress: 'D9:E0:F1:A2:B3:C4',
        ipAddress: '192.168.43.116',
        deviceType: 'phone',
        status: 'connected',
        downloadUsageMB: 7830,
        uploadUsageMB: 2100,
        currentDownloadSpeed: 62.1,
        currentUploadSpeed: 28.4,
        maxDownloadSpeed: 100,
        maxUploadSpeed: 50,
        signalStrength: 89,
        connectedAt: hoursAgo(7),
        lastActivity: minutesAgo(0),
    },
    {
        id: 'dev-017',
        name: 'Motorola Edge 40',
        hostname: 'moto-edge40',
        macAddress: 'E1:F2:A3:B4:C5:D6',
        ipAddress: '192.168.43.117',
        deviceType: 'phone',
        status: 'limited',
        downloadUsageMB: 2100,
        uploadUsageMB: 430,
        currentDownloadSpeed: 3.0,
        currentUploadSpeed: 1.0,
        maxDownloadSpeed: 3,
        maxUploadSpeed: 1,
        signalStrength: 76,
        connectedAt: hoursAgo(4),
        lastActivity: minutesAgo(20),
        voucherId: 'voucher-004',
    },
    {
        id: 'dev-018',
        name: 'Sony Xperia 1 V',
        hostname: 'xperia-1v',
        macAddress: 'F3:A4:B5:C6:D7:E8',
        ipAddress: '192.168.43.118',
        deviceType: 'phone',
        status: 'connected',
        downloadUsageMB: 980,
        uploadUsageMB: 210,
        currentDownloadSpeed: 19.8,
        currentUploadSpeed: 6.3,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 64,
        connectedAt: hoursAgo(1.8),
        lastActivity: minutesAgo(7),
    },
    {
        id: 'dev-019',
        name: 'Surface Pro 9',
        hostname: 'surface-pro9',
        macAddress: 'A5:B6:C7:D8:E9:F0',
        ipAddress: '192.168.43.119',
        deviceType: 'laptop',
        status: 'connected',
        downloadUsageMB: 3210,
        uploadUsageMB: 870,
        currentDownloadSpeed: 41.2,
        currentUploadSpeed: 16.8,
        maxDownloadSpeed: 50,
        maxUploadSpeed: 25,
        signalStrength: 55,
        connectedAt: hoursAgo(5.5),
        lastActivity: minutesAgo(2),
    },
    {
        id: 'dev-020',
        name: 'Google Pixel Tablet',
        hostname: 'pixel-tablet',
        macAddress: 'B7:C8:D9:E0:F1:A2',
        ipAddress: '192.168.43.120',
        deviceType: 'tablet',
        status: 'connected',
        downloadUsageMB: 430,
        uploadUsageMB: 55,
        currentDownloadSpeed: 7.6,
        currentUploadSpeed: 2.4,
        maxDownloadSpeed: 25,
        maxUploadSpeed: 10,
        signalStrength: 41,
        connectedAt: hoursAgo(0.3),
        lastActivity: minutesAgo(11),
    },
];

export const mockVouchers: Voucher[] = [
    {
        id: 'voucher-001',
        code: 'FAST2024',
        durationHours: 24,
        dataLimitMB: 2048,
        maxDevices: 2,
        currentDevices: 1,
        dataUsedMB: 1820,
        status: 'active',
        usedBy: ['dev-002'],
        createdAt: daysAgo(1),
        expiresAt: hoursFromNow(12),
        note: 'Guest access - premium',
    },
    {
        id: 'voucher-002',
        code: 'LITE4EVR',
        durationHours: 12,
        dataLimitMB: 512,
        maxDevices: 1,
        currentDevices: 1,
        dataUsedMB: 410,
        status: 'active',
        usedBy: ['dev-004'],
        createdAt: hoursAgo(6),
        expiresAt: hoursFromNow(6),
        note: 'Limited speed guest',
    },
    {
        id: 'voucher-003',
        code: 'THR0TTL3',
        durationHours: 8,
        dataLimitMB: 256,
        maxDevices: 1,
        currentDevices: 1,
        dataUsedMB: 230,
        status: 'active',
        usedBy: ['dev-009'],
        createdAt: hoursAgo(5),
        expiresAt: hoursFromNow(3),
        note: 'Throttled access',
    },
    {
        id: 'voucher-004',
        code: 'SLW00001',
        durationHours: 4,
        dataLimitMB: 128,
        maxDevices: 1,
        currentDevices: 1,
        dataUsedMB: 128,
        status: 'expired',
        usedBy: ['dev-017'],
        createdAt: hoursAgo(8),
        expiresAt: hoursAgo(4),
        note: 'Expired basic voucher',
    },
    {
        id: 'voucher-005',
        code: 'PREM1UM8',
        durationHours: 48,
        dataLimitMB: 5120,
        maxDevices: 3,
        currentDevices: 0,
        dataUsedMB: 0,
        status: 'unused',
        usedBy: [],
        createdAt: hoursAgo(2),
        expiresAt: hoursFromNow(46),
        note: 'Premium 48h pass',
    },
    {
        id: 'voucher-006',
        code: 'FREETRL1',
        durationHours: 1,
        dataLimitMB: 100,
        maxDevices: 1,
        currentDevices: 0,
        dataUsedMB: 0,
        status: 'unused',
        usedBy: [],
        createdAt: minutesAgo(30),
        expiresAt: hoursFromNow(24),
        note: 'Free trial - 1 hour',
    },
    {
        id: 'voucher-007',
        code: 'BULK0010',
        durationHours: 72,
        dataLimitMB: 10240,
        maxDevices: 5,
        currentDevices: 0,
        dataUsedMB: 0,
        status: 'unused',
        usedBy: [],
        createdAt: minutesAgo(15),
        expiresAt: hoursFromNow(72),
        note: 'Bulk plan - 10GB/5 devices',
    },
    {
        id: 'voucher-008',
        code: 'RVKD2024',
        durationHours: 24,
        dataLimitMB: 1024,
        maxDevices: 2,
        currentDevices: 0,
        dataUsedMB: 450,
        status: 'revoked',
        usedBy: [],
        createdAt: daysAgo(3),
        expiresAt: daysAgo(2),
        note: 'Revoked - abuse detected',
    },
];

export const mockHotspotConfig: HotspotConfig = {
    isActive: true,
    ssid: 'HotspotManager_5G',
    password: 'Xk9#mP2$vL',
    band: '5GHz',
    maxClients: 10,
    isRooted: true,
    gatewayIP: '192.168.43.1',
    securityType: 'WPA3',
};

export const mockNetworkStats: NetworkStats = {
    totalDownloadMB: 52180,
    totalUploadMB: 12440,
    peakDownloadSpeed: 89.3,
    peakUploadSpeed: 42.1,
    uptimeMinutes: 720,
    totalConnectionsToday: 24,
    blockedAttempts: 7,
};

export const mockUsageHistory: UsageHistoryPoint[] = [
    { hour: '00:00', downloadMB: 120, uploadMB: 30 },
    { hour: '01:00', downloadMB: 85, uploadMB: 20 },
    { hour: '02:00', downloadMB: 45, uploadMB: 10 },
    { hour: '03:00', downloadMB: 20, uploadMB: 5 },
    { hour: '04:00', downloadMB: 15, uploadMB: 3 },
    { hour: '05:00', downloadMB: 30, uploadMB: 8 },
    { hour: '06:00', downloadMB: 180, uploadMB: 45 },
    { hour: '07:00', downloadMB: 350, uploadMB: 90 },
    { hour: '08:00', downloadMB: 520, uploadMB: 130 },
    { hour: '09:00', downloadMB: 680, uploadMB: 170 },
    { hour: '10:00', downloadMB: 750, uploadMB: 190 },
    { hour: '11:00', downloadMB: 820, uploadMB: 210 },
    { hour: '12:00', downloadMB: 900, uploadMB: 230 },
    { hour: '13:00', downloadMB: 780, uploadMB: 200 },
    { hour: '14:00', downloadMB: 650, uploadMB: 160 },
    { hour: '15:00', downloadMB: 580, uploadMB: 140 },
    { hour: '16:00', downloadMB: 720, uploadMB: 180 },
    { hour: '17:00', downloadMB: 850, uploadMB: 220 },
    { hour: '18:00', downloadMB: 950, uploadMB: 250 },
    { hour: '19:00', downloadMB: 1100, uploadMB: 280 },
    { hour: '20:00', downloadMB: 980, uploadMB: 260 },
    { hour: '21:00', downloadMB: 750, uploadMB: 190 },
    { hour: '22:00', downloadMB: 450, uploadMB: 110 },
    { hour: '23:00', downloadMB: 250, uploadMB: 60 },
];

// ============ UTILITY FUNCTIONS ============

export function formatBytes(mb: number): string {
    if (mb < 1) return `${Math.round(mb * 1024)} KB`;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
}

export function formatSpeed(mbps: number): string {
    if (mbps < 1) return `${Math.round(mbps * 1000)} Kbps`;
    return `${mbps.toFixed(1)} Mbps`;
}

export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

export function formatTimeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function getTimeSinceConnected(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60000);
    return formatDuration(minutes);
}

export function generateVoucherCode(length: number = 8): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function getDeviceIcon(type: DeviceType): string {
    switch (type) {
        case 'phone': return 'phone-android';
        case 'tablet': return 'tablet-android';
        case 'laptop': return 'laptop';
        case 'desktop': return 'desktop-windows';
        default: return 'devices-other';
    }
}

export function getStatusColor(status: DeviceStatus): string {
    switch (status) {
        case 'connected': return '#34D399';
        case 'blocked': return '#F87171';
        case 'limited': return '#FBBF24';
        default: return '#6B7280';
    }
}

export function getVoucherStatusColor(status: VoucherStatus): string {
    switch (status) {
        case 'active': return '#34D399';
        case 'unused': return '#60A5FA';
        case 'expired': return '#6B7280';
        case 'revoked': return '#F87171';
        default: return '#6B7280';
    }
}

export function getSignalIcon(strength: number): string {
    if (strength >= 75) return 'signal-wifi-4-bar';
    if (strength >= 50) return 'network-wifi-3-bar';
    if (strength >= 25) return 'network-wifi-2-bar';
    if (strength > 0) return 'network-wifi-1-bar';
    return 'signal-wifi-off';
}

export function getSignalColor(strength: number): string {
    if (strength >= 75) return '#34D399';
    if (strength >= 50) return '#FBBF24';
    if (strength >= 25) return '#F59E0B';
    return '#F87171';
}
