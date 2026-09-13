import { test, expect } from '@playwright/test';

const basePlanilla = {
  _id: '507f1f77bcf86cd799439011',
  month: 'Mayo',
  year: '2026',
  userId: 'user-1',
  email: 'test@example.com',
  startDate: '2026-05-01T00:00:00.000Z',
  endDate: '2026-05-31T00:00:00.000Z',
  trainingDays: [
    {
      day: 'Día 1',
      Bloque1: [
        { name: 'Sentadilla', reps: '10', sets: 3, notas: '', videoLink: '' },
      ],
    },
  ],
};

test('permite editar y guardar una nota desde la planilla', async ({ page }) => {
  let lastPutBody: unknown = null;

  await page.route('**/api/auth/session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'user-1',
          name: 'Diego',
          rol: 'alumno',
        },
        expires: '2099-01-01T00:00:00.000Z',
      }),
    });
  });

  await page.route('**/api/planillas?id=user-1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([basePlanilla]),
    });
  });

  await page.route('**/api/usuarios?id=user-1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ nombre: 'Diego' }),
    });
  });

  await page.route('**/api/planillas', async (route) => {
    if (route.request().method() === 'PUT') {
      lastPutBody = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'todo ok' }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('/e2e/planillas?id=user-1');

  await expect(page.getByText('Rutinas de entrenamiento de Diego')).toBeVisible();
  await page.getByRole('button', { name: /ver planilla de mayo 2026/i }).click();

  const textarea = page.getByRole('textbox').first();
  await textarea.fill('nota e2e');
  const dialogPromise = page.waitForEvent('dialog');
  await page.getByRole('button', { name: /guardar notas/i }).click();
  const dialog = await dialogPromise;
  expect(dialog.message()).toBe('Notas guardadas con éxito');
  await dialog.accept();

  expect(lastPutBody).toEqual({
    id: '507f1f77bcf86cd799439011',
    noteUpdate: {
      dayIndex: 0,
      bloque: 'Bloque1',
      exerciseIndex: 0,
      notas: 'nota e2e',
    },
  });
});