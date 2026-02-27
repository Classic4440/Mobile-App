import Constants from 'expo-constants';

export const ENV = {
  isDev: __DEV__,
  isProd: !__DEV__,
  apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
  appVersion: Constants.expoConfig?.version || '1.0.0',
  appName: Constants.expoConfig?.name || 'HotspotManager',
  bundleIdentifier: Constants.expoConfig?.ios?.bundleIdentifier || 'com.onlythefamily.hotspotmanager',
};

export const LOG = (message: string, data?: any) => {
  if (ENV.isDev) {
    console.log(`[APP] ${message}`, data || '');
  }
};

export const LOGW = (message: string, data?: any) => {
  console.warn(`[APP] ${message}`, data || '');
};

export const LOGE = (message: string, error?: Error | any) => {
  console.error(`[APP] ${message}`, error || '');
};
