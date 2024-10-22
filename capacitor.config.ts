import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'professional.teacher.egytag.com',
  appName: 'teacher',
  webDir: 'www',
  overrideUserAgent: 'smart code user agent',
  zoomEnabled: true,
  server: {
    hostname: 'localhost',
    androidScheme: 'http',
  },
  plugins: {
    PrivacyScreen: {
      enable: true,
      imageName: 'Splashscreen',
      contentMode: 'scaleAspectFit',
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
