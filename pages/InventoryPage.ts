 import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly addToCartBackpack: Locator;
  readonly addToCartBikeLight: Locator;
  readonly addToCartTShirt: Locator;
  readonly cartBadge: Locator;
  readonly inventoryItemImg: Locator;
  readonly inventoryItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator('[data-test="shopping-cart-link"]');
    this.addToCartBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.addToCartBikeLight = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.addToCartTShirt = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.inventoryItemImg = page.locator('.inventory_item_img img');
    this.inventoryItem = page.locator('.inventory_item');
  }
}