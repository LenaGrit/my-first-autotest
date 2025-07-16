import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly errorMessage;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async loginAs(username: string) {
    await this.goto();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill('secret_sauce');
    await this.loginButton.click();
  }
}
