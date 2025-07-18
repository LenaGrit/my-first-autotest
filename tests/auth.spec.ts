// tests/auth.spec.ts
import { test, expect } from '../fixtures/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Авторизация и сценарии разных пользователей', () => {

  test('Standard user: логин + добавление в корзину', 
    async ({ loginPage, inventoryPage, cartPage }) => {
      await loginPage.loginAs('standard_user');
      await expect(loginPage.page).toHaveURL(/inventory/);
      await inventoryPage.addToCartBackpack.click();
      await inventoryPage.cartButton.click();
      await expect(cartPage.cartItem).toHaveCount(1);
  });

  test('Locked out user: ошибка при логине',
    async ({ loginPage }) => {
      await loginPage.loginAs('locked_out_user');
      await expect(loginPage.errorMessage).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
      );
  });

  test('Problem user: одинаковые картинки + обязательность Last Name',
    async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
      await loginPage.loginAs('problem_user');
      await expect(loginPage.page).toHaveURL(/inventory/);

      // проверяем, что все src одинаковые
      const srcs = await inventoryPage.inventoryItemImg.evaluateAll(
        imgs => (imgs as HTMLImageElement[]).map(i => i.src)
      );
      expect(srcs.every(s => s === srcs[0])).toBe(true);

      await inventoryPage.addToCartBackpack.click();
      await inventoryPage.cartButton.click();
      await cartPage.checkoutButton.click();
      await checkoutPage.firstNameInput.fill('Илья');
      await checkoutPage.continueButton.click();
      await expect(checkoutPage.errorMessage).toHaveText(
        'Error: Last Name is required'
      );
  });

  test('Performance glitch user: не дольше 20 сек загрузка',
    async ({ loginPage, page }) => {
      await loginPage.loginAs('performance_glitch_user');
      const start = Date.now();
      await page.waitForURL('**/inventory.html');
      const dt = Date.now() - start;
      console.log(`Время загрузки: ${dt} мс`);
      expect(dt).toBeLessThan(20000);
  });

  test('Visual user: layout отличается от standard_user', async ({ browser }) => {
  // Для standard_user
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  const loginPage1 = new LoginPage(page1);
  const inventoryPage1 = new InventoryPage(page1);

  await loginPage1.loginAs('standard_user');
  await expect(page1).toHaveURL(/inventory/);
  const box1 = await inventoryPage1.inventoryItem.first().boundingBox();
  await context1.close();

  // Для visual_user
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const loginPage2 = new LoginPage(page2);
  const inventoryPage2 = new InventoryPage(page2);

  await loginPage2.loginAs('visual_user');
  await expect(page2).toHaveURL(/inventory/);
  const box2 = await inventoryPage2.inventoryItem.first().boundingBox();
  await context2.close();

  if (!box1 || !box2) throw new Error('Не удалось получить размеры элементов');

  const tol = 5;
  expect(Math.abs(box1.x - box2.x)).toBeLessThanOrEqual(tol);
  expect(Math.abs(box1.y - box2.y)).toBeLessThanOrEqual(tol);
  expect(Math.abs(box1.width - box2.width)).toBeLessThanOrEqual(tol);
  expect(Math.abs(box1.height - box2.height)).toBeLessThanOrEqual(tol);
});

});
