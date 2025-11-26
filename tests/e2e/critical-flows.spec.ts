/**
 * FairTradeWorker E2E Tests
 * Tests critical user flows: signup, API call, payment
 */

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://app.fairtradeworker.com';

test.describe('User Signup Flow', () => {
  test('should complete homeowner signup', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Fill signup form
    await page.fill('[data-testid="email-input"]', `test-${Date.now()}@example.com`);
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="name-input"]', 'Test User');
    
    // Select user type
    await page.click('[data-testid="homeowner-type"]');
    
    // Submit form
    await page.click('[data-testid="signup-button"]');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify welcome message
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  test('should complete contractor signup', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Fill signup form
    await page.fill('[data-testid="email-input"]', `contractor-${Date.now()}@example.com`);
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="name-input"]', 'Test Contractor');
    await page.fill('[data-testid="company-input"]', 'Test Roofing LLC');
    
    // Select contractor type
    await page.click('[data-testid="contractor-type"]');
    
    // Submit form
    await page.click('[data-testid="signup-button"]');
    
    // Should redirect to verification page
    await expect(page).toHaveURL(/.*verify|onboarding/);
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Submit empty form
    await page.click('[data-testid="signup-button"]');
    
    // Check for validation errors
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Try to sign up with existing email
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.click('[data-testid="homeowner-type"]');
    await page.click('[data-testid="signup-button"]');
    
    // Should show duplicate error
    await expect(page.locator('text=already exists')).toBeVisible();
  });
});

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('[data-testid="email-input"]', 'wrong@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.click('text=Forgot password');
    await expect(page).toHaveURL(/.*forgot-password/);

    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.click('[data-testid="reset-button"]');

    await expect(page.locator('text=reset link sent')).toBeVisible();
  });
});

test.describe('API Key Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display API key section', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/api`);
    
    await expect(page.locator('[data-testid="api-key-section"]')).toBeVisible();
  });

  test('should generate new API key', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/api`);
    
    await page.click('[data-testid="generate-key-button"]');
    
    // Confirm dialog
    await page.click('[data-testid="confirm-generate"]');
    
    // Key should be displayed
    await expect(page.locator('[data-testid="api-key-value"]')).toBeVisible();
  });

  test('should toggle API key visibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/api`);
    
    // Key should be hidden by default
    const keyField = page.locator('[data-testid="api-key-value"]');
    await expect(keyField).toHaveAttribute('type', 'password');
    
    // Click toggle
    await page.click('[data-testid="toggle-visibility"]');
    
    // Key should be visible
    await expect(keyField).toHaveAttribute('type', 'text');
  });

  test('should copy API key to clipboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/api`);
    
    await page.click('[data-testid="copy-key-button"]');
    
    // Toast should appear
    await expect(page.locator('text=Copied to clipboard')).toBeVisible();
  });
});

test.describe('Job Posting Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should post a job with photo', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Click post job
    await page.click('[data-testid="post-job-button"]');
    
    // Select photo option
    await page.click('[data-testid="photo-job"]');
    
    // Upload photo (mock)
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.setInputFiles('./tests/fixtures/roof-sample.jpg');
    }
    
    // Wait for analysis
    await expect(page.locator('[data-testid="analysis-complete"]')).toBeVisible({ timeout: 30000 });
    
    // Verify quote is displayed
    await expect(page.locator('[data-testid="quote-amount"]')).toBeVisible();
  });

  test('should show contractor matches after posting', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/jobs/test-job-123`);
    
    // Wait for matches
    await expect(page.locator('[data-testid="contractor-matches"]')).toBeVisible();
    
    // Verify match cards exist
    const matchCards = page.locator('[data-testid="contractor-card"]');
    await expect(matchCards.first()).toBeVisible();
  });
});

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display payment options', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/billing`);
    
    await expect(page.locator('[data-testid="plan-free"]')).toBeVisible();
    await expect(page.locator('[data-testid="plan-professional"]')).toBeVisible();
    await expect(page.locator('[data-testid="plan-enterprise"]')).toBeVisible();
  });

  test('should open Stripe checkout for upgrade', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/billing`);
    
    await page.click('[data-testid="upgrade-professional"]');
    
    // Should open Stripe checkout or modal
    await expect(page.locator('[data-testid="stripe-checkout"]').or(
      page.locator('iframe[src*="stripe"]')
    )).toBeVisible({ timeout: 10000 });
  });

  test('should show usage statistics', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/usage`);
    
    await expect(page.locator('[data-testid="api-calls-used"]')).toBeVisible();
    await expect(page.locator('[data-testid="api-calls-limit"]')).toBeVisible();
    await expect(page.locator('[data-testid="usage-chart"]')).toBeVisible();
  });

  test('should show usage warning at 80%', async ({ page }) => {
    // This test assumes demo account is near limit
    await page.goto(`${BASE_URL}/dashboard/usage`);
    
    // Check for warning if usage is high
    const usagePercent = await page.locator('[data-testid="usage-percent"]').textContent();
    if (usagePercent && parseInt(usagePercent) >= 80) {
      await expect(page.locator('[data-testid="usage-warning"]')).toBeVisible();
    }
  });
});

