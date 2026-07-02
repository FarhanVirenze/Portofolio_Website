import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('should load the home page and have correct title', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Check if the page title contains something expected
    // Note: adjust this to match the actual title of your portfolio
    await expect(page).toHaveTitle(/Farhan|Portofolio/i);
    
    // Check if the hero section or main heading is visible
    // This assumes you have an h1 on your homepage. Adjust if needed.
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should load the about page without errors', async ({ page }) => {
    await page.goto('/about');
    
    // Verify it doesn't show a 404 or 500 error
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should load the portofolio page without errors', async ({ page }) => {
    await page.goto('/portofolio');
    
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });
});
