import { Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly addToCartBackpack;
  readonly cartButton;
  readonly inventoryItemImg;
  readonly inventoryItem;

  constructor(page: Page) {
    this.page = page;
    this.addToCartBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.cartButton = page.locator('.shopping_cart_link');
    this.inventoryItemImg = page.locator('.inventory_item_img img');
    this.inventoryItem = page.locator('.inventory_item').first();
  }
}
