import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', //папка, из которой запускается тест
  timeout: 30000, //сколько тест ищет в милисек
  workers: 1, //количество параллельных запусков автотестов (если они не зависят друг от друга, 
  // но и комп должен смочь одновременно обрабатывать эти запросы, то есть не всегда это сокращает время тестов)
  retries: 0, //количество перезапусков теста
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: false, //режим, в котором браузер запускается с видимым окном, а не "в фоне".
    //true - невидимо, false - открытие "вживую")
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
});