import { Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItem;
  readonly checkoutButton;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }
}