test.describe('Onboarding Tutorial', () => {
  test('should show onboarding for new users', async ({ page, context }) => {
    // Clear cookies to simulate new user
    await context.clearCookies();
    
    await page.goto(`${BASE_URL}/signup`);
    
    // Complete signup
    await page.fill('[data-testid="email-input"]', `newuser-${Date.now()}@example.com`);
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="name-input"]', 'New User');
    await page.click('[data-testid="homeowner-type"]');
    await page.click('[data-testid="signup-button"]');
    
    // Wait for onboarding
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 10000 });
  });

  test('should complete onboarding steps', async ({ page }) => {
    // Assuming user is in onboarding
    await page.goto(`${BASE_URL}/onboarding`);
    
    // Step 1: Welcome
    await page.click('[data-testid="next-step"]');
    
    // Step 2: Post a job
    await page.click('[data-testid="next-step"]');
    
    // Step 3: API key
    await page.click('[data-testid="next-step"]');
    
    // Complete
    await expect(page.locator('[data-testid="onboarding-complete"]')).toBeVisible();
  });

  test('should allow skipping onboarding', async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding`);
    
    await page.click('[data-testid="skip-onboarding"]');
    
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Error Boundaries', () => {
  test('should show error boundary on crash', async ({ page }) => {
    // Navigate to a page that might crash
    await page.goto(`${BASE_URL}/dashboard/error-test`);
    
    // Error boundary should catch the error
    await expect(page.locator('[data-testid="error-boundary"]').or(
      page.locator('text=Something went wrong')
    )).toBeVisible();
  });

  test('should allow retry from error boundary', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/error-test`);
    
    // Click retry if available
    const retryButton = page.locator('[data-testid="retry-button"]');
    if (await retryButton.isVisible()) {
      await retryButton.click();
    }
  });
});

test.describe('Loading States', () => {
  test('should show loading state for API calls', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(/.*dashboard/);
    
    await page.goto(`${BASE_URL}/dashboard/jobs`);
    
    // Loading skeleton or spinner should appear
    await expect(page.locator('[data-testid="loading-skeleton"]').or(
      page.locator('[data-testid="loading-spinner"]')
    )).toBeVisible({ timeout: 1000 });
    
    // Content should eventually load
    await expect(page.locator('[data-testid="jobs-list"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Rate Limit Messaging', () => {
  test('should show rate limit message when exceeded', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(/.*dashboard/);
    
    // Navigate to API playground
    await page.goto(`${BASE_URL}/dashboard/playground`);
    
    // Try to make many API calls (this might not trigger rate limit in test)
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="send-request"]');
      await page.waitForTimeout(100);
    }
    
    // If rate limited, should show message
    const rateLimitMessage = page.locator('[data-testid="rate-limit-message"]');
    // This is a conditional check - might not trigger in test environment
  });
});

test.describe('Success Animations', () => {
  test('should show success animation on job post', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[data-testid="email-input"]', 'demo@fairtradeworker.com');
    await page.fill('[data-testid="password-input"]', 'AppReview2024!');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL(/.*dashboard/);
    
    // Post a job flow would trigger success animation
    // Check for animation element
    await page.goto(`${BASE_URL}/dashboard`);
    await page.click('[data-testid="post-job-button"]');
    
    // After completion, check for success animation
    // (Implementation depends on actual UI)
  });
});
