# SMU Mods Cypress Testing Suite

A comprehensive regression testing framework for the SMU Mods application. These tests are designed to ensure that changes to the codebase don't break existing functionality.

## 🎯 Purpose

This testing suite serves as a **regression testing framework** that:

- Validates core application functionality continues to work
- Ensures pages load without errors
- Tests responsive design across different viewports
- Verifies utility functions behave correctly
- Catches breaking changes before deployment

## 📁 Test Structure

```
cypress/
├── e2e/
│   ├── components/           # Component-level tests
│   │   └── search-module.cy.js
│   ├── hooks/               # React hooks tests
│   │   └── use-mobile.cy.js
│   ├── stores/              # State management tests
│   │   └── timetable-store.cy.js
│   ├── utils/               # Utility function tests
│   │   ├── module-bank.cy.js
│   │   ├── bid-analytics.cy.js
│   │   └── other-utils.cy.js
│   └── integration/         # End-to-end workflow tests
│       └── basic-navigation.cy.js
├── support/
│   ├── commands.ts          # Custom Cypress commands
│   └── e2e.ts              # Global configuration
└── fixtures/               # Test data (if needed)
```

## 🧪 Test Categories

### 1. Utility Function Tests

**`utils/module-bank.cy.js`**

- Tests the `searchModule` function from `src/utils/moduleBank.ts`
- Validates search by module code and name
- Tests case-insensitive search
- Handles edge cases (empty queries, no matches)

**`utils/bid-analytics.cy.js`**

- Tests the `mergeDatasets` function from `src/utils/bid-analytics.ts`
- Validates data merging logic for bid analytics
- Tests error handling with missing datasets
- Handles mismatched data lengths

**`utils/other-utils.cy.js`**

- Tests utility functions like `getMatriculationYears`, `getUserYear`, `getClassDuration`
- Validates date/time calculations
- Tests edge cases and input validation

### 2. Hook Tests

**`hooks/use-mobile.cy.js`**

- Tests the `useMobile` hook from `src/hooks/use-mobile.ts`
- Validates mobile viewport detection (768px breakpoint)
- Tests responsive behavior across different screen sizes
- Ensures consistent behavior across page loads

### 3. Component Tests

**`components/search-module.cy.js`**

- Tests search input functionality
- Validates keyboard interactions
- Tests accessibility features
- Handles various input types without crashing

### 4. Store Tests

**`stores/timetable-store.cy.js`**

- Tests timetable store initialization
- Validates localStorage persistence
- Tests state consistency across navigation
- Ensures responsive behavior

### 5. Integration Tests

**`integration/basic-navigation.cy.js`**

- Tests navigation between all main pages
- Validates page loading without errors
- Tests browser back/forward functionality
- Ensures responsive design across viewports
- Performance and accessibility checks

## 🚀 Running Tests

### Local Development

```bash
# Install dependencies
npm install

# Open Cypress UI
npm run cy:open

# Run tests headlessly
npm run cy:run

# Run specific test file
npx cypress run --spec "cypress/e2e/utils/module-bank.cy.js"
```

### Available Scripts

```json
{
  "cy:open": "cypress open",
  "cy:run": "cypress run",
  "cy:run:chrome": "cypress run --browser chrome",
  "cy:run:edge": "cypress run --browser edge"
}
```

## 🛠 Custom Commands

The test suite includes several custom Cypress commands for common operations:

```typescript
// Clear application data
cy.clearTimetableData();

// Check if a page loads correctly
cy.checkPageLoads("/timetable");

// Test responsive design
cy.checkResponsive("/modules");

// Wait for page to fully load
cy.waitForPageLoad();

// Basic accessibility checks
cy.checkAccessibility();

// Type in search inputs
cy.typeInSearch("CS1010");
```

## 📱 Responsive Testing

All tests include responsive design validation across:

- **Mobile**: 375x667px (iPhone SE)
- **Tablet**: 768x1024px (iPad)
- **Desktop**: 1280x720px (Standard laptop)

## 🎛 Configuration

### Cypress Config (`cypress.config.ts`)

```typescript
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // Add custom tasks here
    },
  },
});
```

### Environment Variables

```bash
# Base URL for testing
CYPRESS_BASE_URL=http://localhost:3000

# Test environment
CYPRESS_ENV=test
```

## 🔧 Maintenance

### Adding New Tests

When adding new functionality to the app:

1. **Utility Functions**: Add tests in `utils/` directory
2. **Components**: Add tests in `components/` directory
3. **Pages**: Update `integration/basic-navigation.cy.js`
4. **Hooks**: Add tests in `hooks/` directory

### Test Guidelines

- **Keep tests simple and focused** on actual functionality
- **Don't assume specific UI elements** unless you know they exist
- **Use flexible selectors** that work with different implementations
- **Test behavior, not implementation details**
- **Include error cases and edge conditions**

### Example Test Pattern

```javascript
describe("Feature Name", () => {
  beforeEach(() => {
    cy.clearTimetableData();
    cy.visit("/");
  });

  it("should handle basic functionality", () => {
    // Test the core behavior
    cy.get("body").should("be.visible");

    // Test specific functionality if elements exist
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="element"]').length > 0) {
        cy.get('[data-testid="element"]').should("work");
      }
    });
  });
});
```

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Start server
        run: npm start &

      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          wait-on: "http://localhost:3000"
          wait-on-timeout: 120
```

## 🐛 Debugging Tests

### Common Issues

1. **Element not found**: Use flexible selectors or conditional testing
2. **Timing issues**: Add proper waits or increase timeouts
3. **Viewport issues**: Test across different screen sizes
4. **State persistence**: Ensure proper cleanup between tests

### Debug Commands

```bash
# Run with debug info
DEBUG=cypress:* npx cypress run

# Open with specific browser
npx cypress open --browser chrome

# Run single test with video
npx cypress run --spec "path/to/test.cy.js" --record
```

## 📈 Best Practices

1. **Regression Focus**: Tests should catch breaking changes, not test every detail
2. **Flexible Selectors**: Use generic selectors that work across implementations
3. **Error Handling**: Test that the app handles errors gracefully
4. **Performance**: Include basic performance checks
5. **Accessibility**: Validate basic accessibility standards
6. **Real Scenarios**: Test actual user workflows
7. **Maintainable**: Keep tests simple and easy to update

This testing framework ensures your SMU Mods application remains stable and functional as you continue development!
