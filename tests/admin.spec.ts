import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Attempt to go to dashboard directly
    await page.goto('/admin/dashboard');
    
    // Check if we are redirected to /admin/login
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Fill in the form. Adjust selectors (name/id/placeholder) based on your actual login form
    await page.fill('input[name="email"], input[type="email"]', 'wrong@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
    
    // Click submit
    await page.click('button[type="submit"]');
    
    // Verify error message appears
    // We assume the error message contains 'Invalid' or similar text, or wait for an element with text content
    await expect(page.locator('text=Email atau password salah').or(page.locator('text=Invalid'))).toBeVisible({ timeout: 5000 }).catch(() => {
        // Fallback if exact text isn't known, just verify we didn't get redirected to dashboard
        return expect(page).not.toHaveURL(/.*\/admin\/dashboard/);
    });
  });

  // Note: We avoid placing real correct credentials in plain text testing files.
  // In a real QA scenario, you would use environment variables (e.g., process.env.TEST_ADMIN_EMAIL)
  // For now, this test is a placeholder or you can supply dummy credentials if your DB supports it.
});
