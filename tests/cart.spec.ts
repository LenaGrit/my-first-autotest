// tests/cart.spec.ts
import { test, expect } from '../fixtures/fixtures';

test.describe('Проверка корзины (уже залогинен standard_user)', () => {

  test('добавление одного товара и его удаление',
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCartBackpack.click();
      await expect(inventoryPage.cartBadge).toContainText('1');
      await inventoryPage.cartButton.click();
      await expect(cartPage.cartItem.first()).toContainText('Sauce Labs Backpack');
      await cartPage.removeBackpackButton.click();
      await expect(cartPage.cartItem).toHaveCount(0);
  });

  test('добавление нескольких товаров',
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCartBackpack.click();
      await inventoryPage.addToCartBikeLight.click();
      await expect(inventoryPage.cartBadge).toContainText('2');
      await inventoryPage.cartButton.click();
      await expect(cartPage.cartItem.nth(0)).toContainText('Sauce Labs Backpack');
      await expect(cartPage.cartItem.nth(1)).toContainText('Sauce Labs Bike Light');
  });

  test('удаление одного из нескольких товаров',
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCartBackpack.click();
      await inventoryPage.addToCartBikeLight.click();
      await inventoryPage.cartButton.click();
      await cartPage.removeBackpackButton.click();
      await expect(cartPage.cartItem).toHaveCount(1);
      await expect(cartPage.cartItem.first()).toContainText('Sauce Labs Bike Light');
  });

  test('продолжить покупки из корзины',
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCartBackpack.click();
      await inventoryPage.cartButton.click();
      await cartPage.continueShoppingButton.click();
      await expect(inventoryPage.page).toHaveURL(/inventory/);
  });

  test('добавление товара после продолжения покупок',
    async ({ inventoryPage, cartPage }) => {
      await inventoryPage.addToCartBackpack.click();
      await inventoryPage.cartButton.click();
      await cartPage.continueShoppingButton.click();
      await inventoryPage.addToCartTShirt.click();
      await inventoryPage.cartButton.click();
      await expect(cartPage.cartItem).toHaveCount(2);
      await expect(cartPage.cartItem.nth(1)).toContainText('Sauce Labs Bolt T-Shirt');
  });

});
