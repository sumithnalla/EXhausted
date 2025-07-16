const { test, expect } = require('@playwright/test');

test.describe('BINGE\'N CELEBRATIONS - Complete Booking Flow', () => {
  test('should complete full booking process with payment', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://exhausted.vercel.app');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Step 1: Click "Book Now" button from header or hero section
    await page.click('button:has-text("Book Now")');
    
    // Step 2: Select a venue from the modal
    await page.waitForSelector('[data-testid="venue-card"], .bg-gray-700\\/50', { timeout: 10000 });
    
    // Click on the first available venue (Aura, Couple, Lunar, or Minimax)
    const venueCards = page.locator('.bg-gray-700\\/50, [data-testid="venue-card"]');
    await venueCards.first().click();
    
    // Wait for navigation to payment page
    await page.waitForURL('**/payment?venue=*');
    
    // Step 3: Fill booking form (Step 1 of 4)
    await page.waitForSelector('input[type="date"]');
    
    // Select a future date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3); // 3 days from now to ensure availability
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);
    
    // Wait for slots to load and select first available slot
    await page.waitForSelector('select:has(option:contains(":"))', { timeout: 10000 });
    const slotSelect = page.locator('select').filter({ hasText: 'Select a slot' });
    await slotSelect.selectOption({ index: 1 }); // Select first available slot
    
    // Fill booking details
    await page.fill('input[placeholder*="booking name"], input[placeholder*="Enter booking name"]', 'John Doe Test Booking');
    
    // Select number of persons
    await page.selectOption('select:has(option:contains("Person"))', '2');
    
    // Fill WhatsApp number (10 digits)
    await page.fill('input[placeholder*="WhatsApp"], input[type="tel"]', '9876543210');
    
    // Fill email
    await page.fill('input[type="email"]', 'test@example.com');
    
    // Select decoration option (if not Couple venue which has mandatory decoration)
    const decorationSelect = page.locator('select').filter({ hasText: 'decoration' });
    if (await decorationSelect.isVisible()) {
      await decorationSelect.selectOption('yes');
    }
    
    // Click Next to go to Event Type Selection
    await page.click('button:has-text("Next")');
    
    // Step 4: Event Type Selection (Step 2 of 4)
    await page.waitForSelector('text=Step 1: Select Event Type', { timeout: 10000 });
    
    // Select an event type (Birthday, Anniversary, etc.)
    const eventTypes = page.locator('[class*="cursor-pointer"][class*="rounded-xl"]').filter({ hasText: /Birthday|Anniversary|Romantic Date/ });
    await eventTypes.first().click();
    
    // Click Next to go to Cake Selection
    await page.click('button:has-text("Next"):not([disabled])');
    
    // Step 5: Cake Selection (Step 3 of 4) - Optional
    await page.waitForSelector('text=Step 2: Select Cake', { timeout: 10000 });
    
    // Optionally select a cake
    const cakeCards = page.locator('[class*="cursor-pointer"][class*="rounded-xl"]').filter({ hasText: /Vanilla|Chocolate|Strawberry/ });
    if (await cakeCards.count() > 0) {
      await cakeCards.first().click();
    }
    
    // Click Next to go to Add-ons
    await page.click('button:has-text("Next")');
    
    // Step 6: Add-ons Selection (Step 4 of 4) - Optional
    await page.waitForSelector('text=Step 3: Select Add-ons', { timeout: 10000 });
    
    // Optionally select some add-ons
    const addOnCards = page.locator('[class*="cursor-pointer"][class*="rounded-xl"]').filter({ hasText: /Rose|LED|Photo/ });
    if (await addOnCards.count() > 0) {
      await addOnCards.first().click();
    }
    
    // Click Next to go to Final Summary
    await page.click('button:has-text("Next")');
    
    // Step 7: Final Summary and Terms (Step 4 of 4)
    await page.waitForSelector('text=Step 4: Review & Confirm', { timeout: 10000 });
    
    // Click Confirm & Pay Advance
    await page.click('button:has-text("Confirm & Pay")');
    
    // Step 8: Accept Terms and Conditions
    await page.waitForSelector('text=Terms & Conditions and Refund Policy', { timeout: 10000 });
    
    // Check the terms acceptance checkbox
    await page.check('input[type="checkbox"]');
    
    // Click Continue to Payment
    await page.click('button:has-text("Continue to Payment")');
    
    // Step 9: Razorpay Payment Flow
    // Wait for Razorpay modal to appear
    await page.waitForSelector('iframe[name*="razorpay"], .razorpay-container, [class*="razorpay"]', { timeout: 15000 });
    
    // Handle Razorpay payment in iframe or modal
    try {
      // If Razorpay opens in iframe
      const razorpayFrame = page.frameLocator('iframe[name*="razorpay"]');
      
      // Fill test card details (Razorpay test mode)
      await razorpayFrame.locator('input[name="card[number]"], input[placeholder*="card number"]').fill('4111111111111111');
      await razorpayFrame.locator('input[name="card[expiry]"], input[placeholder*="MM/YY"]').fill('12/25');
      await razorpayFrame.locator('input[name="card[cvv]"], input[placeholder*="CVV"]').fill('123');
      await razorpayFrame.locator('input[name="card[name]"], input[placeholder*="name"]').fill('Test User');
      
      // Click Pay button
      await razorpayFrame.locator('button:has-text("Pay"), button[type="submit"]').click();
      
    } catch (error) {
      // Alternative approach if iframe handling fails
      console.log('Trying alternative Razorpay handling...');
      
      // Look for direct Razorpay elements
      await page.fill('input[name="card[number]"], input[placeholder*="card number"]', '4111111111111111');
      await page.fill('input[name="card[expiry]"], input[placeholder*="MM/YY"]', '12/25');
      await page.fill('input[name="card[cvv]"], input[placeholder*="CVV"]', '123');
      await page.fill('input[name="card[name]"], input[placeholder*="name"]', 'Test User');
      
      await page.click('button:has-text("Pay"), button[type="submit"]');
    }
    
    // Step 10: Verify successful booking
    // Wait for redirect to booking success page
    await page.waitForURL('**/booking-success', { timeout: 30000 });
    
    // Verify we're on the success page
    await expect(page).toHaveURL(/.*booking-success/);
    
    // Verify success message elements
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    await expect(page.locator('text=Thank you for choosing BINGE\'N CELEBRATIONS')).toBeVisible();
    
    // Verify success icon is present
    await expect(page.locator('svg, .text-green-500')).toBeVisible();
    
    // Verify contact information is displayed
    await expect(page.locator('text=+91 99590 59632')).toBeVisible();
    await expect(page.locator('text=bingencelebrations@gmail.com')).toBeVisible();
    
    console.log('✅ Booking flow completed successfully!');
  });
  
  test('should handle booking flow with minimal selections', async ({ page }) => {
    // Test with minimal required fields only
    await page.goto('https://exhausted.vercel.app');
    await page.waitForLoadState('networkidle');
    
    // Quick booking flow with minimal data
    await page.click('button:has-text("Book Now")');
    
    // Select venue
    await page.waitForSelector('.bg-gray-700\\/50');
    await page.locator('.bg-gray-700\\/50').first().click();
    
    // Fill only required fields
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateString = tomorrow.toISOString().split('T')[0];
    
    await page.fill('input[type="date"]', dateString);
    await page.waitForSelector('select option:not([value=""])', { timeout: 10000 });
    await page.selectOption('select:has(option:contains(":"))', { index: 1 });
    
    await page.fill('input[placeholder*="booking name"]', 'Quick Test');
    await page.fill('input[type="tel"]', '9999999999');
    await page.fill('input[type="email"]', 'quick@test.com');
    
    await page.click('button:has-text("Next")');
    
    // Select event type
    await page.waitForSelector('text=Step 1: Select Event Type');
    await page.locator('[class*="cursor-pointer"]').first().click();
    await page.click('button:has-text("Next"):not([disabled])');
    
    // Skip cake selection
    await page.click('button:has-text("Next")');
    
    // Skip add-ons
    await page.click('button:has-text("Next")');
    
    // Confirm booking
    await page.click('button:has-text("Confirm & Pay")');
    
    // Accept terms
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Continue to Payment")');
    
    // Verify we reach payment stage
    await page.waitForSelector('iframe[name*="razorpay"], .razorpay-container', { timeout: 15000 });
    
    console.log('✅ Minimal booking flow reached payment stage successfully!');
  });
});