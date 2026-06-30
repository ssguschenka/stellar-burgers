import { test, expect } from '@playwright/test';

test.describe('Ингридиенты на главной странице', () => {
  test('должен загрузить ингридиенты из HAR-файла', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');
    // Проверяем, что лоадер исчез
    await expect(page.getByTestId('loading')).not.toBeVisible();

    // Проверяем, что ингридиенты загрузились
    const ingridients = page.getByTestId('ingredients');
    await expect(ingridients).toBeVisible();

    // Проверяем конкретныe ингридиенты
    await expect(page.getByText('Хрустящие минеральные кольца')).toBeVisible();
  });

  test('должен добавлять ингридиент в конструктор', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.goto('/');

    // Проверяем, клик по кнопке "добавить"
    // проверяем добавление булок
    const bun = page.getByRole('listitem').filter({
      hasText: 'Краторная булка N-200i'
    });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Краторная булка N-200i')).toHaveCount(
      2
    );

    // проверяем добавление начинки
    const ingredient = page.getByRole('listitem').filter({
      hasText: 'Хрустящие минеральные кольца'
    });

    await ingredient.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Хрустящие минеральные кольца')
    ).toBeVisible();
  });
});
