import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
  },
});