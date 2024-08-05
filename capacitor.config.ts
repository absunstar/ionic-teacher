import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'professional.teacher.egytag.com',
  appName: 'teacher',
  webDir: 'www',
  plugins: {
    PrivacyScreen: {
      enable: true,
      imageName: 'Splashscreen',
      contentMode: 'scaleAspectFit',
    },
  },
};

export default config;
