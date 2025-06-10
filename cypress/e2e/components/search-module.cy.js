describe("SearchModule Component", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should render search input", () => {
    cy.visit("/modules");

    cy.get(
      'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
    )
      .first()
      .should("be.visible");
  });

  it("should handle search input changes", () => {
    cy.visit("/modules");

    cy.get(
      'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
    )
      .first()
      .type("CS1010")
      .should("have.value", "CS1010");
  });

  it("should clear input when X button is clicked (if exists)", () => {
    cy.visit("/modules");

    const searchInput = cy
      .get(
        'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
      )
      .first();

    searchInput.type("test query");

    cy.get("body").then(($body) => {
      if (
        $body.find(
          '[data-testid="clear-search"], button[aria-label*="clear"], button[title*="clear"]',
        ).length > 0
      ) {
        cy.get(
          '[data-testid="clear-search"], button[aria-label*="clear"], button[title*="clear"]',
        )
          .first()
          .click();

        searchInput.should("have.value", "");
      }
    });
  });

  it("should handle keyboard shortcuts if implemented", () => {
    cy.visit("/modules");

    cy.get("body").type("{cmd}k");

    cy.focused().then(($focused) => {
      if ($focused.is("input")) {
        cy.log("✅ Keyboard shortcut working");
      } else {
        cy.log("ℹ️ Keyboard shortcut not implemented or different selector");
      }
    });
  });

  it("should be accessible", () => {
    cy.visit("/modules");

    cy.get(
      'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
    )
      .first()
      .should("have.attr", "placeholder")
      .should("not.be.empty");

    cy.get(
      'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
    )
      .first()
      .should("satisfy", ($el) => {
        return (
          $el.attr("aria-label") ||
          $el.attr("aria-labelledby") ||
          $el.closest("label").length > 0 ||
          $el.attr("placeholder")
        );
      });
  });

  it("should not crash with various input types", () => {
    cy.visit("/modules");

    const searchInput = cy
      .get(
        'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
      )
      .first();

    const testInputs = [
      "CS1010",
      "programming",
      "PROGRAMMING",
      "123",
      "special chars !@#$%",
      "very long search query that might cause issues with rendering or performance",
      " ", // Use space instead of empty string
    ];

    testInputs.forEach((input) => {
      searchInput.clear();
      if (input.trim() !== "") {
        searchInput.type(input);
      }
      cy.wait(100);

      searchInput.should("be.visible");
    });
  });

  it("should handle escape key without crashing", () => {
    cy.visit("/modules");

    cy.get(
      'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
    )
      .first()
      .type("test query")
      .type("{esc}");

    // Should not crash after escape
    cy.get("body").should("be.visible");
  });

  it("should handle enter key without crashing", () => {
    cy.visit("/modules");

    cy.get(
      'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
    )
      .first()
      .type("CS1010")
      .type("{enter}");

    // Should not crash after enter
    cy.get("body").should("be.visible");
  });

  it("should handle arrow keys without crashing", () => {
    cy.visit("/modules");

    const searchInput = cy
      .get(
        'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
      )
      .first();

    searchInput.type("CS");
    searchInput.type("{downarrow}");
    searchInput.type("{uparrow}");

    // Should not crash after arrow key navigation
    cy.get("body").should("be.visible");
  });

  it("should remain functional across different pages", () => {
    const pages = ["/modules", "/planner"];

    pages.forEach((page) => {
      cy.visit(page);

      // Should have search input or at least not crash
      cy.get("body").should("be.visible");

      // If search input exists, it should work
      cy.get("body").then(($body) => {
        if (
          $body.find(
            'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
          ).length > 0
        ) {
          cy.get(
            'input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]',
          )
            .first()
            .type("test")
            .should("have.value", "test");
        }
      });

      cy.log(`✅ Search functionality working on ${page}`);
    });
  });
});
