// HotspotManager Configuration

export const config = {
  appName: 'HotspotManager',
  version: '1.0.0',

  // Default hotspot settings
  defaultSSID: 'HotspotManager_5G',
  defaultPassword: 'secure2024',
  defaultBand: '5GHz' as const,
  defaultMaxClients: 10,

  // Network ranges
  subnetBase: '192.168.43',
  gatewayIP: '192.168.43.1',
  subnetMask: '255.255.255.0',

  // Speed limits (Mbps)
  maxDownloadSpeed: 100,
  maxUploadSpeed: 50,
  defaultDownloadSpeed: 50,
  defaultUploadSpeed: 25,

  // Voucher defaults
  voucherCodeLength: 8,
  voucherDefaultDurationHours: 24,
  voucherDefaultDataLimitMB: 1024, // 1 GB

  // UI
  animationDuration: 300,
  hapticEnabled: true,
  refreshInterval: 5000, // 5 seconds

  // Root commands (for reference - actual execution requires native module)
  rootCommands: {
    getConnectedDevices: 'ip neigh show dev wlan0',
    getArpTable: 'cat /proc/net/arp',
    kickDevice: (mac: string) => `iptables -I FORWARD -m mac --mac-source ${mac} -j DROP`,
    unblockDevice: (mac: string) => `iptables -D FORWARD -m mac --mac-source ${mac} -j DROP`,
    limitBandwidth: (ip: string, rate: string) => `tc qdisc add dev wlan0 root handle 1: htb && tc class add dev wlan0 parent 1: classid 1:1 htb rate ${rate}`,
    getDataUsage: 'iptables -L FORWARD -v -n',
    toggleHotspot: (enable: boolean) => enable ? 'svc wifi enable-tethering' : 'svc wifi disable-tethering',
    checkRoot: 'su -c id',
  },
} as const;
