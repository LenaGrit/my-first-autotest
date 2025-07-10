import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Пользователи saucedemo', () => {
  test.beforeEach(async () => {
    console.log('Старт нового теста...');
  });

  test.describe('Standard user', () => {
    test('успешно авторизуется и добавляет товар в корзину', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginAs('standard_user');
      await expect(page).toHaveURL(/inventory/);

      await loginPage.addToCartBackpack.click();
      await loginPage.cartButton.click();
      await expect(loginPage.cartItem).toHaveCount(1);
    });
  });

  test.describe('Locked out user', () => {
    test('получает ошибку при входе', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginAs('locked_out_user');
      await expect(loginPage.errorMessage).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
      );
    });
  });

  test.describe('Problem users', () => {
    test('Problem user: одинаковые изображения, не заполнить last name', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.loginAs('problem_user');
      await expect(page).toHaveURL(/inventory/);

      const imgSources = await loginPage.inventoryItemImg.evaluateAll(imgs =>
        imgs.map((img: HTMLImageElement) => img.src)
      );
      const allSame = imgSources.every(src => src === imgSources[0]);
      expect(allSame).toBe(true);

      await loginPage.addToCartBackpack.click();
      await loginPage.cartButton.click();
      await loginPage.checkoutButton.click();
      await loginPage.firstNameInput.fill('Илья');
      await loginPage.continueButton.click();

      await expect(loginPage.errorMessage).toHaveText('Error: Last Name is required');
    });

    test('Performance glitch user: долго загружается, но работает', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const start = Date.now();
      await loginPage.loginAs('performance_glitch_user');
      await page.waitForURL('**/inventory.html');
      const loadTime = Date.now() - start;
      console.log(`Время загрузки: ${loadTime} мс`);
      expect(loadTime).toBeLessThan(20000);
    });

    test('Visual user: layout товара отличается от standard_user', async ({ browser }) => {
      const context1 = await browser.newContext();
      const page1 = await context1.newPage();
      const loginPage1 = new LoginPage(page1);

      await loginPage1.loginAs('standard_user');
      await expect(page1).toHaveURL(/inventory/);
      const standardBox = await loginPage1.inventoryItem.boundingBox();
      await context1.close();

      const context2 = await browser.newContext();
      const page2 = await context2.newPage();
      const loginPage2 = new LoginPage(page2);

      await loginPage2.loginAs('visual_user');
      await expect(page2).toHaveURL(/inventory/);
      const visualBox = await loginPage2.inventoryItem.boundingBox();
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
});