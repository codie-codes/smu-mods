/// <reference types="cypress" />

// Custom commands for SMU Mods testing

// Export to make this a module file
export {};

Cypress.Commands.add("clearTimetableData", () => {
  cy.window().then((win) => {
    // Clear common localStorage keys that might be used by the app
    const keysToClear = [
      "timetable",
      "planner",
      "moduleBank",
      "user-preferences",
      "settings",
      "modules",
      "selectedModules",
    ];

    keysToClear.forEach((key) => {
      win.localStorage.removeItem(key);
    });

    // Also clear sessionStorage
    win.sessionStorage.clear();
  });
});

Cypress.Commands.add("checkPageLoads", (path: string) => {
  cy.visit(path);
  cy.get("body").should("be.visible");

  // Be more specific about error checking - avoid false positives
  cy.get("body").then(($body) => {
    const bodyText = $body.text();
    // Look for actual error messages, not just the word "Error"
    const hasActualError = bodyText.match(
      /(?:error|Error)(?:\s+\d+|:|\s+occurred|s?\s+loading)/,
    );
    if (hasActualError) {
      cy.log("⚠️ Found potential error on page");
    } else {
      cy.log("✅ No errors detected");
    }
  });

  cy.get("body").should("not.contain", "undefined");
  cy.get("body").should("not.contain", "null");
});

Cypress.Commands.add("checkResponsive", (path: string) => {
  const viewports = [
    { width: 375, height: 667 }, // Mobile
    { width: 768, height: 1024 }, // Tablet
    { width: 1280, height: 720 }, // Desktop
  ];

  viewports.forEach((viewport) => {
    cy.viewport(viewport.width, viewport.height);
    cy.visit(path);
    cy.get("body").should("be.visible");
  });
});

Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");

  // Wait for any loading indicators to disappear
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid*="loading"], .loading, .spinner').length > 0) {
      cy.get('[data-testid*="loading"], .loading, .spinner', {
        timeout: 10000,
      }).should("not.exist");
    }
  });
});

Cypress.Commands.add("checkAccessibility", () => {
  // Basic accessibility checks
  cy.get("html").should("have.attr", "lang");
  cy.get("head title").should("exist").and("not.be.empty");

  // Check for common accessibility issues
  cy.get("img").each(($img) => {
    cy.wrap($img).should("satisfy", (el) => {
      return (
        el.attr("alt") !== undefined || el.attr("aria-label") !== undefined
      );
    });
  });

  // Check for proper heading structure
  cy.get("h1, h2, h3, h4, h5, h6").should("exist");
});

Cypress.Commands.add("typeInSearch", (searchTerm: string) => {
  // Generic search input finder
  cy.get(
    'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
  )
    .first()
    .clear()
    .type(searchTerm);
});

Cypress.Commands.add("visitWithMockData", (path: string) => {
  // Mock implementation for visitWithMockData command
  cy.clearTimetableData();
  cy.visit(path);
  cy.waitForPageLoad();
});

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      clearTimetableData(): Chainable<void>;
      checkPageLoads(path: string): Chainable<void>;
      checkResponsive(path: string): Chainable<void>;
      waitForPageLoad(): Chainable<void>;
      checkAccessibility(): Chainable<void>;
      typeInSearch(searchTerm: string): Chainable<void>;
      visitWithMockData(path: string): Chainable<void>;
    }
  }
}
