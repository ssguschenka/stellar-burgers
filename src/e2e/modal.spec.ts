import { test, expect } from '@playwright/test';
test('проверяет работу модалльного окна ингридиента', async ({ page }) => {
  await page.routeFromHAR('./e2e/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');

  // проверяем клик по ингридиенту
  const ingredient = page.getByRole('listitem').filter({
    hasText: 'Хрустящие минеральные кольца'
  });

  await ingredient.click();

  //проверяем что открывается модалка 
  await expect(page.getByTestId('modal')).toBeVisible();

  //проверяем что модалка закрывается при клике на крестик
  await page.getByTestId('close-button').click();

  await expect(page.getByTestId('modal')).toHaveCount(0);

  //проверяем что модалка закрывается при клике на оверлей
  await ingredient.click();

  await expect(page.getByTestId('modal')).toBeVisible();

  await page.getByTestId('modal-overlay').click({
    position: { x: 10, y: 10 }
  });

  await expect(page.getByTestId('modal')).toHaveCount(0);
});
