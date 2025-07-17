 import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly removeBackpackButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator('.cart_item'); // для одиночной проверки
    this.cartItems = page.locator('.cart_item'); // для .not.toContainText()
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeBackpackButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }
}