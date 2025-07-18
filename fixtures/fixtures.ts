// fixtures/fixtures.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type MyFixtures = {
  // открывает страницу логина
  loginPage: LoginPage;
  // сразу логинит standard_user
  authPage: LoginPage;
  // POM для inventory/cart/checkout на уже залогиненом standard_user контексте
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await use(login);
  },

  authPage: async ({ loginPage }, use) => {
    // автоматический логин
    await loginPage.loginAs('standard_user');
    await use(loginPage);
  },

  inventoryPage: async ({ authPage }, use) => {
    const inv = new InventoryPage(authPage.page);
    await use(inv);
  },

  cartPage: async ({ authPage }, use) => {
    const cart = new CartPage(authPage.page);
    await use(cart);
  },

  checkoutPage: async ({ authPage }, use) => {
    const co = new CheckoutPage(authPage.page);
    await use(co);
  },
});

export { expect };
