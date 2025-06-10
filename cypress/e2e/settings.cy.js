describe("settings", () => {
  it("should access the settings page", () => {
    cy.visit("http://localhost:3000/settings");

    cy.get('[data-cy="disclaimer"]').should("exist");
    cy.get('[data-cy="disclaimer-title"]').should("have.text", "Disclaimer");
    cy.get('[data-cy="disclaimer-button"]').click();
    cy.get('[data-cy="disclaimer-title"]').should("not.exist");

    cy.get('[data-cy="matriculation-setting-content').should("not.exist");
    cy.get('[data-cy="matriculation-setting-button"]').click();
    cy.get('[data-cy="matriculation-setting-content').should("exist");
    cy.get('[data-cy="matriculation-setting-option').first().click();
  });
});
