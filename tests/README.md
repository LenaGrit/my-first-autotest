# 🧪 Автотесты для saucedemo.com на Playwright

Проект использует Page Object Model (POM) и покрывает типовых пользователей.

## 📦 Установка проекта

```bash
npm install
npx playwright install
```

## 🚀 Запуск тестов

```bash
npx playwright test
```

## 📊 Отчёт

```bash
npx playwright show-report
```

## 🗂 Структура проекта

```
.
├── pages/                   # Модели страниц (POM)
│   └── LoginPage.ts
├── tests/                   # Тесты
│   └── saucedemo_gpt.spec.ts
├── playwright.config.ts     # Конфигурация Playwright
├── package.json             # Зависимости и скрипты
└── README.md                # Инструкция
```