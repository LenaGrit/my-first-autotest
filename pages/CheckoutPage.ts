import { Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput;
  readonly continueButton;
  readonly errorMessage;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }
}
