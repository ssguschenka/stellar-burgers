import { test, expect } from '@playwright/test';

test('проверяет оформление заказа', async ({ page }) => {
  //мокает пользоватея
  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          name: 'Иван',
          email: 'test@bk.com'
        }
      })
    });
  });

  //мокает данные ответа о заказе
  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Острый бургер',
        order: {
          _id: 'test-id',
          status: 'done',
          name: 'Острый бургер',
          owner: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          number: 12345,
          price: 1000
        }
      })
    });
  });

  await page.goto('http://localhost:4000/profile');

  await expect(page.getByText('Профиль')).toBeVisible();

  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');

  // Проверяем, что ингридиенты загрузились
  const ingridients = page.getByTestId('ingredients');
  await expect(ingridients).toBeVisible();

  //добавляем булки в конструктор
  const bun = page.getByRole('listitem').filter({
    hasText: 'Краторная булка N-200i'
  });

  await bun.getByRole('button', { name: 'Добавить' }).click();

  //клик по кнопке оформить заказ
  await page.getByTestId('btn-order').click();

  //проверяет что модалка открылась и номер заказа верный
  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText('12345');

  // проверяет что конструктор пуст
  await expect(
    page.getByTestId('constructor').getByText('Краторная булка N-200i')
  ).toHaveCount(0);

  //закрывается модалка
  await page.getByTestId('close-button').click();

  await expect(page.getByTestId('modal')).toHaveCount(0);
});
