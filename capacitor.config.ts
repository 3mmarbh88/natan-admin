export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  [key: string]: unknown;
}

const config: CapacitorConfig = {
  appId: 'com.natan.admin',
  appName: 'NATAN ADMIN',
  webDir: 'dist'
};

export default config;
