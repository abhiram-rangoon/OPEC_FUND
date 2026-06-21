import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.opec.oilfund',
  appName: 'OPEC',
  webDir: 'out',
  server: {
    url: 'http://192.168.0.7:3000',
    cleartext: true
  }
};

export default config;
