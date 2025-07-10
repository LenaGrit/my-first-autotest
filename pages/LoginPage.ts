import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly BASE_URL = 'https://www.saucedemo.com/';
  readonly PASSWORD = 'secret_sauce';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.BASE_URL);
  }

  async loginAs(username: string) {
    await this.goto();
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(this.PASSWORD);
    await this.page.locator('[data-test="login-button"]').click();
  }

  get errorMessage() {
    return this.page.locator('[data-test="error"]');
  }

  get cartButton() {
    return this.page.locator('.shopping_cart_link');
  }

  get addToCartBackpack() {
    return this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  }

  get checkoutButton() {
    return this.page.locator('[data-test="checkout"]');
  }

  get firstNameInput() {
    return this.page.locator('[data-test="firstName"]');
  }

  get continueButton() {
    return this.page.locator('[data-test="continue"]');
  }

  get cartItem() {
    return this.page.locator('.cart_item');
  }

  get inventoryItemImg() {
    return this.page.locator('.inventory_item_img img');
  }

  get inventoryItem() {
    return this.page.locator('.inventory_item').first();
  }
}