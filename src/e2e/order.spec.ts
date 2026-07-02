import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
  //создаем фейковые куки до тестов
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'super-secret-auth-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'super-secret-auth-token1');
  });

  //мокает пользоватея
  await page.routeFromHAR('./e2e/hars/user.har', {
    url: '**/api/auth/user',
    update: false
  });

  //мокает данные ответа о заказе
  await page.routeFromHAR('./e2e/hars/order.har', {
    url: '**/api/orders',
    update: false
  });
});

test.afterEach(async ({ context, page }) => {
  //удаляем фейковые куки после тестов
  await context.clearCookies();

  await page.evaluate(() => {
    localStorage.clear();
  });
});

test('проверяет оформление заказа', async ({ page }) => {
  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  //проверяем авторизацию
  await page.goto('/profile');
  await expect(page.getByText('Профиль')).toBeVisible();

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

  //проверяет что модалка открылась и номер заказа верный(соответсвует номеру из ответа сервера)
  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText('6825');

  // проверяет что конструктор пуст
  await expect(
    page.getByTestId('constructor').getByText('Краторная булка N-200i')
  ).toHaveCount(0);

  //закрывается модалка
  await page.getByTestId('close-button').click();
  await expect(page.getByTestId('modal')).toHaveCount(0);
});
