# BINGE'N CELEBRATIONS - Playwright Test Suite

This test suite automates the complete booking flow for the BINGE'N CELEBRATIONS website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in headed mode (see browser):
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run tests with UI mode:
```bash
npm run test:ui
```

### View test report:
```bash
npm run report
```

## Test Coverage

The test suite covers:

1. **Complete Booking Flow**:
   - Venue selection from modal
   - Date and slot selection
   - Personal information form
   - Event type selection
   - Optional cake selection
   - Optional add-ons selection
   - Terms and conditions acceptance
   - Razorpay payment flow (test mode)
   - Booking confirmation verification

2. **Minimal Booking Flow**:
   - Tests with only required fields
   - Skips optional selections
   - Verifies payment stage is reached

## Test Data

The tests use:
- **Test Card**: 4111111111111111 (Visa test card)
- **Expiry**: 12/25
- **CVV**: 123
- **Name**: Test User
- **Phone**: 9876543210 / 9999999999
- **Email**: test@example.com / quick@test.com

## Key Features Tested

- ✅ Venue selection modal
- ✅ Multi-step booking form validation
- ✅ Date and time slot availability
- ✅ Event type selection
- ✅ Optional cake and add-ons selection
- ✅ Terms and conditions modal
- ✅ Razorpay payment integration
- ✅ Booking success confirmation
- ✅ Responsive design elements

## Notes

- Tests are configured to run against `https://exhausted.vercel.app`
- Payment flow uses Razorpay test mode
- Tests include proper waits for dynamic content loading
- Screenshots and videos are captured on failures
- Tests handle both iframe and direct Razorpay implementations