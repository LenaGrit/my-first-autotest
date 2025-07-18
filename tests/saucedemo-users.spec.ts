import { test, expect } from '../fixtures/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Standard user', () => {
  test('успешно авторизуется и добавляет товар в корзину', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.addToCartBackpack.click();
    await inventoryPage.cartButton.click();
    await expect(cartPage.cartItem).toHaveCount(1);
  });
});

test.describe('Locked out user', () => {
  test('получает ошибку при входе', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.usernameInput.fill('locked_out_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });
});

test.describe('Problem users', () => {
  test('одинаковые изображения, не заполнить last name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.usernameInput.fill('problem_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();

    await expect(page).toHaveURL(/inventory/);
    const imgSources = await inventoryPage.inventoryItemImg.evaluateAll(imgs =>
      imgs.map((img: HTMLImageElement) => img.src)
    );
    const allSame = imgSources.every(src => src === imgSources[0]);
    expect(allSame).toBe(true);

    await inventoryPage.addToCartBackpack.click();
    await inventoryPage.cartButton.click();
    await cartPage.checkoutButton.click();
    await checkoutPage.firstNameInput.fill('Илья');
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
  });

  test('Performance glitch user: долго загружается, но работает', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.usernameInput.fill('performance_glitch_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();

    const start = Date.now();
    await page.waitForURL('**/inventory.html');
    const loadTime = Date.now() - start;
    console.log(`Время загрузки: ${loadTime} мс`);
    expect(loadTime).toBeLessThan(20000);
  });

  test('Visual user: layout отличается от standard_user', async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const loginPage1 = new LoginPage(page1);
    const inventoryPage1 = new InventoryPage(page1);

    await loginPage1.goto();
    await loginPage1.usernameInput.fill('standard_user');
    await loginPage1.passwordInput.fill('secret_sauce');
    await loginPage1.loginButton.click();
    await expect(page1).toHaveURL(/inventory/);

    const standardBox = await inventoryPage1.inventoryItem.first().boundingBox();
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const loginPage2 = new LoginPage(page2);
    const inventoryPage2 = new InventoryPage(page2);

    await loginPage2.goto();
    await loginPage2.usernameInput.fill('visual_user');
    await loginPage2.passwordInput.fill('secret_sauce');
    await loginPage2.loginButton.click();
    await expect(page2).toHaveURL(/inventory/);

    const visualBox = await inventoryPage2.inventoryItem.first().boundingBox();
    await context2.close();

    expect(standardBox).not.toBeNull();
    expect(visualBox).not.toBeNull();
    if (!standardBox || !visualBox) return;

    const tolerance = 5;
    expect(Math.abs(standardBox.x - visualBox.x)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(standardBox.y - visualBox.y)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(standardBox.width - visualBox.width)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(standardBox.height - visualBox.height)).toBeLessThanOrEqual(tolerance);
  });
});

  
test.describe('Проверка корзины', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAs('standard_user');
  });

  test('добавление одного товара и его удаление', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBackpack.click();
    await expect(inventoryPage.cartBadge).toContainText('1');
    await inventoryPage.cartButton.click();
    await expect(cartPage.cartItem.nth(0)).toContainText('Sauce Labs Backpack');
    await cartPage.removeBackpackButton.click();
    await expect(cartPage.cartItem).toHaveCount(0);
  });

  test('добавление нескольких товаров', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBackpack.click();
    await inventoryPage.addToCartBikeLight.click();
    await expect(inventoryPage.cartBadge).toContainText('2');
    await inventoryPage.cartButton.click();
    await expect(cartPage.cartItem.nth(0)).toContainText('Sauce Labs Backpack');
    await expect(cartPage.cartItem.nth(1)).toContainText('Sauce Labs Bike Light');
  });

  test('удаление одного из нескольких товаров', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBackpack.click();
    await inventoryPage.addToCartBikeLight.click();
    await inventoryPage.cartButton.click();
    await cartPage.removeBackpackButton.click();
    await expect(cartPage.cartItem).toHaveCount(1);
    await expect(cartPage.cartItem.nth(0)).toContainText('Sauce Labs Bike Light');
  });

  test('продолжить покупки из корзины', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartBackpack.click();
    await inventoryPage.cartButton.click();
    await cartPage.continueShoppingButton.click();
    await expect(inventoryPage.page).toHaveURL(/inventory/);
  });

 test('добавление товара после продолжения покупок', async ({ inventoryPage, cartPage }) => {
  await inventoryPage.addToCartBackpack.click();
  await inventoryPage.cartButton.click();
  await cartPage.continueShoppingButton.click();

  await inventoryPage.addToCartTShirt.click();
  await inventoryPage.cartButton.click();

  await expect(cartPage.cartItem).toHaveCount(2);
  await expect(cartPage.cartItem.nth(1)).toContainText('Sauce Labs Bolt T-Shirt');
});
})