import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yabets.next',
  appName: 'Next',
  webDir: 'out',
  android: {
    // Match canvas background — prevents white flash on cold launch
    backgroundColor: '#121218',
  },
  server: {
    // Capacitor 5+ default is https, which fixes some storage APIs
    androidScheme: 'https',
  },
};

export default config;
